/* eslint-disable camelcase */
import { map, combineLatest } from 'rxjs';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { mapTransactionToEntity } from 'src/services/CozoDb/mapping';
import { dateToNumber } from 'src/utils/date';
import { NeuronAddress } from 'src/types/base';
import { QueuePriority } from 'src/services/QueueManager/types';

import { ServiceDeps } from '../types';
import { extractCybelinksFromTransaction } from '../utils/links';

import {
  fetchTransactionMessagesCount,
  fetchTransactionsIterable,
} from '../../../dataSource/blockchain/indexer';
import { Transaction } from '../../../dataSource/blockchain/types';
import { syncMyChats } from './services/chat';
import { TRANSACTIONS_BATCH_LIMIT } from '../../../dataSource/blockchain/consts';
import BaseSyncLoop from '../BaseSyncLoop/BaseSyncLoop';

class SyncTransactionsLoop extends BaseSyncLoop {
  protected getIsInitializedObserver(deps: ServiceDeps) {
    const isInitialized$ = combineLatest([
      deps.dbInstance$,
      deps.params$!,
      this.particlesResolver!.isInitialized$,
    ]).pipe(
      map(
        ([dbInstance, params, syncQueueInitialized]) =>
          !!dbInstance && !!syncQueueInitialized && !!params.myAddress
      )
    );

    return isInitialized$;
  }

  protected async sync() {
    const { myAddress } = this.params;
    await this.syncTransactions(myAddress!, myAddress!);

    this.statusApi.sendStatus('in-progress', `sync my chats`);
    const syncStatusItems = await syncMyChats(this.db!, myAddress!);

    this.channelApi.postSenseUpdate(syncStatusItems);
    this.statusApi.sendStatus('idle');
  }

  public async syncTransactions(
    myAddress: NeuronAddress,
    address: NeuronAddress
  ) {
    const { timestampRead, unreadCount, timestampUpdate } =
      await this.db!.getSyncStatus(myAddress, address, EntryType.transactions);

    const timestampFrom = timestampUpdate + 1; // ofsset + 1 to fix milliseconds precision bug

    this.statusApi.sendStatus('estimating');

    const totalMessageCount = await fetchTransactionMessagesCount(
      address,
      timestampFrom,
      this.abortController!.signal
    );

    console.log(
      `>>> syncTransactions - start ${address},  count: ${totalMessageCount}, from: ${timestampFrom}`
    );

    if (totalMessageCount > 0) {
      this.statusApi.sendStatus(
        'in-progress',
        `sync ${address}...`,
        this.progressTracker.start(
          Math.ceil(totalMessageCount / TRANSACTIONS_BATCH_LIMIT)
        )
      );

      const transactionsAsyncIterable = fetchTransactionsIterable(
        address,
        timestampFrom,
        [], // SENSE_TRANSACTIONS,
        'asc',
        TRANSACTIONS_BATCH_LIMIT,
        this.abortController?.signal
      );

      let transactionCount = 0;

      // eslint-disable-next-line no-restricted-syntax
      for await (const batch of transactionsAsyncIterable) {
        this.statusApi.sendStatus(
          'in-progress',
          `sync ${address}...`,
          this.progressTracker.trackProgress(1)
        );
        const lastTransaction = batch.at(-1)!;

        console.log(
          '--------syncTransactions batch ',
          this.abortController?.signal.aborted,
          timestampFrom,
          dateToNumber(lastTransaction.transaction.block.timestamp),
          myAddress,
          address,
          batch.length,
          batch.at(0)?.transaction.block.timestamp,
          batch.at(-1)?.transaction.block.timestamp,
          batch
        );

        const transactions = batch.map((i) =>
          mapTransactionToEntity(address, i)
        );

        transactionCount += batch.length;

        // save transaction
        await this.db!.putTransactions(transactions);

        // save links
        this.syncLinks(batch);

        const {
          transaction_hash,
          index,
          transaction: {
            block: { timestamp },
          },
        } = lastTransaction;

        // Update transaction sync items
        const syncItem = {
          ownerId: myAddress,
          entryType: EntryType.transactions,
          id: address,
          timestampUpdate: dateToNumber(timestamp),
          unreadCount: unreadCount + transactionCount,
          timestampRead,
          disabled: false,
          meta: {
            transaction_hash,
            index,
          },
        };
        const result = await this.db!.putSyncStatus(syncItem);
      }
    }
  }

  private async syncLinks(batch: Transaction[]) {
    const { tweets, particlesFound, links } =
      extractCybelinksFromTransaction(batch);
    if (links.length > 0) {
      await this.db!.putCyberlinks(links);
    }

    const tweetParticles = Object.keys(tweets);

    const nonTweetParticles = particlesFound.filter(
      (cid) => !tweetParticles.includes(cid)
    );

    // pre-resolve 'tweets' particles
    await this.particlesResolver!.enqueueBatch(
      tweetParticles,
      QueuePriority.HIGH
    );

    // pre-resolve all the rest particles
    if (nonTweetParticles.length > 0) {
      await this.particlesResolver!.enqueueBatch(
        nonTweetParticles,
        QueuePriority.LOW
      );
    }
  }
}

export default SyncTransactionsLoop;

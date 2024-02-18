/* eslint-disable camelcase */
import { map, combineLatest, Observable, from, defer, tap } from 'rxjs';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { mapTransactionToEntity } from 'src/services/CozoDb/mapping';
import { dateToNumber, numberToDate } from 'src/utils/date';
import { NeuronAddress } from 'src/types/base';
import { QueuePriority } from 'src/services/QueueManager/types';
import { SyncStatusDto } from 'src/services/CozoDb/types/dto';
import { SubscriptionResult } from 'react-apollo';
import { ServiceDeps } from '../types';
import { extractCybelinksFromTransaction } from '../utils/links';

import {
  fetchTransactionsIterable,
  mapMessagesByAddressVariables,
  fetchTransactionMessagesCount,
  gqlMessagesByAddress,
  TransactionsByAddressResponse,
} from '../../../indexer/transactions';
import { Transaction } from '../../../indexer/types';
import { syncMyChats } from './services/chat';
import { TRANSACTIONS_BATCH_LIMIT } from '../../../dataSource/blockchain/consts';
import BaseSyncClient from '../BaseSyncLoop/BaseSyncClient';
import { createRxJsClient } from '../../../indexer/utils';

class SyncTransactionsLoop extends BaseSyncClient {
  protected createIsInitializedObserver(deps: ServiceDeps) {
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

  // eslint-disable-next-line class-methods-use-this
  protected createClientObservable(timestampFrom: number): Observable<any> {
    const { myAddress } = this.params;
    console.log(
      `>>> ${this.name} subscribe from ${numberToDate(timestampFrom)}`
    );

    const query = gqlMessagesByAddress('subscription');
    const variables = mapMessagesByAddressVariables({
      neuron: myAddress!,
      timestampFrom,
      types: [],
      orderDirection: 'desc',
      limit: 100,
    });

    return createRxJsClient(query, variables).pipe(
      tap(() => this.statusApi.sendStatus('listen'))
    );
  }

  protected createInitObservable() {
    return defer(() => from(this.initSync()));
  }

  public async initSync() {
    const { myAddress } = this.params;

    const syncItem = await this.db!.getSyncStatus(
      myAddress!,
      myAddress!,
      EntryType.transactions
    );

    const lastTransactionTimestamp = await this.syncTransactions(
      myAddress!,
      myAddress!,
      syncItem
    );

    this.statusApi.sendStatus('in-progress', `sync my chats`);
    const syncStatusItems = await syncMyChats(
      this.db!,
      myAddress!,
      syncItem.timestampUpdate
    );

    this.channelApi.postSenseUpdate(syncStatusItems);
    this.statusApi.sendStatus('idle');

    return lastTransactionTimestamp;
  }

  protected async onUpdate(
    result: SubscriptionResult<TransactionsByAddressResponse>
  ) {
    if (!result.data) {
      console.error(`${this.name} WS error ${result.error?.message}`);
      throw result.error;
    }
    if (result.data.messages_by_address.length > 0) {
      console.log(
        `>>> ${this.name} recived ${result.data.messages_by_address.length} updates `
      );
      const { myAddress } = this.params;
      const syncItem = await this.db!.getSyncStatus(
        myAddress!,
        myAddress!,
        EntryType.transactions
      );

      await this.processBatchTransactions(
        myAddress!,
        myAddress!,
        result.data!.messages_by_address,
        syncItem
      );

      this.statusApi.sendStatus('in-progress', `sync my chats`);
      const syncStatusItems = await syncMyChats(
        this.db!,
        myAddress!,
        syncItem.timestampUpdate
      );

      this.channelApi.postSenseUpdate(syncStatusItems);
      this.statusApi.sendStatus('listen');
    }
  }

  public async processBatchTransactions(
    myAddress: NeuronAddress,
    address: NeuronAddress,
    batch: Transaction[],
    syncItem: SyncStatusDto
  ) {
    const { timestampRead, unreadCount } = syncItem;

    console.log(
      '--------syncTransactions batch ',
      this.abortController?.signal.aborted,
      myAddress,
      address,
      batch.length,
      batch.at(0)?.transaction.block.timestamp,
      batch.at(-1)?.transaction.block.timestamp,
      batch
    );

    const transactions = batch.map((i) => mapTransactionToEntity(address, i));

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
    } = batch.at(-1)!;

    const lastTimestampFrom = dateToNumber(timestamp);

    // Update transaction sync items
    const newSyncItem = {
      ownerId: myAddress,
      entryType: EntryType.transactions,
      id: address,
      timestampUpdate: lastTimestampFrom,
      unreadCount: unreadCount + batch.length,
      timestampRead,
      disabled: false,
      meta: {
        transaction_hash,
        index,
      },
    };

    await this.db!.putSyncStatus(newSyncItem);

    return lastTimestampFrom;
  }

  public async syncTransactions(
    myAddress: NeuronAddress,
    address: NeuronAddress,
    syncItem: SyncStatusDto
  ) {
    const { unreadCount, timestampUpdate } = syncItem;
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

    if (totalMessageCount === 0) {
      return timestampFrom;
    }

    this.statusApi.sendStatus(
      'in-progress',
      `sync ${address}...`,
      this.progressTracker.start(
        Math.ceil(totalMessageCount / TRANSACTIONS_BATCH_LIMIT)
      )
    );

    const transactionsAsyncIterable = fetchTransactionsIterable({
      neuron: address,
      timestampFrom,
      types: [], // SENSE_TRANSACTIONS,
      orderDirection: 'asc',
      limit: TRANSACTIONS_BATCH_LIMIT,
      abortSignal: this.abortController?.signal,
    });

    let transactionCount = 0;
    let lastTimestampFrom = timestampFrom;

    // eslint-disable-next-line no-restricted-syntax
    for await (const batch of transactionsAsyncIterable) {
      this.statusApi.sendStatus(
        'in-progress',
        `sync ${address}...`,
        this.progressTracker.trackProgress(1)
      );

      transactionCount += batch.length;

      lastTimestampFrom = await this.processBatchTransactions(
        myAddress,
        address,
        batch,
        {
          ...syncItem,
          unreadCount: unreadCount + transactionCount,
        }
      );
    }

    return lastTimestampFrom;
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

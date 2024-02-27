/* eslint-disable camelcase */
import {
  map,
  combineLatest,
  Observable,
  from,
  defer,
  tap,
  distinctUntilChanged,
  merge,
  filter,
} from 'rxjs';
import { isEmpty } from 'lodash';

import { EntryType } from 'src/services/CozoDb/types/entities';
import { mapIndexerTransactionToEntity } from 'src/services/CozoDb/mapping';
import { numberToDate } from 'src/utils/date';
import { NeuronAddress } from 'src/types/base';
import { QueuePriority } from 'src/services/QueueManager/types';
import { SyncStatusDto, TransactionDto } from 'src/services/CozoDb/types/dto';
import { asyncIterableBatchProcessor } from 'src/utils/async/iterable';
import { throwIfAborted } from 'src/utils/async/promise';
import {
  createWebSocketObservable,
  getIncomingTransfersQuery,
} from 'src/services/blockchain/websocket';
import { mapWsDataToTransactions } from 'src/services/blockchain/utils/mapping';

import { ServiceDeps } from '../types';
import { extractCybelinksFromTransaction } from '../utils/links';

import {
  fetchTransactionsIterable,
  mapMessagesByAddressVariables,
  fetchTransactionMessagesCount,
  gqlMessagesByAddress,
  TransactionsByAddressResponse,
} from '../../../indexer/transactions';
import { syncMyChats } from './services/chat';
import { TRANSACTIONS_BATCH_LIMIT } from '../../../dataSource/blockchain/consts';
import BaseSyncClient from '../BaseSyncLoop/BaseSyncClient';
import { createRxJsClient } from '../../../indexer/utils';
import { SyncServiceParams } from '../../types';
import { MAX_DATABASE_PUT_SIZE } from '../consts';

type DataStreamResult = {
  source: 'indexer' | 'node';
  transactions: TransactionDto[];
};

class SyncTransactionsLoop extends BaseSyncClient {
  protected createIsInitializedObserver(deps: ServiceDeps) {
    const isInitialized$ = combineLatest([
      deps.dbInstance$,
      deps.params$!.pipe(
        map((params) => params.myAddress),
        distinctUntilChanged()
      ),
      this.particlesResolver!.isInitialized$,
    ]).pipe(
      map(
        ([dbInstance, myAddress, syncQueueInitialized]) =>
          !!dbInstance && !!syncQueueInitialized && !!myAddress
      )
    );

    return isInitialized$;
  }

  // eslint-disable-next-line class-methods-use-this
  protected createClientObservable(
    timestampFrom: number
  ): Observable<DataStreamResult> {
    const { myAddress } = this.params;
    console.log(
      `>>> ${this.name} subscribe ${myAddress} from ${numberToDate(
        timestampFrom
      )}`
    );

    const variables = mapMessagesByAddressVariables({
      neuron: myAddress!,
      timestampFrom,
      types: [],
      orderDirection: 'desc',
      limit: 100,
    });

    const indexerObservable$ = createRxJsClient<TransactionsByAddressResponse>(
      gqlMessagesByAddress('subscription'),
      variables
    ).pipe(
      map((response: TransactionsByAddressResponse) => {
        return {
          source: 'indexer',
          transactions: response.messages_by_address.map((i) =>
            mapIndexerTransactionToEntity(myAddress!, i)
          ),
        };
      })
    );

    const nodeObservample$ = createWebSocketObservable(
      myAddress!,
      getIncomingTransfersQuery(myAddress!)
    ).pipe(
      filter((data) => !isEmpty(data)),
      map((data) => ({
        source: 'node',
        transactions: [mapWsDataToTransactions(myAddress!, data)],
      }))
    );

    return merge(
      indexerObservable$,
      nodeObservample$
    ) as Observable<DataStreamResult>;
  }

  protected createInitObservable() {
    return defer(() => from(this.initSync()));
    // return from(this.initSync());
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
    { source, transactions }: DataStreamResult,
    params: SyncServiceParams
  ) {
    // if (!result.data) {
    //   console.error(`${this.name} WS error ${result.error?.message}`);
    //   throw result.error;
    // }
    const { myAddress } = params;
    // if (result.data.messages_by_address.length > 0) {
    //   console.log(
    //     `>>> ${this.name} ${myAddress} recived ${result.data.messages_by_address.length} updates `
    //   );

    const syncItem = await this.db!.getSyncStatus(
      myAddress!,
      myAddress!,
      EntryType.transactions
    );

    await this.processBatchTransactions(
      myAddress!,
      myAddress!,
      transactions,
      syncItem,
      source
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

  public async processBatchTransactions(
    myAddress: NeuronAddress,
    address: NeuronAddress,
    transactions: TransactionDto[],
    syncItem: SyncStatusDto,
    source: DataStreamResult['source']
  ) {
    const { signal } = this.abortController;
    const { timestampRead, unreadCount } = syncItem;

    console.log(
      '--------syncTransactions batch ',
      this.abortController?.signal.aborted,
      myAddress,
      address,
      transactions.length,
      transactions.at(0)?.timestamp,
      transactions.at(-1)?.timestamp,
      transactions,
      source
    );

    // save transaction
    await throwIfAborted(this.db!.putTransactions, signal)(transactions);

    // save links
    this.syncLinks(transactions, signal);

    const {
      hash,
      index,

      timestamp,
    } = transactions.at(-1)!;

    const lastTimestampFrom = timestamp;

    // Update transaction sync items
    const newSyncItem = {
      ownerId: myAddress,
      entryType: EntryType.transactions,
      id: address,
      timestampUpdate: lastTimestampFrom,
      unreadCount: unreadCount + transactions.length,
      timestampRead,
      disabled: false,
      meta: {
        transaction_hash: hash,
        index,
      },
    };

    await throwIfAborted(this.db!.putSyncStatus, signal)(newSyncItem);

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

      const transactions = batch.map((i) =>
        mapIndexerTransactionToEntity(address, i)
      );

      lastTimestampFrom = await this.processBatchTransactions(
        myAddress,
        address,
        transactions,
        {
          ...syncItem,
          unreadCount: unreadCount + transactionCount,
        },
        'indexer'
      );
    }

    return lastTimestampFrom;
  }

  private async syncLinks(batch: TransactionDto[], signal: AbortSignal) {
    const { tweets, particlesFound, links } =
      extractCybelinksFromTransaction(batch);
    if (links.length > 0) {
      await asyncIterableBatchProcessor(
        links,
        (links) => throwIfAborted(this.db!.putCyberlinks, signal)(links),
        MAX_DATABASE_PUT_SIZE
      );
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

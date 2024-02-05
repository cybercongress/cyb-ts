/* eslint-disable camelcase */
import { Observable, defer, from, map, combineLatest } from 'rxjs';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { broadcastStatus } from 'src/services/backend/channels/broadcastStatus';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { mapTransactionToEntity } from 'src/services/CozoDb/mapping';
import { dateToNumber } from 'src/utils/date';
import { NeuronAddress } from 'src/types/base';
import { QueuePriority } from 'src/services/QueueManager/types';

import DbApi from '../../../dataSource/indexedDb/dbApiWrapper';

import { ServiceDeps } from '../types';
import {
  // fetchCyberlinksAndResolveParticles,
  extractCybelinksFromTransaction as extractLinksDataFromTransaction,
} from '../utils/links';
import { createLoopObservable } from '../utils/rxjs';
// import { MAX_PARRALEL_TRANSACTIONS, SENSE_TRANSACTIONS } from '../consts';
import ParticlesResolverQueue from '../ParticlesResolverQueue/ParticlesResolverQueue';
// import { changeSyncStatus } from '../../utils';
import { SyncServiceParams } from '../../types';

import {
  // fetchLinksCount,
  fetchTransactionMessagesCount,
  fetchTransactionsIterable,
} from '../../../dataSource/blockchain/indexer';
import { Transaction } from '../../../dataSource/blockchain/types';
import { syncMyChats } from './services/chat';
import { ProgressTracker } from '../ProgressTracker/ProgressTracker';
// import { CID_TWEET } from 'src/utils/consts';

class SyncTransactionsLoop {
  private isInitialized$: Observable<boolean>;

  private channelApi = new BroadcastChannelSender();

  private db: DbApi | undefined;

  private particlesResolver: ParticlesResolverQueue | undefined;

  private intervalMs: number;

  private inProgress: NeuronAddress[] = [];

  private _loop$: Observable<any> | undefined;

  private progressTracker = new ProgressTracker();

  public get loop$(): Observable<any> | undefined {
    return this._loop$;
  }

  private statusApi = broadcastStatus('transaction', this.channelApi);

  private params: SyncServiceParams = {
    myAddress: null,
    followings: [],
  };

  constructor(
    deps: ServiceDeps,
    particlesResolver: ParticlesResolverQueue,
    intervalMs: number
  ) {
    if (!deps.params$) {
      throw new Error('params$ is not defined');
    }

    this.intervalMs = intervalMs;

    this.particlesResolver = particlesResolver;

    deps.dbInstance$.subscribe((db) => {
      this.db = db;
    });

    deps.params$.subscribe((params) => {
      this.params = params;
    });

    this.isInitialized$ = combineLatest([
      deps.dbInstance$,
      deps.params$,
      particlesResolver.isInitialized$,
    ]).pipe(
      map(
        ([dbInstance, params, syncQueueInitialized]) =>
          !!dbInstance &&
          !!syncQueueInitialized &&
          !!params.cyberIndexUrl &&
          !!params.myAddress
      )
    );
  }

  start() {
    this._loop$ = createLoopObservable(
      this.intervalMs,
      this.isInitialized$,
      defer(() => from(this.syncAllTransactions())),
      () => this.statusApi.sendStatus('estimating')
    );

    this._loop$.subscribe({
      next: (result) => this.statusApi.sendStatus('idle'),
      error: (err) => this.statusApi.sendStatus('error', err.toString()),
    });

    return this;
  }

  private async syncAllTransactions() {
    try {
      const { myAddress, cyberIndexUrl } = this.params;
      await this.syncTransactions(myAddress!, myAddress!, cyberIndexUrl!);

      this.statusApi.sendStatus('in-progress', `sync my chats`);
      const syncStatusItems = await syncMyChats(this.db!, myAddress!);

      this.channelApi.postSenseUpdate(syncStatusItems);
      this.statusApi.sendStatus('idle');
    } catch (err) {
      console.error('>>> syncAllTransactions', err);
      throw err;
    }
  }

  public async syncTransactions(
    myAddress: NeuronAddress,
    address: NeuronAddress,
    cyberIndexUrl: string
  ) {
    try {
      if (this.inProgress.includes(address)) {
        console.log(`>> ${address} sync already in progress`);
        return;
      }

      // add to in-progress list
      this.inProgress.push(address);

      const { timestampRead, unreadCount, timestampUpdate } =
        await this.db!.getSyncStatus(
          myAddress,
          address,
          EntryType.transactions
        );

      const timestampFrom = timestampUpdate + 1; // ofsset + 1 to fix milliseconds precision bug

      this.statusApi.sendStatus('estimating');

      const totalMessageCount = await fetchTransactionMessagesCount(
        cyberIndexUrl,
        address,
        timestampFrom
      );

      if (totalMessageCount > 0) {
        this.progressTracker.start(totalMessageCount);

        this.statusApi.sendStatus(
          'in-progress',
          `sync ${address}...`,
          this.progressTracker.progress
        );

        const transactionsAsyncIterable = fetchTransactionsIterable(
          cyberIndexUrl,
          address,
          timestampFrom,
          [], // SENSE_TRANSACTIONS,
          'asc'
        );

        let transactionCount = 0;

        // eslint-disable-next-line no-restricted-syntax
        for await (const batch of transactionsAsyncIterable) {
          console.log(
            '--------syncTransactions start',
            new Date().toLocaleDateString(),
            address,
            batch.length,
            batch.at(0)?.transaction.block.timestamp,
            batch.at(-1)?.transaction.block.timestamp,
            batch
          );
          if (batch.length > 0) {
            // pick last transaction = first item based on request orderby
            const lastTransaction = batch.at(-1)!;

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

            this.statusApi.sendStatus(
              'in-progress',
              `sync ${address}...`,
              this.progressTracker.trackProgress(batch.length)
            );
          }
        }
      }
    } finally {
      // remove from in-progress list
      this.inProgress = this.inProgress.filter((addr) => addr !== address);
    }
  }

  private async syncLinks(batch: Transaction[]) {
    const { tweets, particlesFound, links } =
      extractLinksDataFromTransaction(batch);
    let result;
    if (links.length > 0) {
      result = await this.db!.putCyberlinks(links);
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

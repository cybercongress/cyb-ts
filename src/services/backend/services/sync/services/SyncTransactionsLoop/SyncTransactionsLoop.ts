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
import { extractCybelinksFromTransaction } from '../utils/links';
import { createLoopObservable } from '../utils/rxjs/loop';
import ParticlesResolverQueue from '../ParticlesResolverQueue/ParticlesResolverQueue';
import { SyncServiceParams } from '../../types';

import {
  fetchTransactionMessagesCount,
  fetchTransactionsIterable,
} from '../../../dataSource/blockchain/indexer';
import { Transaction } from '../../../dataSource/blockchain/types';
import { syncMyChats } from './services/chat';
import { ProgressTracker } from '../ProgressTracker/ProgressTracker';
import { TRANSACTIONS_BATCH_LIMIT } from '../../../dataSource/blockchain/consts';
import { changeMyAddress } from '../utils/loop_XXXX';
import { MY_SYNC_INTERVAL } from '../consts';

class SyncTransactionsLoop {
  private isInitialized$: Observable<boolean>;

  private channelApi = new BroadcastChannelSender();

  private db: DbApi | undefined;

  private particlesResolver: ParticlesResolverQueue | undefined;

  private inProgress: NeuronAddress[] = [];

  private _loop$: Observable<any> | undefined;

  private restartLoop: (() => void) | undefined;

  private abortController: AbortController | undefined;

  private progressTracker = new ProgressTracker();

  public get loop$(): Observable<any> | undefined {
    return this._loop$;
  }

  private statusApi = broadcastStatus('transaction', this.channelApi);

  private params: SyncServiceParams = {
    myAddress: null,
    followings: [],
  };

  constructor(deps: ServiceDeps, particlesResolver: ParticlesResolverQueue) {
    if (!deps.params$) {
      throw new Error('params$ is not defined');
    }

    this.particlesResolver = particlesResolver;

    deps.dbInstance$.subscribe((db) => {
      this.db = db;
    });

    deps.params$.subscribe((params) => {
      // restart on address change
      this.params = changeMyAddress(
        this.params,
        params,
        this.restart.bind(this)
      );
    });

    this.isInitialized$ = combineLatest([
      deps.dbInstance$,
      deps.params$,
      particlesResolver.isInitialized$,
    ]).pipe(
      map(
        ([dbInstance, params, syncQueueInitialized]) =>
          !!dbInstance && !!syncQueueInitialized && !!params.myAddress
      )
    );
  }

  private restart() {
    this.abortController?.abort();
    this.restartLoop?.();
  }

  start() {
    const { loop$, restart } = createLoopObservable(
      MY_SYNC_INTERVAL,
      this.isInitialized$,
      defer(() => from(this.sync())),
      {
        onError: (error) => {
          this.statusApi.sendStatus('error', error.toString());
        },
      }
    );
    this._loop$ = loop$;
    this.restartLoop = restart;
    this._loop$.subscribe((result) => this.statusApi.sendStatus('idle'));

    return this;
  }

  private async sync() {
    try {
      const { myAddress } = this.params;
      await this.syncTransactions(myAddress!, myAddress!);

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
    address: NeuronAddress
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
        address,
        timestampFrom
      );
      console.log(
        '--------syncTransactions  start',
        totalMessageCount,
        timestampFrom
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
          TRANSACTIONS_BATCH_LIMIT
        );

        let transactionCount = 0;

        // eslint-disable-next-line no-restricted-syntax
        for await (const batch of transactionsAsyncIterable) {
          this.statusApi.sendStatus(
            'in-progress',
            `sync ${address}...`,
            this.progressTracker.trackProgress(1) //batch.length
          );
          const lastTransaction = batch.at(-1)!;

          console.log(
            '--------syncTransactions batch ',
            timestampFrom,
            dateToNumber(lastTransaction.transaction.block.timestamp),
            myAddress,
            address,
            batch.length,
            batch.at(0)?.transaction.block.timestamp,
            batch.at(-1)?.transaction.block.timestamp,
            batch
          );
          // pick last transaction = first item based on request orderby

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
    } finally {
      // remove from in-progress list
      this.inProgress = this.inProgress.filter((addr) => addr !== address);
    }
  }

  private async syncLinks(batch: Transaction[]) {
    const { tweets, particlesFound, links } =
      extractCybelinksFromTransaction(batch);
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

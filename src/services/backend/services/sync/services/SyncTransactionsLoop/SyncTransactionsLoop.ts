/* eslint-disable camelcase */
import { Observable, defer, from, map, combineLatest } from 'rxjs';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { broadcastStatus } from 'src/services/backend/channels/broadcastStatus';
import { EntryType } from 'src/services/CozoDb/types/entities';
import {
  mapLinkFromIndexerToDbEntity,
  mapTransactionToEntity,
} from 'src/services/CozoDb/mapping';
import { dateToNumber } from 'src/utils/date';
import { NeuronAddress } from 'src/types/base';
import { QueuePriority } from 'src/services/QueueManager/types';
import { SyncStatusDto } from 'src/services/CozoDb/types/dto';

import DbApi from '../../../dataSource/indexedDb/dbApiWrapper';

import { ServiceDeps } from '../types';
import {
  fetchCyberlinksAndResolveParticles,
  extractCybelinksFromTransaction,
} from '../utils/links';
import { createLoopObservable } from '../utils/rxjs';
import { MAX_PARRALEL_TRANSACTIONS, SENSE_TRANSACTIONS } from '../consts';
import ParticlesResolverQueue from '../ParticlesResolverQueue/ParticlesResolverQueue';
import { changeSyncStatus } from '../../utils';
import { LinkResult, SyncServiceParams } from '../../types';

import { fetchTransactionsIterable } from '../../../dataSource/blockchain/indexer';
import { Transaction } from '../../../dataSource/blockchain/types';
import { syncMyChats } from './services/chat';
import {
  SenseMetaType,
  SenseParticleResultMeta,
  SenseTransactionResultMeta,
} from 'src/services/backend/types/sense';

class SyncTransactionsLoop {
  private isInitialized$: Observable<boolean>;

  private channelApi = new BroadcastChannelSender();

  private db: DbApi | undefined;

  private particlesResolver: ParticlesResolverQueue | undefined;

  private intervalMs: number;

  private inProgress: NeuronAddress[] = [];

  private _loop$: Observable<any> | undefined;

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
      () => this.statusApi.sendStatus('in-progress')
    );

    this._loop$.subscribe({
      next: (result) => this.statusApi.sendStatus('idle'),
      error: (err) => this.statusApi.sendStatus('error', err.toString()),
    });

    return this;
  }

  private async syncAllTransactions() {
    try {
      await this.syncTransactions(
        this.params.myAddress!,
        this.params.myAddress!
      );
      this.statusApi.sendStatus('in-progress', `sync my chats`);

      const syncStatusItems = await syncMyChats(
        this.db!,
        this.params.myAddress!
      );
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

      this.statusApi.sendStatus('in-progress', `sync ${address}...`);

      const { timestampRead, unreadCount, timestampUpdate } =
        await this.db!.getSyncStatus(
          myAddress,
          address,
          EntryType.transactions
        );

      const transactionsAsyncIterable = fetchTransactionsIterable(
        this.params.cyberIndexUrl!,
        address,
        timestampUpdate + 1, // ofsset + 1 to fix milliseconds precision bug
        SENSE_TRANSACTIONS
      );

      let count = 0;

      let lastTransaction: Transaction | undefined;
      // eslint-disable-next-line no-restricted-syntax
      for await (const batch of transactionsAsyncIterable) {
        console.log(
          '--------syncTransactions start',
          new Date().toLocaleDateString(),
          address,
          batch.length,
          batch.at(0)?.transaction.block.timestamp,
          batch
        );
        if (batch.length > 0) {
          // pick last transaction = first item based on request orderby
          if (!lastTransaction) {
            lastTransaction = batch.at(0)!;
          }

          const transactions = batch.map((i) =>
            mapTransactionToEntity(address, i)
          );
          // console.log('---syncTransactions putTransactions ', transactions);
          count += batch.length;
          await this.db!.putTransactions(transactions);

          const { tweets, particlesFound, links } =
            extractCybelinksFromTransaction(batch);

          const tweetParticles = Object.keys(tweets);
          this.statusApi.sendStatus(
            'in-progress',
            `sync ${address} batch processing - links: ${links.length}, tweets: ${tweetParticles.length}, particles: ${particlesFound.length}...`
          );

          // resolve 'tweets' particles
          await this.particlesResolver!.enqueueBatch(
            tweetParticles,
            QueuePriority.HIGH
          );

          if (links.length > 0) {
            await this.db!.putCyberlinks(links);
          }
          const nonTweetParticles = particlesFound.filter(
            (cid) => !tweetParticles.includes(cid)
          );

          if (nonTweetParticles.length > 0) {
            await this.particlesResolver!.enqueueBatch(
              nonTweetParticles,
              QueuePriority.LOW
            );
          }

          // add all tweets to sync status
          await this.addTweetsToSync(tweets, myAddress);
        }
      }

      const unreadTransactionsCount = unreadCount + count;

      if (lastTransaction) {
        // Update transaction
        const syncItem = {
          ownerId: myAddress,
          entryType: EntryType.transactions,
          id: address,
          timestampUpdate: dateToNumber(
            lastTransaction.transaction.block.timestamp
          ),
          unreadCount: unreadTransactionsCount,
          timestampRead,
          disabled: false,
          lastId: lastTransaction.transaction_hash,
          meta: {
            memo: lastTransaction?.transaction?.memo || '',
          },
        };
        const result = await this.db!.putSyncStatus(syncItem);
        if (result.ok) {
          this.channelApi.postSenseUpdate([
            {
              ...syncItem,
              meta: {
                metaType: SenseMetaType.transaction,
                ...syncItem.meta,
                value: lastTransaction.value,
              } as SenseTransactionResultMeta,
            },
          ]);
        }
      }
    } finally {
      // remove from in-progress list
      this.inProgress = this.inProgress.filter((addr) => addr !== address);
    }
  }

  private async addTweetsToSync(
    tweets: Record<string, LinkResult>,
    myAddress: string
  ) {
    const tweetCids = Object.keys(tweets);
    const batchSize = MAX_PARRALEL_TRANSACTIONS;
    for (let i = 0; i < tweetCids.length; i += batchSize) {
      const batch = tweetCids.slice(i, i + batchSize);
      // eslint-disable-next-line no-await-in-loop
      const syncStatusEntities = await Promise.all(
        batch.map(async (cid) => {
          const { timestamp, direction, from, to } = tweets[cid];

          // Initial state
          const syncStatus = {
            ownerId: myAddress,
            id: cid as string,
            entryType: EntryType.particle,
            timestampUpdate: timestamp,
            timestampRead: timestamp,
            unreadCount: 0,
            lastId: direction === 'from' ? from : to,
            disabled: false,
            meta: { direction },
          } as SyncStatusDto;

          const links = await fetchCyberlinksAndResolveParticles(
            this.params!.cyberIndexUrl!,
            cid,
            timestamp,
            this.particlesResolver!,
            QueuePriority.HIGH
          );

          if (links.length > 0) {
            const entities = links.map(mapLinkFromIndexerToDbEntity);
            await this.db!.putCyberlinks(entities);

            return changeSyncStatus(syncStatus, links);
          }

          return syncStatus;
        })
      );

      if (syncStatusEntities.length > 0) {
        // eslint-disable-next-line no-await-in-loop
        const result = await this.db!.putSyncStatus(syncStatusEntities);

        if (result.ok) {
          // eslint-disable-next-line no-await-in-loop
          const syncStatusItems = await Promise.all(
            syncStatusEntities.map(async (item) => {
              const { result: particle } =
                await this.particlesResolver!.fetchDirect(item.id);
              const { result: lastParticle } =
                await this.particlesResolver!.fetchDirect(item.lastId);

              return {
                ...item,
                meta: {
                  metaType: SenseMetaType.particle,
                  ...item.meta,
                  id: {
                    cid: particle?.cid,
                    text: particle?.textPreview,
                    mime: particle?.meta.mime,
                  },
                  lastId: {
                    cid: lastParticle?.cid,
                    text: lastParticle?.textPreview,
                    mime: lastParticle?.meta.mime,
                  },
                } as SenseParticleResultMeta,
              };
            })
          );
          this.channelApi.postSenseUpdate(syncStatusItems);
        }
      }
    }
  }
}

export default SyncTransactionsLoop;

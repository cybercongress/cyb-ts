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
import { CID_TWEET } from 'src/utils/consts';
import { executeSequentially } from 'src/utils/async/promise';

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

import { fetchTransactionsIterable } from '../../../dataSource/blockchain/requests';
import {
  CYBER_LINK_TRANSACTION_TYPE,
  MSG_MULTI_SEND_TRANSACTION_TYPE,
  MSG_SEND_TRANSACTION_TYPE,
  Transaction,
} from '../../../dataSource/blockchain/types';
import { syncMyChats } from './services/chat';

type SyncTransactionMode = 'my' | 'friends';

class SyncTransactionsLoop {
  private isInitialized$: Observable<boolean>;

  private isInitialized = false;

  private db: DbApi | undefined;

  private particlesResolver: ParticlesResolverQueue | undefined;

  private mode: SyncTransactionMode;

  private intervalMs: number;

  private inProgress: NeuronAddress[] = [];

  private _loop$: Observable<any> | undefined;

  public get loop$(): Observable<any> | undefined {
    return this._loop$;
  }

  private statusApi = broadcastStatus(
    'transaction',
    new BroadcastChannelSender()
  );

  private params: SyncServiceParams = {
    myAddress: null,
    followings: [],
  };

  constructor(
    deps: ServiceDeps,
    particlesResolver: ParticlesResolverQueue,
    mode: SyncTransactionMode,
    intervalMs: number
  ) {
    if (!deps.params$) {
      throw new Error('params$ is not defined');
    }

    this.mode = mode;

    this.intervalMs = intervalMs;

    this.particlesResolver = particlesResolver;

    deps.dbInstance$.subscribe((db) => {
      this.db = db;
    });

    deps.params$.subscribe((params) => {
      this.params = params;
      if (this.isInitialized) {
        // executeSequentially
        const newFriends = params.followings
          .map((addr) =>
            this.params.followings.includes(addr) ? addr : undefined
          )
          .filter((addr) => !!addr) as NeuronAddress[];

        this.isInitialized &&
          executeSequentially(
            newFriends.map(
              (addr) => () =>
                this.syncTransactions(this.params.myAddress!, addr, true)
            )
          );
      }
    });

    // this.isInitialized$ = isInitialized$;

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
          !!params.myAddress &&
          (mode === 'my' ||
            (mode === 'friends' && params.followings.length > 0))
      )
    );

    this.isInitialized$.subscribe((isInitialized) => {
      this.isInitialized = isInitialized;
    });
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
    console.log('----syncAllTransactions', this.mode, this.params);
    try {
      if (this.params.myAddress) {
        if (this.mode === 'my') {
          await this.syncTransactions(
            this.params.myAddress,
            this.params.myAddress,
            false
          );
          this.statusApi.sendStatus('in-progress', `sync my chats`);
          await syncMyChats(this.db!, this.params.myAddress);
          this.statusApi.sendStatus('idle');
        }

        if (this.mode === 'friends') {
          // eslint-disable-next-line no-restricted-syntax
          for await (const addr of this.params.followings) {
            console.log('----sync friend', addr);
            await this.syncTransactions(this.params.myAddress, addr, true);
          }
        }
      }
    } catch (err) {
      console.error('>>> syncAllTransactions', err);
      throw err;
    }
  }

  public async syncTransactions(
    myAddress: NeuronAddress,
    address: NeuronAddress,
    lightMode: boolean
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
        await this.db!.getSyncStatus(myAddress, address);

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
        let items = batch;

        // filter messages to/from me and twitter links
        if (lightMode) {
          const { myAddress } = this.params;
          items = batch.filter(
            (t) =>
              (t.type === MSG_SEND_TRANSACTION_TYPE &&
                (t.value.from_address === myAddress ||
                  t.value.to_address === myAddress)) ||
              (t.type === MSG_MULTI_SEND_TRANSACTION_TYPE &&
                (t.value.inputs.find((i) => i.address === myAddress) ||
                  t.value.outputs.find((o) => o.address === myAddress))) ||
              (t.type === CYBER_LINK_TRANSACTION_TYPE &&
                t.value.links.some((l) => l.from === CID_TWEET))
          );

          if (address === 'bostrom1d8754xqa9245pctlfcyv8eah468neqzn3a0y0t') {
            console.log('------light trans', address, items, batch);
            // debugger;
          }
        }
        console.log(
          '--------syncTransactions start',
          new Date().toLocaleDateString(),
          address,
          batch.length,
          items.length,
          items.at(0)?.transaction.block.timestamp,
          items
        );
        if (items.length > 0) {
          // pick last transaction = first item based on request orderby
          if (!lastTransaction) {
            lastTransaction = items.at(0)!;
          }

          const transactions = items.map((i) =>
            mapTransactionToEntity(address, i)
          );
          // console.log('---syncTransactions putTransactions ', transactions);
          count += items.length;
          await this.db!.putTransactions(transactions);

          const { tweets, particlesFound, links } =
            extractCybelinksFromTransaction(items);

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

          // Add cyberlink to sync observables
          if (links.length > 0) {
            await this.db!.putCyberlinks(links);
          }
          if (!lightMode) {
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
      }

      const unreadTransactionsCount = unreadCount + count;

      if (lastTransaction) {
        // Update transaction
        this.db!.putSyncStatus({
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
          meta: { memo: lastTransaction?.transaction?.memo || '' },
        });
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
        this.db!.putSyncStatus(syncStatusEntities);
      }
    }
  }
}

export default SyncTransactionsLoop;

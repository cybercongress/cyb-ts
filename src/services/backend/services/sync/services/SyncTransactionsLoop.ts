import { Observable, defer, from, map, combineLatest } from 'rxjs';
import BroadcastChannelSender, {
  broadcastStatus,
} from 'src/services/backend/channels/BroadcastChannelSender';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { mapTransactionToEntity } from 'src/services/CozoDb/mapping';
import { dateToNumber } from 'src/utils/date';
import { NeuronAddress, TransactionHash } from 'src/types/base';

import DbApi from '../../dataSource/indexedDb/dbApiWrapper';

import { ServiceDeps } from './types';
import { createLoopObservable } from './utils';
import { BLOCKCHAIN_SYNC_INTERVAL } from './consts';
import SyncQueue from './SyncQueue';
import { extractParticlesResults, fetchCyberlinksAndGetStatus } from '../utils';
import { FetchIpfsFunc, SyncQueueItem, SyncServiceParams } from '../types';

import { fetchTransactionsIterable } from '../../dataSource/blockchain/requests';

class SyncTransactionsLoop {
  private isInitialized$: Observable<boolean>;

  private db: DbApi | undefined;

  private syncQueue: SyncQueue | undefined;

  private statusApi = broadcastStatus(
    'transaction',
    new BroadcastChannelSender()
  );

  private params: SyncServiceParams = {
    myAddress: null,
    followings: [],
  };

  private resolveAndSaveParticle: FetchIpfsFunc;

  constructor(deps: ServiceDeps, syncQueue: SyncQueue) {
    if (!deps.resolveAndSaveParticle) {
      throw new Error('resolveAndSaveParticle is not defined');
    }

    if (!deps.params$) {
      throw new Error('params$ is not defined');
    }

    this.syncQueue = syncQueue;

    deps.dbInstance$.subscribe((db) => {
      console.log('---subscribe dbInstance', this.db);
      this.db = db;
    });

    deps.params$.subscribe((params) => {
      this.params = params;
    });

    this.resolveAndSaveParticle = deps.resolveAndSaveParticle;

    // this.isInitialized$ = isInitialized$;

    this.isInitialized$ = combineLatest([
      deps.dbInstance$,
      deps.params$,
      syncQueue.isInitialized$,
    ]).pipe(
      map(
        ([dbInstance, params, syncQueueInitialized]) =>
          !!dbInstance && !!syncQueueInitialized && !!params.cyberIndexUrl
      )
    );
  }

  start() {
    createLoopObservable(
      BLOCKCHAIN_SYNC_INTERVAL,
      this.isInitialized$,
      defer(() => from(this.syncAllTransactions())),
      () => this.statusApi.sendStatus('in-progress')
    ).subscribe({
      next: (result) => this.statusApi.sendStatus('idle'),
      error: (err) => this.statusApi.sendStatus('error', err.toString()),
    });

    return this;
  }

  private async syncAllTransactions() {
    console.log('---syncAllTransactions', this.db);
    try {
      this.params.myAddress &&
        (await this.syncTransactions(this.params.myAddress, true));

      await Promise.all(
        this.params.followings.map((addr) => this.syncTransactions(addr))
      );
    } catch (err) {
      console.error('>>> syncAllTransactions', err);
      throw err;
    }
  }

  private async syncTransactions(
    address: NeuronAddress,
    addCyberlinksToSync = false
  ) {
    this.statusApi.sendStatus('in-progress', `sync ${address}...`);
    // let conter = 0;

    const { timestampRead, unreadCount, timestampUpdate } =
      await this.db!.getSyncStatus(address);
    console.log(
      '--------syncTransactions',
      address,
      timestampRead,
      unreadCount,
      timestampUpdate
    );
    const transactionsAsyncIterable = fetchTransactionsIterable(
      this.params.cyberIndexUrl!,
      address,
      timestampUpdate + 1 // ofsset + 1 to fix milliseconds precision bug
    );

    let count = 0;
    let lastTimestamp: number | undefined;
    let lastTransactionHash: TransactionHash = '';
    // eslint-disable-next-line no-restricted-syntax
    for await (const batch of transactionsAsyncIterable) {
      if (!lastTimestamp) {
        const lastItem = batch.at(0)!;
        lastTimestamp = dateToNumber(lastItem.transaction.block.timestamp);
        lastTransactionHash = lastItem.transaction_hash;
      }

      count += batch.length;
      await this.db!.putTransactions(
        batch.map((t) => mapTransactionToEntity(address, t))
      );

      this.statusApi.sendStatus(
        'in-progress',
        `sync ${address} batch processing...`
      );

      // Add cyberlink to sync observables
      if (addCyberlinksToSync) {
        const {
          tweets: particles,
          particlesFound,
          links,
        } = extractParticlesResults(batch);
        await this.db!.putCyberlinks(
          links.map((link) => ({ ...link, neuron: '' }))
        );
        // const mysteryParticles = particlesFound.filter(
        //   (cid) => !!NOT_FOUND_CIDS.find((c) => c === cid)
        // );

        // if (mysteryParticles.length > 0) {
        //   console.log('----NOT FOUND mysteryParticles', mysteryParticles);
        // }

        const syncStatusEntities = await Promise.all(
          Object.keys(particles).map(async (cid) => {
            const { timestamp, direction, from, to } = particles[cid];
            const syncStatus = await fetchCyberlinksAndGetStatus(
              this.params.cyberIndexUrl!,
              cid,
              timestamp,
              undefined,
              undefined,
              this.resolveAndSaveParticle,
              (items: SyncQueueItem[]) => this.syncQueue!.pushToSyncQueue(items)
            );
            const lastId = direction === 'from' ? from : to;
            // const linkedCid = from as string;

            return (
              syncStatus || {
                id: cid as string,
                entryType: EntryType.particle,
                timestampUpdate: timestamp,
                timestampRead: timestamp,
                unreadCount: 0,
                lastId,
                disabled: false,
                meta: { direction },
              } // or default
            );
          })
        );

        // RESOLVE PARTICLE CONTENT FIRST
        // await Promise.all(
        //   particlesFound.map((cid) => {
        //     console.log('---syncTransactions', cid);
        //     return this.resolveAndSaveParticle(cid);
        //   })
        // );
        // put sync particles to queue
        await this.syncQueue!.pushToSyncQueue(
          particlesFound.map((cid) => ({ id: cid, priority: 1 }))
        );
        // await this.db!.putSyncQueue(
        //   particlesFound.map((cid) => ({ id: cid, priority: 1 }))
        // );

        if (syncStatusEntities.length > 0) {
          this.db!.putSyncStatus(syncStatusEntities);
        }
      }
    }

    const unreadTransactionsCount = unreadCount + count;

    if (lastTimestamp) {
      // Update transaction
      this.db!.putSyncStatus({
        entryType: EntryType.transactions,
        id: address,
        timestampUpdate: lastTimestamp,
        unreadCount: unreadTransactionsCount,
        timestampRead,
        disabled: false,
        lastId: lastTransactionHash,
        meta: {},
      });
    }

    // onComplete && onComplete(conter);
  }
}

export default SyncTransactionsLoop;

/* eslint-disable no-restricted-syntax */
import {
  interval,
  forkJoin,
  Observable,
  from,
  of,
  filter,
  switchMap,
  combineLatest,
  BehaviorSubject,
  EMPTY,
  defer,
} from 'rxjs';
import { concatMap, map, mergeMap, startWith, tap } from 'rxjs/operators';
import { EntryType, SyncQueueStatus } from 'src/services/CozoDb/types/entities';
import { NeuronAddress, ParticleCid, TransactionHash } from 'src/types/base';
import {
  mapPinToEntity,
  mapTransactionToEntity,
} from 'src/services/CozoDb/mapping';
import { dateToNumber, numberToDate } from 'src/utils/date';
import { CID_TWEET } from 'src/utils/consts';
import { CybIpfsNode } from 'src/services/ipfs/ipfs';

import { DbApi } from '../dataSource/indexedDb/dbApiWrapper';
import {
  fetchCyberlinkSyncStats,
  fetchCyberlinksIterable,
  fetchTransactionsIterable,
} from '../dataSource/blockchain/requests';
import { fetchPins } from '../dataSource/ipfs/ipfsSource';

import {
  CYBER_LINK_TRANSACTION_TYPE,
  CyberLinkTransaction,
  Transaction,
} from '../dataSource/blockchain/types';
import { FetchIpfsFunc, SyncServiceParams } from './type';
import BroadcastChannelSender from '../../channels/BroadcastChannelSender';
import { SyncQueueDto, SyncStatusDto } from 'src/services/CozoDb/types/dto';

const BLOCKCHAIN_SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
const IPFS_SYNC_INTERVAL = 15 * 60 * 1000; // 10 minutes

type ParticleResult = {
  timestamp: number;
  direction: 'from' | 'to';
  from: ParticleCid;
  to: ParticleCid;
};

function extractParticlesResults(batch: Transaction[]) {
  const cyberlinks = batch.filter(
    (l) => l.type === CYBER_LINK_TRANSACTION_TYPE
  ) as CyberLinkTransaction[];
  const particlesFound = new Set<string>();
  // Get links: only from TWEETS
  const particleTimestampRecord: Record<ParticleCid, ParticleResult> =
    cyberlinks.reduce<Record<ParticleCid, ParticleResult>>(
      (
        acc,
        {
          value,
          transaction: {
            block: { timestamp },
          },
        }: CyberLinkTransaction
      ) => {
        value.links.forEach((link) => {
          particlesFound.add(link.to);
          particlesFound.add(link.from);
          if (link.from === CID_TWEET) {
            acc[link.to] = {
              timestamp: dateToNumber(timestamp),
              direction: 'from',
              from: CID_TWEET,
              to: link.to,
            };
          }
        });
        return acc;
      },
      {}
    );

  return {
    tweets: particleTimestampRecord,
    particlesFound: [...particlesFound],
  };
}

// type LoopStatus = 'inProgress' | 'idle';

const createLoopObservable = (
  intervalMs: number,
  actionObservable$: Observable<any>,
  isInitialized$: Observable<boolean>,
  beforeCallback?: () => void
) => {
  return isInitialized$.pipe(
    switchMap((initialized) => {
      if (initialized) {
        // When isInitialized$ emits true, start the interval
        return interval(intervalMs).pipe(
          startWith(0), // Start immediately
          tap(() => beforeCallback && beforeCallback()),
          concatMap(() => actionObservable$)
        );
      }
      return EMPTY;
    })
  );
};

function findDuplicates(arr) {
  const elementMap = new Map();
  const duplicates = [];

  for (const item of arr) {
    if (elementMap.has(item)) {
      if (elementMap.get(item) === 1) {
        duplicates.push(item);
      }
      elementMap.set(item, elementMap.get(item) + 1);
    } else {
      elementMap.set(item, 1);
    }
  }

  return duplicates;
}

const ACCU: string[] = [];

// eslint-disable-next-line import/prefer-default-export
export class SyncService {
  // private blockchainLoop$?: Observable<any>;

  // private ipfsLoop$?: Observable<any>;

  private dbInitialized$ = new BehaviorSubject(false);

  private ipfsInitialized$ = new BehaviorSubject(false);

  private isInitialized$: Observable<boolean>;

  private db: DbApi | undefined;

  private ipfsNode: CybIpfsNode | undefined;

  private resolveAndSaveParticle: FetchIpfsFunc;

  private params: SyncServiceParams = { myAddress: null, followings: [] };

  private channelApi = new BroadcastChannelSender();

  private syncQueue$ = new BehaviorSubject<
    Map<ParticleCid, Omit<SyncQueueDto, 'status'>>
  >(new Map());

  private processingQueue = new Map<
    ParticleCid,
    Omit<SyncQueueDto, 'status'>
  >();

  constructor(resolveAndSaveParticle: FetchIpfsFunc) {
    this.resolveAndSaveParticle = resolveAndSaveParticle;

    this.isInitialized$ = combineLatest([
      this.dbInitialized$,
      this.ipfsInitialized$,
    ]).pipe(
      map(
        ([dbInitialized, ipfsInitialized]) => dbInitialized && ipfsInitialized
      )
    );

    // subscribe when started
    this.isInitialized$.subscribe({
      next: (result) => result && this.channelApi.postSyncStatus('started'),
      // error: (err) => this.channelApi.postSyncStatus('error', err),
    });

    this.startIpfsNodeSyncLoop();
    this.startTransactionsSyncLoop();
    this.startParticlesSyncLoop();
    this.startSyncQueueLoop();
  }

  private startTransactionsSyncLoop() {
    createLoopObservable(
      BLOCKCHAIN_SYNC_INTERVAL,
      // forkJoin({
      //   myTransactions: defer(() => from(this.syncMyTransactions())),
      //   userTransactions: defer(() => from(this.syncFollowingsTransactions())),
      //   particles: defer(() => from(this.syncParticles())),
      // }),
      defer(() => from(this.syncAllTransactions())),
      this.dbInitialized$,
      () =>
        this.channelApi.postSyncEntryProgress('transaction', {
          status: 'in-progress',
        })
    ).subscribe({
      next: (result) =>
        this.channelApi.postSyncEntryProgress('transaction', {
          status: 'idle',
          message: '',
          done: true,
        }),
      error: (err) =>
        this.channelApi.postSyncEntryProgress('transaction', {
          status: 'error',
          message: err.toString(),
          done: true,
        }),
    });
  }

  private startIpfsNodeSyncLoop() {
    createLoopObservable(
      IPFS_SYNC_INTERVAL,
      defer(() => from(this.syncPins())),
      this.isInitialized$,
      () =>
        this.channelApi.postSyncEntryProgress('pin', {
          status: 'in-progress',
          message: '',
        })
    ).subscribe({
      next: (result) =>
        this.channelApi.postSyncEntryProgress('pin', {
          status: 'idle',
          message: '',
          done: true,
        }),
      error: (err) =>
        this.channelApi.postSyncEntryProgress('pin', {
          status: 'error',
          message: err.toString(),
          done: true,
        }),
    });
  }

  private startParticlesSyncLoop() {
    createLoopObservable(
      IPFS_SYNC_INTERVAL,
      defer(() => from(this.syncParticles())),
      this.isInitialized$,
      () =>
        this.channelApi.postSyncEntryProgress('particle', {
          status: 'in-progress',
        })
    ).subscribe({
      next: (result) =>
        this.channelApi.postSyncEntryProgress('particle', {
          status: 'idle',
          message: '',
          done: true,
        }),
      error: (err) =>
        this.channelApi.postSyncEntryProgress('particle', {
          status: 'error',
          message: err.toString(),
          done: true,
        }),
    });
  }

  private async pushToSyncQueue(items: Omit<SyncQueueDto, 'status'>[]) {
    await this.db!.putSyncQueue(items);
    const queue = this.syncQueue$.value;
    // console.log('------pushToSyncQueue', items, typeof queue);
    items.forEach((item) => queue.set(item.id, item));
    this.syncQueue$.next(queue);
  }

  private async processSyncQueue() {
    this.processingQueue = new Map(this.syncQueue$.value); // Snapshot of the current queue
    this.syncQueue$.next(new Map());
    // console.log('---processSyncQueue', this.processingQueue);
    // eslint-disable-next-line no-restricted-syntax
    let i = 0;
    const batchSize = this.processingQueue.size;
    ACCU.push(...this.processingQueue.keys());

    for (const [cid, item] of this.processingQueue) {
      i++;

      this.channelApi.postSyncEntryProgress('resolver', {
        status: 'in-progress',
        message: `processing batch ${i}/${batchSize}...`,
      });
      // eslint-disable-next-line no-await-in-loop
      await this.resolveAndSaveParticle(cid).then((result) => {
        // console.log(`processSyncQueue resolveAndSaveParticle ${cid}`, result);
        // if (NOT_FOUND_CIDS.includes(cid)) {
        //   console.log('----NOT FOUND CID', cid);
        // }
        if (result.status === 'not_found') {
          this.db!.updateSyncQueue({ id: cid, status: SyncQueueStatus.error });
        } else {
          this.db!.removeSyncQueue(cid);
        }

        this.processingQueue.delete(cid);
        // this.syncQueue$.next(queue);
      });
    }

    this.channelApi.postSyncEntryProgress('resolver', {
      status: 'idle',
      message: '',
      done: true,
    });
  }

  // load sync queue from db
  private async loadSyncQueue() {
    const queue = await this.db!.getSyncQueue({
      statuses: [SyncQueueStatus.pending],
    }).then((items) => new Map(items.map((item) => [item.id, item])));
    console.log('---loadSyncQueue', queue);

    queue.forEach((item) => {
      this.syncQueue$.value.set(item.id, item);
    });

    this.syncQueue$.next(this.syncQueue$.value);
  }

  private async startSyncQueueLoop() {
    // "CRON" job to force queue sync start
    // createLoopObservable(
    //   SYNC_QUEUE_INTERVAL,
    //   defer(() => from(this.loadSyncQueue())),
    //   this.isInitialized$
    // ).subscribe({
    //   next: () => ({}),
    // });

    this.isInitialized$
      .pipe(
        filter((isInitialized) => isInitialized === true),
        mergeMap(() => this.syncQueue$), // Merge the queue$ stream here.
        tap((q) => console.log(`sync queue - ${q.size}`)),
        filter((queue) => queue.size > 0 && this.processingQueue.size === 0),
        tap(() =>
          this.channelApi.postSyncEntryProgress('resolver', {
            status: 'in-progress',
            message: 'starting',
          })
        ),
        mergeMap(() => defer(() => from(this.processSyncQueue())))
      )
      .subscribe({
        next: (result) =>
          this.channelApi.postSyncEntryProgress('resolver', {
            status: 'idle',
            message: '',
            done: true,
          }),
        error: (err) =>
          this.channelApi.postSyncEntryProgress('resolver', {
            status: 'error',
            message: err.toString(),
            done: true,
          }),
      });
  }

  public init(dbApi: DbApi) {
    this.db = dbApi;
    this.dbInitialized$.next(true);
  }

  public initIpfs(ipfsNode: CybIpfsNode) {
    this.ipfsNode = ipfsNode;
    this.ipfsInitialized$.next(true);
  }

  public setParams(params: Partial<SyncServiceParams>) {
    this.params = { ...this.params, ...params };
  }

  private async syncTransactions(
    address: NeuronAddress,
    addCyberlinksToSync = false
  ) {
    this.channelApi.postSyncEntryProgress('transaction', {
      status: 'in-progress',
      message: `sync ${address}...`,
    });

    // let conter = 0;
    const { timestampRead, unreadCount, timestampUpdate } =
      await this.db!.getSyncStatus(address);
    console.log(
      '--------syncTransactions',
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

      this.channelApi.postSyncEntryProgress('transaction', {
        status: 'in-progress',
        message: `sync ${address} batch processing...`,
      });

      // Add cyberlink to sync observables
      if (addCyberlinksToSync) {
        const { tweets: particles, particlesFound } =
          extractParticlesResults(batch);

        // const mysteryParticles = particlesFound.filter(
        //   (cid) => !!NOT_FOUND_CIDS.find((c) => c === cid)
        // );

        // if (mysteryParticles.length > 0) {
        //   console.log('----NOT FOUND mysteryParticles', mysteryParticles);
        // }

        const syncStatusEntries = await Promise.all(
          Object.keys(particles).map(async (cid) => {
            const { timestamp, direction, from, to } = particles[cid];
            const syncStatus = await this.fetchCyberlinksAndGetStatus(
              cid,
              timestamp
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
        await this.pushToSyncQueue(
          particlesFound.map((cid) => ({ id: cid, priority: 1 }))
        );
        // await this.db!.putSyncQueue(
        //   particlesFound.map((cid) => ({ id: cid, priority: 1 }))
        // );

        this.db!.putSyncStatus(syncStatusEntries);
        console.log(
          '---syncTransactions',
          Object.keys(particles),
          particlesFound
        );
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

  private async fetchCyberlinksAndGetStatus(
    cid: ParticleCid,
    timestampUpdate = 0,
    timestampRead = 0,
    unreadCount = 0
  ): Promise<SyncStatusDto | undefined> {
    const cyberlinsIterable = fetchCyberlinksIterable(
      this.params.cyberIndexUrl!,
      cid,
      timestampUpdate
    );
    const links = [];
    for await (const batch of cyberlinsIterable) {
      links.push(...batch);
    }

    if (!links.length) {
      return undefined;
    }
    // firstTimestamp, lastTimestamp, count, lastLinkedParticle, isFrom
    const lastTimestamp = links[0]?.timestamp;
    const lastTo = links[0]?.to;
    const lastFrom = links[0]?.from;
    const firstTimestamp = links[links.length - 1]?.timestamp;
    const count = links.length;
    const isFrom = lastFrom === cid;

    const lastId = isFrom ? lastTo : lastFrom;

    // resolve particle direct
    await this.resolveAndSaveParticle(lastId);

    // await this.db!.putSyncQueue(
    //   links.map((link) => ({ id: link.to, priority: 1 }))
    // );

    // resolve particles using ueue
    await this.pushToSyncQueue(
      links.map((link) => ({ id: link.to, priority: 1 }))
    );

    // console.log('---fetchParticleSyncStatus', cid, links);

    const syncStatus = {
      id: cid as string,
      timestampUpdate: lastTimestamp,
      timestampRead: count ? timestampRead : firstTimestamp,
      unreadCount: unreadCount + count,
      lastId,
      meta: { direction: isFrom ? 'from' : 'to' },
      disabled: false,
      entryType: EntryType.particle,
    } as SyncStatusDto;

    return syncStatus;
  }

  private async syncParticles() {
    // fetch observable particles from db
    const dbResult = await this.db!.findSyncStatus({
      entryType: EntryType.particle,
    });
    dbResult.rows.map(async (row) => {
      const [id, unreadCount, timestampUpdate, timestampRead] = row;
      await this.fetchCyberlinksAndGetStatus(
        id as string,
        timestampUpdate as number,
        timestampRead as number,
        unreadCount as number
      );
    });
  }

  private async syncPins() {
    try {
      const pinsResult = await fetchPins(this.ipfsNode!);
      // console.log('---syncPins pinsResult', pinsResult);
      const dbPins = (await this.db!.getPins()).rows.map(
        (row) => row[0] as string
      );

      const pinsResultSet = new Set(
        pinsResult.map((pin) => pin.cid.toString())
      );
      const dbPinsSet = new Set(dbPins);

      // Find and exclude overlapping pins
      const pinsToRemove = dbPins.filter((pin) => !pinsResultSet.has(pin));

      const pinsToAdd = pinsResult.filter(
        (pin) => !dbPinsSet.has(pin.cid.toString())
      );

      if (pinsToRemove.length) {
        await this.db!.deletePins(pinsToRemove);
      }

      const particlesExist = new Set(
        (await this.db!.getParticles(['cid'])).rows.map(
          (row) => row[0] as string
        )
      );

      const cidsToAdd = pinsToAdd.map((pin) => pin.cid.toString());

      const particlesToAdd = cidsToAdd.filter(
        (cid) => !particlesExist.has(cid)
      );

      // particlesToAdd.forEach((cid) => this.resolveAndSaveParticle(cid));

      // await this.db!.putSyncQueue(
      //   particlesToAdd.map((cid) => ({ id: cid, priority: 1 }))
      // );
      if (particlesToAdd.length > 0) {
        await this.pushToSyncQueue(
          particlesToAdd.map((cid) => ({ id: cid, priority: 1 }))
        );
      }

      if (pinsToAdd.length > 0) {
        await this.db!.putPins(pinsToAdd.map(mapPinToEntity));
      }
    } catch (e) {
      console.log('---syncPins error', e);
    }
  }

  private async syncMyTransactions() {
    this.params.myAddress && this.syncTransactions(this.params.myAddress, true);
  }

  private async syncFollowingsTransactions() {
    await Promise.all(
      this.params.followings.map((addr) => this.syncTransactions(addr))
    );
  }

  private async syncAllTransactions() {
    console.log('>>> Sync my transactions');
    await this.syncMyTransactions();
    console.log('>>> Sync followings transactions');
    await this.syncFollowingsTransactions();
  }
}

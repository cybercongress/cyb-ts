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
import { concatMap, map, startWith, tap } from 'rxjs/operators';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { NeuronAddress, ParticleCid, TransactionHash } from 'src/types/base';
import {
  mapPinToEntity,
  mapTransactionToEntity,
} from 'src/services/CozoDb/mapping';
import { dateToNumber } from 'src/utils/date';
import { CID_TWEET } from 'src/utils/consts';
import { CybIpfsNode } from 'src/services/ipfs/ipfs';

import { DbApi } from '../dataSource/indexedDb/dbApiWrapper';
import {
  fetchCyberlinkSyncStats,
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
import { string } from 'prop-types';
import { SyncStatusDto } from 'src/services/CozoDb/types/dto';

const BLOCKCHAIN_SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
const IPFS_SYNC_INTERVAL = 15 * 60 * 1000; // 10 minutes
type ParticleResult = {
  timestamp: number;
  direction: 'from' | 'to';
  from?: ParticleCid;
  to?: ParticleCid;
};

function extractParticlesResults(batch: Transaction[]) {
  const cyberlinks = batch.filter(
    (l) => l.type === CYBER_LINK_TRANSACTION_TYPE
  ) as CyberLinkTransaction[];

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
        value.links
          .filter((link) => link.from === CID_TWEET)
          .forEach((link) => {
            acc[link.to] = {
              timestamp: dateToNumber(timestamp),
              direction: 'from',
              from: CID_TWEET,
            };
          });
        return acc;
      },
      {}
    );

  return particleTimestampRecord;
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
          tap(() => beforeCallback!()),
          concatMap(() => actionObservable$)
        );
      }
      return EMPTY;
    })
  );
};

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

    this.startIpfsLoop();
    this.startBlockchainLoop();
    this.startParticlesLoop();
  }

  private startBlockchainLoop() {
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
          done: true,
        }),
      error: (err) =>
        this.channelApi.postSyncEntryProgress('transaction', {
          status: 'error',
          message: err,
          done: true,
        }),
    });
  }

  private startIpfsLoop() {
    createLoopObservable(
      IPFS_SYNC_INTERVAL,
      defer(() => from(this.syncPins())),
      this.isInitialized$,
      () =>
        this.channelApi.postSyncEntryProgress('pin', {
          status: 'in-progress',
        })
    ).subscribe({
      next: (result) =>
        this.channelApi.postSyncEntryProgress('pin', {
          status: 'idle',
          done: true,
        }),
      error: (err) =>
        this.channelApi.postSyncEntryProgress('pin', {
          status: 'error',
          message: err,
          done: true,
        }),
    });
  }

  private startParticlesLoop() {
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
          done: true,
        }),
      error: (err) =>
        this.channelApi.postSyncEntryProgress('particle', {
          status: 'error',
          message: err,
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
      message: `sync ${address} transactions`,
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

      // Add cyberlink to sync observables
      if (addCyberlinksToSync) {
        const particles = extractParticlesResults(batch);
        const particleCIDs = Object.keys(particles);

        const syncStatusEntries = await Promise.all(
          particleCIDs.map(async (cid) => {
            const { timestamp, direction, from } = particles[cid];
            const syncStatus = await this.fetchParticleSyncStatus(
              cid,
              timestamp
            );
            const linkedCid = from as string;
            // non-blocking
            this.resolveAndSaveParticle(linkedCid);

            return (
              syncStatus || {
                id: cid as string,
                entryType: EntryType.particle,
                timestampUpdate: timestamp,
                timestampRead: timestamp,
                unreadCount: 0,
                lastId: linkedCid,
                disabled: false,
                meta: { direction },
              } // or default
            );
          })
        );

        this.db!.putSyncStatus(syncStatusEntries);
        console.log('---syncTransactions', particleCIDs);
        // non-blocking call
        // particleCIDs.map((cid) => this.resolveAndSaveParticle(cid));
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
    this.channelApi.postSyncEntryProgress('transaction', {
      status: 'in-progress',
      message: `sync ${address} transactions - unread: ${unreadTransactionsCount}`,
    });
    // onComplete && onComplete(conter);
  }

  private async fetchParticleSyncStatus(
    cid: ParticleCid,
    timestampUpdate = 0,
    timestampRead = 0,
    unreadCount = 0
  ): Promise<SyncStatusDto | undefined> {
    const result = await fetchCyberlinkSyncStats(
      this.params.cyberIndexUrl!,
      cid,
      timestampUpdate
    );
    // console.log('----fetchAndSyncParticle', cid, result, timestampUpdate);

    if (!result) {
      return undefined;
    }
    const { firstTimestamp, lastTimestamp, count, lastLinkedParticle, isFrom } =
      result;

    await this.resolveAndSaveParticle(lastLinkedParticle);

    // await this.db!.updateSyncStatus();
    return {
      id: cid as string,
      timestampUpdate: lastTimestamp,
      timestampRead: count ? timestampRead : firstTimestamp,
      unreadCount: (unreadCount as number) + count,
      lastId: lastLinkedParticle,
      meta: { direction: isFrom ? 'from' : 'to' },
      disabled: false,
      entryType: EntryType.particle,
    } as SyncStatusDto;
  }

  private async syncParticles() {
    // fetch observable particles from db
    const dbResult = await this.db!.findSyncStatus({
      entryType: EntryType.particle,
    });
    dbResult.rows.map(async (row) => {
      const [id, unreadCount, timestampUpdate, timestampRead] = row;
      await this.fetchParticleSyncStatus(
        id as string,
        timestampUpdate as number,
        timestampRead as number,
        unreadCount as number
      );
      // fetch new links with particle
      // const result = await fetchCyberlinkSyncStats(
      //   this.params.cyberIndexUrl!,
      //   id as string,
      //   timestampUpdate as number
      // );
      // console.log('----item', id, result);

      // if (result) {
      //   const {
      //     firstTimestamp,
      //     lastTimestamp,
      //     count,
      //     lastLinkedParticle,
      //     isFrom,
      //   } = result;

      //   this.resolveAndSaveParticle(lastLinkedParticle);

      //   await this.db!.updateSyncStatus({
      //     id: id as string,
      //     timestampUpdate: lastTimestamp,
      //     timestampRead: (unreadCount as number)
      //       ? (timestampRead as number)
      //       : firstTimestamp,
      //     unreadCount: (unreadCount as number) + count,
      //     lastId: lastLinkedParticle,
      //     meta: { direction: isFrom ? 'from' : 'to' },
      //   });
      // }
    });
  }

  private async syncPins() {
    const pinsResult = await fetchPins(this.ipfsNode!);
    // console.log('---syncPins pinsResult', pinsResult);
    const dbPins = (await this.db!.getPins()).rows.map(
      (row) => row[0] as string
    );

    const pinsResultSet = new Set(pinsResult.map((pin) => pin.cid.toString()));
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
      (await this.db!.getParticles(['cid'])).rows.map((row) => row[0] as string)
    );

    const cidsToAdd = pinsToAdd.map((pin) => pin.cid.toString());

    const particlesToAdd = cidsToAdd.filter((cid) => !particlesExist.has(cid));

    particlesToAdd.forEach((cid) => this.resolveAndSaveParticle(cid));

    if (pinsToAdd.length > 0) {
      await this.db!.putPins(pinsToAdd.map(mapPinToEntity));
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
    console.log('>>> Sync transactions');
    await this.syncMyTransactions();
    await this.syncFollowingsTransactions();
  }
}

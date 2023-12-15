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
import { EntryType } from 'src/services/CozoDb/types';
import { NeuronAddress, ParticleCid, TransactionHash } from 'src/types/base';
import {
  mapPinToEntity,
  mapSyncStatusToEntity,
  mapTransactionToEntity,
} from 'src/services/CozoDb/mapping';
import { dateToNumber, numberToDate } from 'src/utils/date';
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

const BLOCKCHAIN_SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
const IPFS_SYNC_INTERVAL = 15 * 60 * 1000; // 10 minutes

function extractParticles(batch: Transaction[]) {
  const cyberlinks = batch.filter(
    (l) => l.type === CYBER_LINK_TRANSACTION_TYPE
  ) as CyberLinkTransaction[];

  // Get links: only from TWEETS
  const particleTimestampRecord: Record<ParticleCid, number> =
    cyberlinks.reduce<Record<ParticleCid, number>>(
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
            acc[link.to] = dateToNumber(timestamp);
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
  isInitialized$: Observable<boolean>
  // isInProgress$: BehaviorSubject<LoopStatus>
) => {
  return isInitialized$.pipe(
    switchMap((initialized) => {
      if (initialized) {
        // When isInitialized$ emits true, start the interval
        return interval(intervalMs).pipe(
          startWith(0), // Start immediately
          // tap(() => console.log('Starting task cycle')),
          concatMap(() => actionObservable$)
        );
      }
      // When isInitialized$ emits false, stop the interval
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

  private processParticle: FetchIpfsFunc;

  private params: SyncServiceParams = { myAddress: null, followings: [] };

  private channelApi = new BroadcastChannelSender();

  constructor(processParticle: FetchIpfsFunc) {
    this.processParticle = processParticle;

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
  }

  private startBlockchainLoop() {
    createLoopObservable(
      BLOCKCHAIN_SYNC_INTERVAL,
      forkJoin({
        myTransactions: defer(() => from(this.syncMyTransactions())),
        userTransactions: defer(() => from(this.syncFollowingsTransactions())),
        particles: defer(() => from(this.syncParticles())),
      }),
      this.dbInitialized$
    ).subscribe({
      next: (result) =>
        console.log('All blockchain tasks in this cycle completed', result),
      error: (err) => console.error('Error in task cycle', err),
      // complete: () => console.log('Task interval completed.'),
    });
  }

  private startIpfsLoop() {
    createLoopObservable(
      IPFS_SYNC_INTERVAL,
      forkJoin({
        ipfs: defer(() => from(this.syncPins())),
      }),
      this.isInitialized$
    ).subscribe({
      next: (result) =>
        console.log('All ipfs tasks in this cycle completed', result),
      error: (err) => console.error('Error in task cycle', err),
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
    });

    // let conter = 0;
    const { timestampRead, unreadCount, timestampUpdate } =
      await this.db!.getSyncStatus(address);

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
        const particles = extractParticles(batch);
        const particleCIDs = Object.keys(particles);

        const syncStatusEntries = particleCIDs.map((cid) =>
          mapSyncStatusToEntity(cid, EntryType.particle, 0, particles[cid])
        );

        this.db!.putSyncStatus(syncStatusEntries);

        // non-blocking call
        particleCIDs.map((cid) => this.processParticle(cid));
      }
    }

    if (lastTimestamp) {
      // Update transaction
      this.db!.putSyncStatus({
        entry_type: EntryType.transactions,
        id: address,
        timestamp_update: lastTimestamp,
        unread_count: unreadCount + count,
        timestamp_read: timestampRead,
        disabled: false,
        last_id: lastTransactionHash,
      });
    }
    this.channelApi.postSyncEntryProgress('transaction', {
      status: 'idle',
      // message: `sync ${address} transactions - unread: ${
      //   unreadCount + count
      // }, last - ${numberToDate(lastTimestamp || 0)}`,
      done: true,
    });
    // onComplete && onComplete(conter);
  }

  private async syncParticles() {
    this.channelApi.postSyncEntryProgress('particle', {
      status: 'in-progress',
    });
    // fetch observable particles from db
    const particleSyncStatusResult = await this.db!.findSyncStatus({
      entryType: EntryType.particle,
    });

    particleSyncStatusResult.rows.map(async (row) => {
      const [id, unreadCount, timestampUpdate, timestampRead] = row;

      // fetch new links with particle
      const { firstTimestamp, lastTimestamp, count, lastLinkedParticle } =
        await fetchCyberlinkSyncStats(
          this.params.cyberIndexUrl!,
          id as string,
          timestampUpdate as number
        );

      this.db!.updateSyncStatus(
        id as string,
        lastTimestamp,
        (unreadCount as number) ? (timestampRead as number) : firstTimestamp,
        (unreadCount as number) + count,
        lastLinkedParticle
      );
    });

    this.channelApi.postSyncEntryProgress('particle', {
      status: 'idle',
      done: true,
    });
  }

  private async syncPins() {
    this.channelApi.postSyncEntryProgress('pin', {
      status: 'in-progress',
    });

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
    // console.log('---syncPins pinsToAdd pinsToRemove', pinsToAdd, pinsToRemove);
    // this.channelApi.postSyncEntryProgress('pin', {
    //   message: `ipfs node process: +${pinsToAdd.length} -${pinsToRemove.length}`,
    //   done: true,
    // });

    const particlesExist = new Set(
      (await this.db!.getParticles(['cid'])).rows.map((row) => row[0] as string)
    );

    const cidsToAdd = pinsToAdd.map((pin) => pin.cid.toString());

    const particlesToAdd = cidsToAdd.filter((cid) => !particlesExist.has(cid));
    // console.log('---syncPins particlesToAdd', particlesToAdd);

    particlesToAdd.forEach((cid) => this.processParticle(cid));

    if (pinsToAdd.length > 0) {
      await this.db!.putPins(pinsToAdd.map(mapPinToEntity));
    }

    this.channelApi.postSyncEntryProgress('pin', {
      status: 'idle',
      // message: `ipfs node sync: +${pinsToAdd.length} -${pinsToRemove.length} +${particlesToAdd.length}(particles)`,
      done: true,
    });
  }

  private async syncMyTransactions() {
    this.params.myAddress && this.syncTransactions(this.params.myAddress, true);
  }

  private async syncFollowingsTransactions() {
    await Promise.all(
      this.params.followings.map((addr) => this.syncTransactions(addr))
    );
  }
}

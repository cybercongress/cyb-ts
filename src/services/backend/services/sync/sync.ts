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

import { DbWorkerApi } from '../../workers/db/worker';
import { CybDb } from '../database/cybDb';
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

const createLoopObservable = (
  intervalMs: number,
  actionObservable$: Observable<any>,
  isInitialized$: Observable<boolean> = of(true)
) =>
  isInitialized$.pipe(
    filter((initialized) => initialized === true), // Wait for isInitialized to be true
    switchMap(() =>
      interval(300000) // 5-minute interval
        .pipe(
          startWith(0), // Start immediately on subscription
          tap(() => console.log('Starting task cycle')),
          concatMap(() => actionObservable$)
        )
    )
  );

// eslint-disable-next-line import/prefer-default-export
export class SyncService {
  private blockchainLoop$?: Observable<any>;

  private ipfsLoop$?: Observable<any>;

  private dbInitialized$: Observable<boolean> = of(false);

  private ipfsInitialized$: Observable<boolean> = of(false);

  private db = CybDb();

  private ipfsNode: CybIpfsNode | undefined;

  private processParticle: FetchIpfsFunc;

  private params: SyncServiceParams = { myAddress: null, followings: [] };

  constructor(processParticle: FetchIpfsFunc) {
    this.processParticle = processParticle;
  }

  private startBlockchainLoop() {
    this.blockchainLoop$ = createLoopObservable(
      BLOCKCHAIN_SYNC_INTERVAL,
      forkJoin({
        myTransactions: of(this.syncMyTransactions()),
        userTransactions: from(this.syncFollowingsTransactions()),
        particles: of(this.syncParticles()),
      }),
      this.dbInitialized$
    );

    this.blockchainLoop$.subscribe({
      next: (result) =>
        console.log('All blockchain tasks in this cycle completed', result),
      error: (err) => console.error('Error in task cycle', err),
      complete: () => console.log('Task interval completed.'),
    });
  }

  private startIpfsLoop() {
    const isInitialized$ = combineLatest([
      this.dbInitialized$,
      this.ipfsInitialized$,
    ]).pipe(
      map(
        ([dbInitialized, ipfsInitialized]) => dbInitialized && ipfsInitialized
      )
    );

    this.ipfsLoop$ = createLoopObservable(
      IPFS_SYNC_INTERVAL,
      forkJoin({
        ipfs: of(this.syncPins()),
      }),
      isInitialized$
    );

    this.ipfsLoop$.subscribe({
      next: (result) =>
        console.log('All ipfs tasks in this cycle completed', result),
      error: (err) => console.error('Error in task cycle', err),
      complete: () => console.log('Task interval completed.'),
    });
  }

  public initDb(dbApi: DbWorkerApi) {
    this.db.init(dbApi);
    this.startBlockchainLoop();
  }

  public initIpfs(ipfsNode: CybIpfsNode) {
    this.ipfsNode = ipfsNode;
    this.startIpfsLoop();
  }

  public setParams(params: Partial<SyncServiceParams>) {
    this.params = { ...this.params, ...params };
  }

  private async syncTransactions(
    address: NeuronAddress,
    addCyberlinksToSync = false
  ) {
    // let conter = 0;
    const { timestampRead, unreadCount, timestampUpdate } =
      await this.db.getSyncStatus(address);

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

        this.db.putSyncStatus(syncStatusEntries);

        // non-blocking call
        particleCIDs.map((cid) => this.processParticle(cid));
      }
    }

    if (lastTimestamp) {
      // Update transaction
      this.db.putSyncStatus({
        entry_type: EntryType.transactions,
        id: address,
        timestamp_update: lastTimestamp,
        unread_count: unreadCount + count,
        timestamp_read: timestampRead,
        disabled: false,
        last_id: lastTransactionHash,
      });
    }

    // onComplete && onComplete(conter);
  }

  private async syncParticles() {
    // fetch observable particles from db
    const particleSyncStatusResult = await this.db.findSyncStatus(
      EntryType.particle
    );

    particleSyncStatusResult.rows.map(async (row) => {
      const [id, unreadCount, timestampUpdate, timestampRead] = row;

      // fetch new links with particle
      const { firstTimestamp, lastTimestamp, count, lastParticle } =
        await fetchCyberlinkSyncStats(
          this.params.cyberIndexUrl!,
          id as string,
          timestampUpdate as number
        );

      this.db.updateSyncStatus(
        id as string,
        lastTimestamp,
        (unreadCount as number) + count,
        (unreadCount as number) ? (timestampRead as number) : firstTimestamp,
        lastParticle
      );
    });
  }

  private async syncPins() {
    const pinsResult = await fetchPins(this.ipfsNode!);
    const dbPins = (await this.db.getPins()).rows.map(
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
      await this.db.deletePins(pinsToRemove);
    }

    const particlesExist = new Set(
      (await this.db.getParticles(['cid'])).rows.map((row) => row[0] as string)
    );

    const cidsToAdd = pinsToAdd.map((pin) => pin.cid.toString());

    const particlesToAdd = cidsToAdd.filter((cid) => !particlesExist.has(cid));

    particlesToAdd.forEach((cid) => this.processParticle(cid));

    await this.db.putPins(pinsToAdd.map(mapPinToEntity));
  }

  private async syncMyTransactions() {
    this.params.myAddress && this.syncTransactions(this.params.myAddress, true);
  }

  private async syncFollowingsTransactions() {
    return;
    await Promise.all(
      this.params.followings.map((addr) => this.syncTransactions(addr))
    );
  }
}

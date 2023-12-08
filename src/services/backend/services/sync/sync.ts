/* eslint-disable no-restricted-syntax */
import { interval, forkJoin, Observable, from, of } from 'rxjs';
import { concatMap, startWith, tap } from 'rxjs/operators';
import { EntryType } from 'src/services/CozoDb/types';
import { NeuronAddress, ParticleCid } from 'src/types/base';
import {
  mapSyncStatusToEntity,
  mapTransactionToEntity,
} from 'src/services/CozoDb/mapping';
import { dateToNumber, numberToDate } from 'src/utils/date';
import { CID_TWEET } from 'src/utils/consts';
import {
  CYBER_LINK_TRANSACTION_TYPE,
  CyberLinkTransaction,
  Transaction,
} from '../dataSource/blockchain/types';
import { SyncServiceParams } from './type';
import { DbWorkerApi } from '../../workers/db/worker';
import { CyberDb } from '../database/cyberDb';
import {
  fetchCyberlinkSyncStats,
  fetchTransactionsIterable,
} from '../dataSource/blockchain/requests';

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

// eslint-disable-next-line import/prefer-default-export
export class SyncService {
  private taskInterval$?: Observable<any>;

  private db = CyberDb();

  private params: SyncServiceParams = { myAddress: null, followings: [] };

  // constructor() {}

  private startLoop() {
    this.taskInterval$ = interval(300000) // 5-minute interval
      .pipe(
        startWith(0), // Start immediately on subscription
        tap(() => console.log('Starting task cycle')),
        concatMap(() =>
          forkJoin({
            myTransactions: of(this.syncMyTransactions()),
            // userTransactions: from(this.syncFollowingsTransactions()),
            particles: of(this.syncParticles()),
            // cyberLinksTransactions: of(this.syncCyberLinksTransactions()),
          })
        )
      );

    this.taskInterval$.subscribe({
      next: (result) =>
        console.log('All tasks in this cycle completed', result),
      error: (err) => console.error('Error in task cycle', err),
      complete: () => console.log('Task interval completed.'),
    });
  }

  public init(dbApi: DbWorkerApi) {
    this.db.init(dbApi);
    this.startLoop();
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

    console.log(
      '---last ts',
      address,
      timestampUpdate,
      numberToDate(timestampUpdate)
    );

    const transactionsAsyncIterable = fetchTransactionsIterable(
      this.params.cyberIndexUrl!,
      address,
      timestampUpdate + 1 // ofsset + 1 to fix milliseconds precision bug
    );

    let count = 0;
    let lastTimestamp: number | undefined;
    // eslint-disable-next-line no-restricted-syntax
    for await (const batch of transactionsAsyncIterable) {
      if (!lastTimestamp) {
        lastTimestamp = dateToNumber(batch.at(0)!.transaction.block.timestamp);
      }

      count += batch.length;
      await this.db!.putTransactions(
        batch.map((t) => mapTransactionToEntity(address, t))
      );
      // onProgress && onProgress(conter);

      // Add cyberlink to sync loop
      if (addCyberlinksToSync) {
        const particles = extractParticles(batch);

        console.log('particlesToSync', particles);

        const syncStatusEntries = Object.keys(particles).map((cid) =>
          mapSyncStatusToEntity(cid, EntryType.particle, 0, particles[cid])
        );

        console.log('syncStatusEntries', syncStatusEntries);
        this.db.putSyncStatus(syncStatusEntries);
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
      });
    }

    // onComplete && onComplete(conter);
  }

  private async syncParticles() {
    // fetch observable particles from db
    const particleSyncStatusResult = await this.db.findSyncStatus(
      EntryType.particle
    );
    console.log('------linksSyncResult', particleSyncStatusResult);

    particleSyncStatusResult.rows.map(async (row) => {
      const [id, unreadCount, timestampUpdate, timestampRead] = row;

      // fetch new links with particle
      const { firstTimestamp, lastTimestamp, count } =
        await fetchCyberlinkSyncStats(
          this.params.cyberIndexUrl!,
          id as string,
          timestampUpdate as number
        );

      console.log(
        '------linksSyncResult r',
        row,
        firstTimestamp,
        lastTimestamp,
        count
      );

      this.db.updateSyncStatus(
        id as string,
        lastTimestamp,
        (unreadCount as number) + count,
        (unreadCount as number) ? (timestampRead as number) : firstTimestamp
      );
    });
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

/* eslint-disable no-restricted-syntax */
import { interval, forkJoin, of, Observable, from } from 'rxjs';
import { concatMap, first, startWith, tap } from 'rxjs/operators';
import {
  EntryType,
  EntryTypeMap,
  TransactionDbEntry,
} from 'src/services/CozoDb/types';
import { Cyberlink, NeuronAddress, ParticleCid } from 'src/types/base';
import {
  isTransactionCyberLink,
  mapSyncStatusToEntity,
} from 'src/services/CozoDb/mapping';
import { numberToDate } from 'src/utils/date';
import { CID_TWEET } from 'src/utils/consts';
import { CyberLinkTransaction } from 'src/types/transaction';

import { fetchTransactionsAsyncIterable } from '../importers/transactions';
import { SyncServiceParams } from '../types';
import { DbWorkerApi } from '../../db/worker';
import {
  fetchCyberlinkAggregateInfo,
  // fetchCyberlinksAsyncIterable,
} from '../importers/links';
// import { asyncIterableToArray } from 'src/utils/async/iterable';
// import {
//   convertDBResultToObjects,
//   snakeToCamel,
// } from 'src/services/CozoDb/utils';

const TIMESTAMP_INTITAL = 958718452000;

function mapCyberlinkTransactionsToSyncStatus(batch: TransactionDbEntry[]) {
  const cyberlinks = batch.filter((i) =>
    isTransactionCyberLink(i)
  ) as CyberLinkTransaction[];
  // .map((v) => v.value as CyberLinkTransaction);
  console.log('cyberlinks', cyberlinks);
  // Get links: only from TWEETS
  const particlesToSync = cyberlinks.reduce<Record<string, number>>(
    (acc, transaction) => {
      const { value, timestamp } = transaction;
      value.links
        .filter((link) => link.from === CID_TWEET)
        .forEach((link) => {
          acc[link.to] = timestamp;
        });
      return acc;
    },
    {}
  );

  console.log('particlesToSync', particlesToSync);
  const particleEntries = Object.keys(particlesToSync).map((cid) =>
    mapSyncStatusToEntity('particle', cid, particlesToSync[cid], 0)
  );
  console.log('particleEntries', particleEntries);
  return particleEntries;
}

// eslint-disable-next-line import/prefer-default-export
export class SyncService {
  private taskInterval$?: Observable<any>;

  private dbApi: DbWorkerApi | undefined;

  private params: SyncServiceParams = { myAddress: null, followings: [] };

  // constructor() {}

  private startLoop() {
    this.taskInterval$ = interval(300000) // 5-minute interval
      .pipe(
        startWith(0), // Start immediately on subscription
        tap(() => console.log('Starting task cycle')),
        concatMap(() =>
          forkJoin({
            // myTransactions: from(this.syncMyTransactions()),
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
    this.dbApi = dbApi;
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
    const { timestamp, unreadCount, lastReadTimestamp } =
      await this.getSyncStatus('transactions', address);

    console.log('---last ts', address, timestamp, numberToDate(timestamp));
    const transactionsAsyncIterable = fetchTransactionsAsyncIterable(
      address,
      this.params.cyberIndexUrl!,
      timestamp + 1 // ofsset + 1 to fix milliseconds precision bug
    );
    let count = 0;
    let lastTimestamp: number | undefined;
    // eslint-disable-next-line no-restricted-syntax
    for await (const batch of transactionsAsyncIterable) {
      if (!lastTimestamp) {
        lastTimestamp = batch.at(0)?.timestamp;
      }

      count += batch.length;
      await this.dbApi!.executeBatchPutCommand('transaction', batch);
      // onProgress && onProgress(conter);

      // Add cyberlink to observables
      if (addCyberlinksToSync) {
        this.dbApi?.executePutCommand(
          'sync_status',
          mapCyberlinkTransactionsToSyncStatus(batch)
        );
      }
    }

    if (lastTimestamp) {
      this.addSyncStatus(
        'transactions',
        address,
        lastTimestamp,
        unreadCount + count,
        unreadCount > 0 ? lastReadTimestamp : lastTimestamp
      );
    }

    // onComplete && onComplete(conter);
  }

  private async syncParticles() {
    const linksSyncResult = await this.dbApi!.executeGetCommand(
      'sync_status',
      [`entry_type = ${EntryTypeMap.particle}`],
      ['id', 'unread_count', 'timestamp', 'last_read_timestamp'],
      ['id', 'unread_count', 'timestamp', 'last_read_timestamp', 'entry_type']
    );

    if (!linksSyncResult.ok) {
      throw new Error("Can't get particles to sync");
    }
    console.log('------linksSyncResult', linksSyncResult);
    linksSyncResult.rows.map(async (r) => {
      const [id, unreadCount, timestamp, lastReadTimestamp] = r;
      const { firstTimestamp, lastTimestamp, count } =
        await fetchCyberlinkAggregateInfo(
          id as string,
          this.params.cyberIndexUrl!,
          timestamp as number
        );

      console.log(
        '------linksSyncResult r',
        r,
        firstTimestamp,
        lastTimestamp,
        count
      );

      this.updateSyncStatus(
        id as string,
        lastTimestamp,
        (unreadCount as number) + count,
        (unreadCount as number) ? (lastReadTimestamp as number) : firstTimestamp
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

  private async getSyncStatus(
    entryType: EntryType,
    id: NeuronAddress | ParticleCid = ''
  ) {
    const result = await this.dbApi!.executeGetCommand(
      'sync_status',
      [`entry_type = ${EntryTypeMap[entryType]}`, `id = '${id}'`],
      ['timestamp', 'unread_count', 'last_read_timestamp', 'entry_type', 'id']
    );

    if (!result.ok) {
      throw new Error(result.message);
    }

    return result.rows.length
      ? {
          timestamp: result.rows[0][0] as number,
          unreadCount: result.rows[0][1] as number,
          lastReadTimestamp: result.rows[0][2] as number,
        }
      : {
          timestamp: TIMESTAMP_INTITAL,
          unreadCount: 0,
          lastReadTimestamp: TIMESTAMP_INTITAL,
        };
  }

  private addSyncStatus(
    entryType: EntryType,
    id: NeuronAddress | ParticleCid,
    timestamp: number,
    unreadCount: number,
    lastReadTimestamp: number
  ) {
    const entity = mapSyncStatusToEntity(
      entryType,
      id,
      timestamp,
      unreadCount,
      lastReadTimestamp
    );
    this.dbApi?.executePutCommand('sync_status', [entity]);
  }

  private updateSyncStatus(
    id: NeuronAddress | ParticleCid,
    timestamp: number,
    unreadCount: number,
    lastReadTimestamp: number
  ) {
    const entity = {
      id,
      timestamp,
      unread_count: unreadCount,
      last_read_timestamp: lastReadTimestamp,
    };
    this.dbApi?.executeUpdateCommand('sync_status', [entity]);
  }
}

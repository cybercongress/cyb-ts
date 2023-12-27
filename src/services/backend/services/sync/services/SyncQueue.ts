import {
  BehaviorSubject,
  Observable,
  defer,
  filter,
  mergeMap,
  tap,
  from,
  map,
  combineLatest,
} from 'rxjs';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { broadcastStatus } from 'src/services/backend/channels/broadcastStatus';
import { ParticleCid } from 'src/types/base';
import { SyncQueueStatus } from 'src/services/CozoDb/types/entities';
import DbApi from '../../dataSource/indexedDb/dbApiWrapper';

import { FetchIpfsFunc, SyncQueueItem } from '../types';

import { ServiceDeps } from './types';

class SyncQueue {
  public isInitialized$: Observable<boolean>;

  private db: DbApi | undefined;

  // private ipfsNode: CybIpfsNode | undefined;

  private resolveAndSaveParticle: FetchIpfsFunc;

  private statusApi = broadcastStatus('resolver', new BroadcastChannelSender());

  private syncQueue$ = new BehaviorSubject<Map<ParticleCid, SyncQueueItem>>(
    new Map()
  );

  private processingQueue = new Map<ParticleCid, SyncQueueItem>();

  constructor(deps: ServiceDeps) {
    if (!deps.resolveAndSaveParticle) {
      throw new Error('resolveAndSaveParticle is not defined');
    }

    this.resolveAndSaveParticle = deps.resolveAndSaveParticle;

    deps.dbInstance$.subscribe(async (db) => {
      this.db = db;
      await this.loadSyncQueue();
    });

    // this.isInitialized$ = isInitialized$;

    this.isInitialized$ = combineLatest([
      deps.dbInstance$,
      deps.ipfsInstance$,
    ]).pipe(
      map(([dbInstance, ipfsInstance]) => !!ipfsInstance && !!dbInstance)
    );
  }

  private async processSyncQueue() {
    this.processingQueue = new Map(this.syncQueue$.value); // Snapshot of the current queue
    this.syncQueue$.next(new Map());

    const batchSize = this.processingQueue.size;
    let i = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const [cid, item] of this.processingQueue) {
      i++;
      this.statusApi.sendStatus(
        'in-progress',
        `processing batch ${i}/${batchSize}...`
      );
      // eslint-disable-next-line no-await-in-loop
      await this.resolveAndSaveParticle(cid).then((result) => {
        if (result.status === 'not_found') {
          this.db!.updateSyncQueue({ id: cid, status: SyncQueueStatus.error });
        } else {
          this.db!.removeSyncQueue(cid);
        }

        this.processingQueue.delete(cid);
      });
    }
  }

  start() {
    this.isInitialized$
      .pipe(
        filter((isInitialized) => isInitialized === true),
        mergeMap(() => this.syncQueue$), // Merge the queue$ stream here.
        tap((q) => console.log(`sync queue - ${q.size}`)),
        filter((queue) => queue.size > 0 && this.processingQueue.size === 0),
        tap(() => this.statusApi.sendStatus('in-progress', `starting...`)),
        mergeMap(() => defer(() => from(this.processSyncQueue())))
      )
      .subscribe({
        next: (result) => this.statusApi.sendStatus('idle'),
        error: (err) => this.statusApi.sendStatus('error', err.toString()),
      });

    return this;
  }

  public async pushToSyncQueue(items: SyncQueueItem[]) {
    if (items.length === 0) {
      return;
    }
    await this.db!.putSyncQueue(items);
    const queue = this.syncQueue$.value;
    console.log('------pushToSyncQueue', items, typeof queue);
    items.forEach((item) => queue.set(item.id, item));
    this.syncQueue$.next(queue);
  }

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
}

export default SyncQueue;

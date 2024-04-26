import {
  BehaviorSubject,
  Observable,
  filter,
  mergeMap,
  tap,
  map,
  combineLatest,
  share,
  EMPTY,
} from 'rxjs';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { broadcastStatus } from 'src/services/backend/channels/broadcastStatus';
import { ParticleCid } from 'src/types/base';
import { SyncQueueStatus } from 'src/services/CozoDb/types/entities';
import { QueuePriority } from 'src/services/QueueManager/types';
import { asyncIterableBatchProcessor } from 'src/utils/async/iterable';

import DbApi from '../../../DbApi/DbApi';

import { FetchIpfsFunc } from '../../types';
import { ServiceDeps } from '../types';
import { SyncQueueItem } from './types';
import { MAX_DATABASE_PUT_SIZE } from '../consts';

const QUEUE_BATCH_SIZE = 100;

class ParticlesResolverQueue {
  public isInitialized$: Observable<boolean>;

  private db: DbApi | undefined;

  private waitForParticleResolve: FetchIpfsFunc;

  private statusApi = broadcastStatus('resolver', new BroadcastChannelSender());

  private _syncQueue$ = new BehaviorSubject<Map<ParticleCid, SyncQueueItem>>(
    new Map()
  );

  public get queue(): Map<ParticleCid, SyncQueueItem> {
    return this._syncQueue$.getValue();
  }

  private _loop$: Observable<any> | undefined;

  public get loop$(): Observable<any> | undefined {
    return this._loop$;
  }

  constructor(deps: ServiceDeps) {
    if (!deps.waitForParticleResolve) {
      throw new Error('waitForParticleResolve is not defined');
    }

    this.waitForParticleResolve = deps.waitForParticleResolve;

    deps.dbInstance$.subscribe(async (db) => {
      this.db = db;
      await this.loadSyncQueue();
    });

    this.isInitialized$ = combineLatest([
      deps.dbInstance$,
      deps.ipfsInstance$,
    ]).pipe(
      map(([dbInstance, ipfsInstance]) => !!ipfsInstance && !!dbInstance)
    );
  }

  private async processSyncQueue(pendingItems: SyncQueueItem[]) {
    // console.log('------processSyncQueue ', pendingItems);

    const batchSize = pendingItems.length;

    this.statusApi.sendStatus(
      'in-progress',
      `processing batch ${batchSize}/${batchSize} batch. ${this.queue.size} pending...`
    );

    let i = batchSize;
    await Promise.all(
      pendingItems.map(async (item) => {
        const { id } = item;
        // eslint-disable-next-line no-await-in-loop
        return this.waitForParticleResolve(id, QueuePriority.MEDIUM).then(
          async (result) => {
            if (result.status === 'not_found') {
              await this.db!.updateSyncQueue({
                id,
                status: SyncQueueStatus.error,
              });
            } else {
              await this.db!.removeSyncQueue(id);
            }

            const queue = this._syncQueue$.value;
            queue.delete(id);
            i--;
            this._syncQueue$.next(queue);

            this.statusApi.sendStatus(
              'in-progress',
              `processing batch ${batchSize - i}/${batchSize} batch. ${
                this.queue.size
              } pending...`
            );
          }
        );
      })
    );
  }

  start() {
    const source$ = this.isInitialized$.pipe(
      tap((q) => console.log(`sync queue isInitialized - ${q}`)),
      filter((isInitialized) => isInitialized === true),
      mergeMap(() => this._syncQueue$), // Merge the queue$ stream here.
      // tap((q) => console.log(`sync queue - ${q.size}`)),
      filter((q) => q.size > 0),
      mergeMap((queue) => {
        const list = [...queue.values()];

        const executingCount = list.filter(
          (i) => i.status === SyncQueueStatus.executing
        ).length;

        const batchSize = QUEUE_BATCH_SIZE - executingCount;

        if (batchSize > 0) {
          const pendingItems = list
            .filter((i) => i.status === SyncQueueStatus.pending)
            .sort((a, b) => {
              return a.priority - b.priority;
            })
            .slice(0, batchSize);

          if (pendingItems.length > 0) {
            pendingItems.forEach((i) => {
              queue.set(i.id, {
                ...i,
                status: SyncQueueStatus.executing,
              });
            });

            this._syncQueue$.next(queue);

            this.statusApi.sendStatus('in-progress', `starting...`);
            return this.processSyncQueue(pendingItems);
          }
        }

        return EMPTY;
      })
    );

    this._loop$ = source$.pipe(share());

    this._loop$.subscribe({
      next: (result) => {
        this.statusApi.sendStatus('active');
      },
      error: (err) => this.statusApi.sendStatus('error', err.toString()),
    });

    return this;
  }

  public async fetchDirect(cid: ParticleCid) {
    return this.waitForParticleResolve(cid, QueuePriority.URGENT);
  }

  public async enqueueBatch(cids: ParticleCid[], priority: QueuePriority) {
    return asyncIterableBatchProcessor(
      cids,
      (cids) =>
        this.enqueue(
          cids.map((cid) => ({
            id: cid /* from is tweet */,
            priority,
          }))
        ),
      MAX_DATABASE_PUT_SIZE
    );
  }

  public async enqueue(items: SyncQueueItem[]) {
    if (items.length === 0) {
      return;
    }
    await this.db!.putSyncQueue(items);
    const queue = this._syncQueue$.value;

    items.forEach((item) =>
      queue.set(item.id, { ...item, status: SyncQueueStatus.pending })
    );
    this._syncQueue$.next(queue);
  }

  private async loadSyncQueue() {
    const queue = await this.db!.getSyncQueue({
      statuses: [SyncQueueStatus.pending],
    }).then((items) => new Map(items.map((item) => [item.id, item])));

    this._syncQueue$.next(new Map([...queue, ...this.queue]));
  }
}

export default ParticlesResolverQueue;

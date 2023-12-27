import { Observable, defer, from, map, combineLatest } from 'rxjs';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { broadcastStatus } from 'src/services/backend/channels/broadcastStatus';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { SyncStatusDto } from 'src/services/CozoDb/types/dto';

import DbApi from '../../dataSource/indexedDb/dbApiWrapper';

import { ServiceDeps } from './types';
import { createLoopObservable } from './utils';
import { BLOCKCHAIN_SYNC_INTERVAL } from './consts';
import SyncQueue from './SyncQueue';
import { fetchCyberlinksAndGetStatus } from '../utils';
import { FetchIpfsFunc, SyncQueueItem, SyncServiceParams } from '../types';

class SyncParticlesLoop {
  private isInitialized$: Observable<boolean>;

  private db: DbApi | undefined;

  private syncQueue: SyncQueue | undefined;

  private params: SyncServiceParams | undefined;

  private statusApi = broadcastStatus('particle', new BroadcastChannelSender());

  private resolveAndSaveParticle: FetchIpfsFunc;

  private _loop$: Observable<any>;

  public get loop$(): Observable<any> {
    return this._loop$;
  }

  constructor(deps: ServiceDeps, syncQueue: SyncQueue) {
    if (!deps.resolveAndSaveParticle) {
      throw new Error('resolveAndSaveParticle is not defined');
    }

    if (!deps.params$) {
      throw new Error('params$ is not defined');
    }

    this.resolveAndSaveParticle = deps.resolveAndSaveParticle;

    deps.dbInstance$.subscribe((db) => {
      this.db = db;
    });

    deps.params$.subscribe((params) => {
      this.params = params;
    });

    this.syncQueue = syncQueue;

    this.isInitialized$ = combineLatest([
      deps.dbInstance$,
      deps.ipfsInstance$,
      deps.params$,
      syncQueue.isInitialized$,
    ]).pipe(
      map(
        ([dbInstance, ipfsInstance, params, syncQueueInitialized]) =>
          !!ipfsInstance &&
          !!dbInstance &&
          !!syncQueueInitialized &&
          !!params.cyberIndexUrl
      )
    );
  }

  private async syncParticles() {
    // fetch observable particles from db
    const result = await this.db!.findSyncStatus({
      entryType: EntryType.particle,
    });
    // const syncStatusEntities: SyncStatusDto[] = [];
    console.log('---syncParticles result', result);
    const syncStatusEntities = (
      await Promise.all(
        result.map(async (syncStatus) => {
          const { id, unreadCount, timestampUpdate, timestampRead } =
            syncStatus;
          return fetchCyberlinksAndGetStatus(
            this.params!.cyberIndexUrl!,
            id as string,
            timestampUpdate as number,
            timestampRead as number,
            unreadCount as number,
            this.resolveAndSaveParticle,
            (items: SyncQueueItem[]) => this.syncQueue!.pushToSyncQueue(items)
          );
        })
      )
    ).filter((i) => i !== undefined) as SyncStatusDto[];
    console.log('---syncParticles syncStatusEntities', syncStatusEntities);

    syncStatusEntities.length > 0 &&
      (await this.db!.putSyncStatus(syncStatusEntities));
  }

  start() {
    this._loop$ = createLoopObservable(
      BLOCKCHAIN_SYNC_INTERVAL,
      this.isInitialized$,
      defer(() => from(this.syncParticles())),
      () => this.statusApi.sendStatus('in-progress')
    );

    this._loop$.subscribe({
      next: (result) => this.statusApi.sendStatus('idle'),
      error: (err) => this.statusApi.sendStatus('error', err.toString()),
    });

    return this;
  }
}

export default SyncParticlesLoop;

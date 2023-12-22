import { Observable, defer, from, map, combineLatest } from 'rxjs';
import BroadcastChannelSender, {
  broadcastStatus,
} from 'src/services/backend/channels/BroadcastChannelSender';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { CybIpfsNode } from 'src/services/ipfs/ipfs';

import { DbApi } from '../../dataSource/indexedDb/dbApiWrapper';

import { ServiceDeps } from './types';
import { createLoopObservable } from './utils';
import { BLOCKCHAIN_SYNC_INTERVAL } from './consts';
import SyncQueue from './SyncQueue';
import { fetchCyberlinksAndGetStatus } from '../utils';
import { FetchIpfsFunc, SyncQueueItem, SyncServiceParams } from '../types';

class SyncParticlesLoop {
  private isInitialized$: Observable<boolean>;

  private db: DbApi | undefined;

  private ipfsNode: CybIpfsNode | undefined;

  private syncQueue: SyncQueue | undefined;

  private params: SyncServiceParams | undefined;

  private statusApi = broadcastStatus('particle', new BroadcastChannelSender());

  private resolveAndSaveParticle: FetchIpfsFunc;

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

    deps.ipfsInstance$.subscribe((ipfsInstance) => {
      this.ipfsNode = ipfsInstance;
    });

    this.syncQueue = syncQueue;

    // this.isInitialized$ = isInitialized$;

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
    const dbResult = await this.db!.findSyncStatus({
      entryType: EntryType.particle,
    });
    dbResult.rows.map(async (row) => {
      const [id, unreadCount, timestampUpdate, timestampRead] = row;
      await fetchCyberlinksAndGetStatus(
        this.params!.cyberIndexUrl!,
        id as string,
        timestampUpdate as number,
        timestampRead as number,
        unreadCount as number,
        this.resolveAndSaveParticle,
        (items: SyncQueueItem[]) => this.syncQueue!.pushToSyncQueue(items)
      );
    });
  }

  start() {
    createLoopObservable(
      BLOCKCHAIN_SYNC_INTERVAL,
      this.isInitialized$,
      defer(() => from(this.syncParticles())),
      () => this.statusApi.sendStatus('in-progress')
    ).subscribe({
      next: (result) => this.statusApi.sendStatus('idle'),
      error: (err) => this.statusApi.sendStatus('error', err.toString()),
    });

    return this;
  }
}

export default SyncParticlesLoop;

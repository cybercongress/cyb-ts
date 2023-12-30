import { Observable, defer, from, map, combineLatest } from 'rxjs';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { broadcastStatus } from 'src/services/backend/channels/broadcastStatus';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { SyncStatusDto } from 'src/services/CozoDb/types/dto';

import DbApi from '../../dataSource/indexedDb/dbApiWrapper';

import { ServiceDeps } from './types';
import { createLoopObservable } from './utils';
import { BLOCKCHAIN_SYNC_INTERVAL } from './consts';
import ParticlesResolverQueue from './ParticlesResolverQueue';
import { updateSyncState } from '../utils';
import { SyncServiceParams } from '../types';
import { fetchAllCyberlinks } from '../../dataSource/blockchain/requests';
import { QueuePriority } from 'src/services/QueueManager/types';

class SyncParticlesLoop {
  private isInitialized$: Observable<boolean>;

  private db: DbApi | undefined;

  private particlesResolver: ParticlesResolverQueue | undefined;

  private params: SyncServiceParams | undefined;

  private statusApi = broadcastStatus('particle', new BroadcastChannelSender());

  private _loop$: Observable<any>;

  public get loop$(): Observable<any> {
    return this._loop$;
  }

  constructor(deps: ServiceDeps, particlesResolver: ParticlesResolverQueue) {
    if (!deps.params$) {
      throw new Error('params$ is not defined');
    }

    deps.dbInstance$.subscribe((db) => {
      this.db = db;
    });

    deps.params$.subscribe((params) => {
      this.params = params;
    });

    this.particlesResolver = particlesResolver;

    this.isInitialized$ = combineLatest([
      deps.dbInstance$,
      deps.ipfsInstance$,
      deps.params$,
      particlesResolver.isInitialized$,
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
          const { id, timestampUpdate } = syncStatus;
          const links = await fetchAllCyberlinks(
            this.params!.cyberIndexUrl!,
            id as string,
            timestampUpdate as number
          );
          try {
            if (links.length === 0) {
              return undefined;
            }

            const allLinks = [
              ...new Set([
                ...links.map((link) => link.to),
                ...links.map((link) => link.from),
              ]),
            ];

            await this.particlesResolver!.enqueue(
              allLinks.map((cid) => ({
                id: cid,
                priority: QueuePriority.MEDIUM,
              }))
            );

            return updateSyncState(syncStatus, links);
          } catch (e) {
            console.log('---------syncStatusEntities', e, links, syncStatus);
            throw e;
          }
        })
      )
    ).filter((i) => !!i) as SyncStatusDto[];
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

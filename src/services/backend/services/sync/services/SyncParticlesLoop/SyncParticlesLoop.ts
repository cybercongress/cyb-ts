import { Observable, defer, from, map, combineLatest } from 'rxjs';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { broadcastStatus } from 'src/services/backend/channels/broadcastStatus';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { SyncStatusDto } from 'src/services/CozoDb/types/dto';
import { QueuePriority } from 'src/services/QueueManager/types';

import DbApi from '../../../dataSource/indexedDb/dbApiWrapper';

import { ServiceDeps } from '../types';
import { fetchCyberlinksAndResolveParticles } from '../utils/links';
import { createLoopObservable } from '../utils/rxjs';
import { PARTICLES_SYNC_INTERVAL } from '../consts';
import ParticlesResolverQueue from '../ParticlesResolverQueue/ParticlesResolverQueue';
import { changeSyncStatus } from '../../utils';
import { SyncServiceParams } from '../../types';
import { snakeToCamel, transformToDto } from 'src/services/CozoDb/utils';
import { dateToNumber } from 'src/utils/date';
import { mapLinkFromIndexerToDbEntity } from 'src/services/CozoDb/mapping';
import {
  SenseMetaType,
  SenseParticleResultMeta,
} from 'src/services/backend/types/sense';

class SyncParticlesLoop {
  private isInitialized$: Observable<boolean>;

  private db: DbApi | undefined;

  private particlesResolver: ParticlesResolverQueue | undefined;

  private channelApi = new BroadcastChannelSender();

  private params: SyncServiceParams | undefined;

  private statusApi = broadcastStatus('particle', this.channelApi);

  private _loop$: Observable<any> | undefined;

  public get loop$(): Observable<any> | undefined {
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
          !!params.cyberIndexUrl &&
          !!params.myAddress
      )
    );
  }

  private async syncParticles() {
    const syncUpdates = [];
    try {
      // fetch observable particles from db
      const result = await this.db!.findSyncStatus({
        ownerId: this.params!.myAddress!,
        entryType: EntryType.particle,
      });

      // TODO: Sync one-by-one | batch
      const syncStatusEntities = (
        await Promise.all(
          result.map(async (syncStatus) => {
            const { id, timestampUpdate } = syncStatus;
            const links = await fetchCyberlinksAndResolveParticles(
              this.params!.cyberIndexUrl!,
              id as string,
              timestampUpdate as number,
              this.particlesResolver!,
              QueuePriority.MEDIUM
            );

            if (links.length > 0) {
              const entities = links.map(mapLinkFromIndexerToDbEntity);

              await this.db!.putCyberlinks(entities);

              return changeSyncStatus(syncStatus, links);
            }

            return undefined;
          })
        )
      ).filter((i) => !!i) as SyncStatusDto[];

      if (syncStatusEntities.length > 0) {
        const result = await this.db!.putSyncStatus(syncStatusEntities);
        if (result.ok) {
          syncUpdates.push(...syncStatusEntities);
        }
      }
    } catch (e) {
      console.log('>>> SyncParticlesLoop error:', e);
      throw e;
    } finally {
      // eslint-disable-next-line no-await-in-loop
      const syncStatusItems = await Promise.all(
        syncUpdates.map(async (item) => {
          const { result: particle } =
            await this.particlesResolver!.fetchDirect(item.id);
          const { result: lastParticle } =
            await this.particlesResolver!.fetchDirect(item.lastId);

          return {
            ...item,
            meta: {
              metaType: SenseMetaType.particle,
              ...item.meta,
              id: {
                cid: particle?.cid,
                text: particle?.textPreview,
                mime: particle?.meta.mime,
              },
              lastId: {
                cid: lastParticle?.cid,
                text: lastParticle?.textPreview,
                mime: lastParticle?.meta.mime,
              },
            } as SenseParticleResultMeta,
          };
        })
      );
      this.channelApi.postSenseUpdate(syncStatusItems);
    }
  }

  start() {
    this._loop$ = createLoopObservable(
      PARTICLES_SYNC_INTERVAL,
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

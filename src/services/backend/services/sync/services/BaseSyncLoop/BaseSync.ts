import { Observable } from 'rxjs';

import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { broadcastStatus } from 'src/services/backend/channels/broadcastStatus';
import { SyncEntryName } from 'src/services/backend/types/services';

import DbApiWrapper from '../../../dataSource/indexedDb/dbApiWrapper';
import ParticlesResolverQueue from '../ParticlesResolverQueue/ParticlesResolverQueue';
import { ProgressTracker } from '../ProgressTracker/ProgressTracker';
import { ServiceDeps } from '../types';
import { SyncServiceParams } from '../../types';

abstract class BaseSync {
  protected name: string;

  protected abortController: AbortController | undefined;

  protected db: DbApiWrapper | undefined;

  protected progressTracker = new ProgressTracker();

  protected channelApi = new BroadcastChannelSender();

  protected particlesResolver: ParticlesResolverQueue | undefined;

  protected statusApi: ReturnType<typeof broadcastStatus>;

  protected params: SyncServiceParams = {
    myAddress: null,
    followings: [],
  };

  constructor(
    name: SyncEntryName,
    deps: ServiceDeps,
    particlesResolver: ParticlesResolverQueue
  ) {
    this.name = name;
    this.statusApi = broadcastStatus(name, this.channelApi);
    this.particlesResolver = particlesResolver;

    if (!deps.params$) {
      throw new Error('params$ is not defined');
    }

    deps.dbInstance$.subscribe((db) => {
      this.db = db;
    });

    deps.params$.subscribe((params) => {
      const shouldRestart =
        this.params?.myAddress && this.params?.myAddress !== params.myAddress;
      this.params = params;

      if (shouldRestart) {
        this.restart();
      }
    });

    this.particlesResolver = particlesResolver;

    const isInitialized$ = this.createIsInitializedObserver(deps);

    isInitialized$.subscribe((isInitialized) => {
      this.statusApi.sendStatus(isInitialized ? 'initialized' : 'inactive');
    });
  }

  protected abstract createIsInitializedObserver(
    deps: ServiceDeps
  ): Observable<boolean>;

  public abstract restart(): void;

  public abstract start(): void;
}

export default BaseSync;

import { Observable, defer, from } from 'rxjs';

import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { broadcastStatus } from 'src/services/backend/channels/broadcastStatus';
import { SyncEntryName } from 'src/services/backend/types/services';

import DbApiWrapper from '../../../dataSource/indexedDb/dbApiWrapper';
import ParticlesResolverQueue from '../ParticlesResolverQueue/ParticlesResolverQueue';
import { ProgressTracker } from '../ProgressTracker/ProgressTracker';
import { ServiceDeps } from '../types';
import { createLoopObservable } from '../utils/rxjs/loop';
import { SyncServiceParams } from '../../types';

abstract class BaseSyncLoop {
  private restartLoop: (() => void) | undefined;

  protected name: string;

  protected db: DbApiWrapper | undefined;

  protected abortController: AbortController | undefined;

  protected progressTracker = new ProgressTracker();

  protected channelApi = new BroadcastChannelSender();

  protected particlesResolver: ParticlesResolverQueue | undefined;

  protected statusApi: ReturnType<typeof broadcastStatus>;

  protected params: SyncServiceParams = {
    myAddress: null,
    followings: [],
  };

  public readonly loop$: Observable<boolean>;

  constructor(
    name: SyncEntryName,
    intervalMs: number,
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
      if (
        this.params?.myAddress &&
        this.params?.myAddress !== params.myAddress
      ) {
        restart();
      }
      this.params = params;
    });

    this.particlesResolver = particlesResolver;

    const isInitialized$ = this.getIsInitializedObserver(deps);

    isInitialized$.subscribe((isInitialized) => {
      console.log(`>>> ${name} initialized`, isInitialized);
      this.statusApi.sendStatus(isInitialized ? 'initialized' : 'inactive');
    });

    const { loop$, restart } = createLoopObservable(
      intervalMs,
      isInitialized$,
      // defer(() => from(this.sync())),
      defer(() => from(this.doSync())),
      {
        onStartInterval: () => {
          console.log(`>>> ${name} loop start`);
        },
        onError: (error) => {
          console.log(`>>> ${name} error`, error.toString());
          this.statusApi.sendStatus('error', error.toString());
        },
      }
    );

    this.loop$ = loop$;
    this.restartLoop = restart;
  }

  public restart() {
    this.abortController?.abort();
    this.restartLoop?.();
  }

  public start() {
    this.loop$.subscribe(() => this.statusApi.sendStatus('idle'));
    return this;
  }

  private async doSync() {
    this.abortController = new AbortController();
    try {
      await this.sync();
    } catch (e) {
      const isAborted = e instanceof DOMException && e.name === 'AbortError';

      console.log(`>>> ${this.name} sync error:`, e, isAborted);

      if (!isAborted) {
        throw e;
      }
    }
  }

  protected abstract sync(): Promise<void>;

  protected abstract getIsInitializedObserver(
    deps: ServiceDeps
  ): Observable<boolean>;
}

export default BaseSyncLoop;

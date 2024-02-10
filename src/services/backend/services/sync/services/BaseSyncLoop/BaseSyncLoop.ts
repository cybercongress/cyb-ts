import { Observable, defer } from 'rxjs';

import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { broadcastStatus } from 'src/services/backend/channels/broadcastStatus';

import DbApiWrapper from '../../../dataSource/indexedDb/dbApiWrapper';
import ParticlesResolverQueue from '../ParticlesResolverQueue/ParticlesResolverQueue';
import { ProgressTracker } from '../ProgressTracker/ProgressTracker';
import { ServiceDeps } from '../types';
import { SyncEntryName } from 'src/services/backend/types/services';
import { createLoopObservable } from '../utils/rxjs/loop';
import { SyncServiceParams } from '../../types';

abstract class BaseSyncLoop {
  private name: string;

  private db: DbApiWrapper | undefined;

  private particlesResolver: ParticlesResolverQueue | undefined;

  private _loop$: Observable<any>;

  private restartLoop: (() => void) | undefined;

  protected abortController: AbortController | undefined;

  protected progressTracker = new ProgressTracker();

  protected channelApi = new BroadcastChannelSender();

  public get loop$(): Observable<any> {
    return this._loop$;
  }

  private statusApi: ReturnType<typeof broadcastStatus>;

  private params: SyncServiceParams = {
    myAddress: null,
    followings: [],
  };

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
    });

    this.particlesResolver = particlesResolver;

    const { loop$, restart } = createLoopObservable(
      intervalMs,
      this.getIsInitializedObserver(),
      // defer(() => from(this.sync())),
      defer(() => this.createSyncLoop()),
      {
        onStartInterval: () => {
          console.log(`>>> ${name} loop`);
        },
        onError: (error) => {
          console.log(`>>> ${name} error`, error.toString());
          this.statusApi.sendStatus('error', error.toString());
        },
      }
    );

    this._loop$ = loop$;
    this.restartLoop = restart;
  }

  public restart() {
    this.abortController?.abort();
    this.restartLoop?.();
  }

  public start() {
    this._loop$.subscribe(() => this.statusApi.sendStatus('idle'));
    return this;
  }

  private async createSyncLoop() {
    return async () => {
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
    };
  }

  public abstract sync(): Promise<void>;

  public abstract getIsInitializedObserver(): Observable<boolean>;
}

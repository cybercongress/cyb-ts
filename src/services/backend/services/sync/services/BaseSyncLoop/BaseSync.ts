import {
  Observable,
  defer,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs';

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

  public abortFlag = false; // flag to break any cycle

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

    this.particlesResolver = particlesResolver;

    const isInitialized$ = this.createIsInitializedObserver(deps);

    isInitialized$.subscribe((isInitialized) => {
      console.log(
        `>>> ${this.name} - ${isInitialized ? 'initialized' : 'inactive'}`
      );
      this.statusApi.sendStatus(isInitialized ? 'initialized' : 'inactive');
    });

    const restartTrigger$ = isInitialized$.pipe(
      switchMap(() => this.createRestartObserver(deps.params$!))
    );

    restartTrigger$.subscribe((shouldRestart) => {
      if (shouldRestart) {
        this.restart();
      }
    });

    isInitialized$.pipe(switchMap(() => deps.params$!)).subscribe((params) => {
      this.params = params;
      console.log(`>>> ${this.name} - params updated`, params);
    });
  }

  protected initAbortController() {
    this.abortController = new AbortController();
    this.abortFlag = false;
    this.abortController.signal.onabort = () => {
      this.abortFlag = true;
    };
  }

  protected abstract createIsInitializedObserver(
    deps: ServiceDeps
  ): Observable<boolean>;

  // eslint-disable-next-line class-methods-use-this
  protected createRestartObserver(params$: Observable<SyncServiceParams>) {
    return params$.pipe(
      map((params) => params.myAddress),
      distinctUntilChanged((a, b) => !a && a === b),
      map((v) => !!v)
    );
  }

  public abstract restart(): void;

  public abstract start(): void;
}

export default BaseSync;

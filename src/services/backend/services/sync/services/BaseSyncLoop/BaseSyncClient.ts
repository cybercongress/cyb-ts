import { Observable, Subject, from, startWith, switchMap, tap } from 'rxjs';

import { SyncEntryName } from 'src/services/backend/types/services';

import ParticlesResolverQueue from '../ParticlesResolverQueue/ParticlesResolverQueue';
import { ServiceDeps } from '../types';
import BaseSync from './BaseSync';
import { withInitializerObserver } from '../utils/rxjs/withInitializer';

abstract class BaseSyncClient extends BaseSync {
  protected readonly isInitialized$: Observable<boolean>;

  protected readonly source$: Observable<any>;

  protected readonly restartTrigger$: Subject<void>;

  constructor(
    name: SyncEntryName,
    deps: ServiceDeps,
    particlesResolver: ParticlesResolverQueue
  ) {
    super(name, deps, particlesResolver);

    this.isInitialized$ = this.createIsInitializedObserver(deps);
    this.restartTrigger$ = new Subject<void>();

    this.isInitialized$.subscribe((isInitialized) => {
      this.statusApi.sendStatus(isInitialized ? 'initialized' : 'inactive');
    });

    const source$ = withInitializerObserver(
      this.isInitialized$,
      this.restartTrigger$.pipe(
        startWith(null),
        tap(() => {
          // initialize abort conteoller for restart strategy
          this.abortController = new AbortController();
        }),
        switchMap(() =>
          this.createInitObservable().pipe(
            switchMap((timestampFrom: number) =>
              this.createClientObservable(timestampFrom).pipe(
                switchMap((data) => from(this.onUpdate(data)))
              )
            )
          )
        )
      )
    );

    source$.subscribe(() => this.statusApi.sendStatus('idle'));
    this.source$ = source$;
  }

  protected abstract createClientObservable(
    timestampFrom: number
  ): Observable<any>;

  protected abstract createInitObservable(): Observable<number>;

  public restart() {
    this.abortController?.abort();
    this.restartTrigger$.next();
  }

  protected abstract onUpdate(data: any): Promise<void>;

  public start() {
    this.source$.subscribe(() => {
      // dummy subscriber to keep pipeline running - don't remove
    });
    return this;
  }
}

export default BaseSyncClient;

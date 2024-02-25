import { Observable, defer, filter, from, tap } from 'rxjs';

import { SyncEntryName } from 'src/services/backend/types/services';
import { isAbortException } from 'src/utils/exceptions/helpers';
import { clone } from 'ramda';

import ParticlesResolverQueue from '../ParticlesResolverQueue/ParticlesResolverQueue';
import { ServiceDeps } from '../types';
import { createLoopObservable } from '../utils/rxjs/loop';
import BaseSync from './BaseSync';
import { SyncServiceParams } from '../../types';

abstract class BaseSyncLoop extends BaseSync {
  private restartLoop: (() => void) | undefined;

  public readonly loop$: Observable<boolean>;

  constructor(
    name: SyncEntryName,
    intervalMs: number,
    deps: ServiceDeps,
    particlesResolver: ParticlesResolverQueue,
    {
      warmupMs,
      extraIsInitialized$,
    }: {
      warmupMs: number;
      extraIsInitialized$?: Observable<boolean> | undefined;
    } = { warmupMs: 0 }
  ) {
    super(name, deps, particlesResolver, extraIsInitialized$);

    const { loop$, restartLoop } = createLoopObservable(
      this.isInitialized$,
      // defer(() => from(this.sync())),
      defer(() => from(this.doSync())),
      {
        intervalMs,
        warmupMs,
        // onStartInterval: () => this.initAbortController(),
        onError: (error) => {
          console.log(`>>> ${name} error`, error.toString());
          this.statusApi.sendStatus('error', error.toString());
        },
        onChange: (isInitialized) => {
          console.log(`>>> ${name} isInitialized`, isInitialized);
          this.statusApi.sendStatus(isInitialized ? 'initialized' : 'inactive');
        },
      }
    );

    this.loop$ = loop$;
    this.restartLoop = restartLoop;
  }

  public restart() {
    this.abortController?.abort();
    this.restartLoop?.();
    console.log(`>>> ${this.name} loop restart`);
  }

  public start() {
    this.loop$.subscribe(() => this.statusApi.sendStatus('idle'));
    return this;
  }

  private async doSync() {
    const params = clone(this.params);
    this.initAbortController();
    try {
      await this.sync(params);
    } catch (e) {
      const isAborted = isAbortException(e);
      console.log(
        `>>> ${this.name} ${params.myAddress} sync error:`,
        e,
        isAborted
      );

      if (!isAborted) {
        throw e;
      }
    }
  }

  protected abstract sync(params: SyncServiceParams): Promise<void>;
}

export default BaseSyncLoop;

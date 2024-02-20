import { Observable, defer, filter, from, tap } from 'rxjs';

import { SyncEntryName } from 'src/services/backend/types/services';
import { isAbortException } from 'src/utils/exceptions/helpers';

import ParticlesResolverQueue from '../ParticlesResolverQueue/ParticlesResolverQueue';
import { ServiceDeps } from '../types';
import { createLoopObservable } from '../utils/rxjs/loop';
import BaseSync from './BaseSync';

abstract class BaseSyncLoop extends BaseSync {
  private restartLoop: (() => void) | undefined;

  public readonly loop$: Observable<boolean>;

  constructor(
    name: SyncEntryName,
    intervalMs: number,
    deps: ServiceDeps,
    particlesResolver: ParticlesResolverQueue,
    { warmupMs }: { warmupMs: number } = { warmupMs: 0 }
  ) {
    super(name, deps, particlesResolver);

    const { loop$, restartLoop } = createLoopObservable(
      this.isInitialized$,
      // defer(() => from(this.sync())),
      defer(() => from(this.doSync())),
      {
        intervalMs,
        warmupMs,
        onStartInterval: () => this.initAbortController(),
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
    try {
      await this.sync();
    } catch (e) {
      const isAborted = isAbortException(e);
      console.log(`>>> ${this.name} sync error:`, e, isAborted);

      if (!isAborted) {
        throw e;
      }
    }
  }

  protected abstract sync(): Promise<void>;
}

export default BaseSyncLoop;

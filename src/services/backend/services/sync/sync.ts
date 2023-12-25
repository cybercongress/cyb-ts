/* eslint-disable no-restricted-syntax */
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import BroadcastChannelSender from '../../channels/BroadcastChannelSender';

import SyncQueue from './services/SyncQueue';

import SyncIpfsLoop from './services/SyncIpfsLoop';
import SyncTransactionsLoop from './services/SyncTransactionsLoop';
import SyncParticlesLoop from './services/SyncParticlesLoop';
import { ServiceDeps } from './services/types';

// eslint-disable-next-line import/prefer-default-export
export class SyncService {
  private isInitialized$: Observable<boolean>;

  private channelApi = new BroadcastChannelSender();

  constructor(deps: ServiceDeps) {
    const { dbInstance$, ipfsInstance$ } = deps;
    this.isInitialized$ = combineLatest([dbInstance$, ipfsInstance$]).pipe(
      map(([dbInstance, ipfsInstance]) => !!dbInstance && !!ipfsInstance)
    );

    // subscribe when started
    this.isInitialized$.subscribe({
      next: (result) => {
        return result && this.channelApi.postServiceStatus('sync', 'started');
      },
      error: (err) => this.channelApi.postServiceStatus('sync', 'error', err),
    });

    const syncQueue = new SyncQueue(deps).start();

    new SyncIpfsLoop(deps, syncQueue).start();

    new SyncTransactionsLoop(deps, syncQueue).start();

    new SyncParticlesLoop(deps, syncQueue).start();
  }
}

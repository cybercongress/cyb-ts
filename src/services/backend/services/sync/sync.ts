/* eslint-disable no-restricted-syntax */
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import BroadcastChannelSender from '../../channels/BroadcastChannelSender';

import ParticlesResolverQueue from './services/ParticlesResolverQueue/ParticlesResolverQueue';

// import SyncIpfsLoop from './services/SyncIpfsLoop/SyncIpfsLoop';
import SyncTransactionsLoop from './services/SyncTransactionsLoop/SyncTransactionsLoop';
import SyncParticlesLoop from './services/SyncParticlesLoop/SyncParticlesLoop';

import { ServiceDeps } from './services/types';
import {
  MY_FRIENDS_SYNC_INTERVAL,
  MY_PARTICLES_SYNC_INTERVAL,
  MY_TRANSACTIONS_SYNC_INTERVAL,
} from './services/consts';
import SyncMyFriendsLoop from './services/SyncMyFriendsLoop/SyncMyFriendsLoop';
import { SyncEntryName } from '../../types/services';
import BaseSyncLoop from './services/BaseSyncLoop/BaseSyncLoop';

// eslint-disable-next-line import/prefer-default-export
export class SyncService {
  private isInitialized$: Observable<boolean>;

  private channelApi = new BroadcastChannelSender();

  private loops: Partial<Record<SyncEntryName, BaseSyncLoop>> = {};

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

    const particlesResolver = new ParticlesResolverQueue(deps).start();

    // new SyncIpfsLoop(deps, particlesResolver).start();

    new SyncTransactionsLoop('transaction', deps, particlesResolver).start();

    new SyncParticlesLoop(
      'particle',
      MY_PARTICLES_SYNC_INTERVAL,
      deps,
      particlesResolver
    ).start();

    new SyncMyFriendsLoop(
      'my-friends',
      MY_FRIENDS_SYNC_INTERVAL,
      deps,
      particlesResolver
    ).start();
  }

  public restart(name: SyncEntryName) {
    this.loops[name]?.restart();
  }
}

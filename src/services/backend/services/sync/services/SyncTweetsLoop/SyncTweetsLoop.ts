/* eslint-disable camelcase */
import { Observable, defer, from, map, combineLatest } from 'rxjs';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { broadcastStatus } from 'src/services/backend/channels/broadcastStatus';
import { EntryType } from 'src/services/CozoDb/types/entities';

import { NeuronAddress, ParticleCid } from 'src/types/base';
import { QueuePriority } from 'src/services/QueueManager/types';
import { executeSequentially } from 'src/utils/async/promise';

import DbApi from '../../../dataSource/indexedDb/dbApiWrapper';

import { ServiceDeps } from '../types';

import { createLoopObservable } from '../utils/rxjs';
import { TWEETS_SYNC_INTERVAL, TWEETS_SYNC_WARMUP } from '../consts';
import ParticlesResolverQueue from '../ParticlesResolverQueue/ParticlesResolverQueue';
import { fetchLinksByNeuronTimestamp } from '../../../dataSource/blockchain/lcd';
import { SyncServiceParams } from '../../types';
import {
  SenseMetaType,
  SenseTweetResultMeta,
} from 'src/services/backend/types/sense';
import { CID_FOLLOW, CID_TWEET } from 'src/utils/consts';

class SyncTweetsLoop {
  private isInitialized$: Observable<boolean>;

  private isInitialized = false;

  private db: DbApi | undefined;

  private particlesResolver: ParticlesResolverQueue | undefined;

  private inProgress: NeuronAddress[] = [];

  private _loop$: Observable<any> | undefined;

  private channelApi = new BroadcastChannelSender();

  public get loop$(): Observable<any> | undefined {
    return this._loop$;
  }

  private statusApi = broadcastStatus('tweets', this.channelApi);

  private params: SyncServiceParams = {
    myAddress: null,
    followings: [],
  };

  constructor(deps: ServiceDeps, particlesResolver: ParticlesResolverQueue) {
    if (!deps.params$) {
      throw new Error('params$ is not defined');
    }

    this.particlesResolver = particlesResolver;

    deps.dbInstance$.subscribe((db) => {
      this.db = db;
    });

    deps.params$.subscribe((params) => {
      this.params = params;
      if (this.isInitialized) {
        // executeSequentially
        const newFriends = params.followings
          .map((addr) =>
            this.params.followings.includes(addr) ? addr : undefined
          )
          .filter((addr) => !!addr) as NeuronAddress[];

        executeSequentially(
          newFriends.map(
            (addr) => () => this.syncParticlesFrom(this.params.myAddress!, addr)
          )
        );
      }
    });

    // this.isInitialized$ = isInitialized$;

    this.isInitialized$ = combineLatest([
      deps.dbInstance$,
      deps.params$,
      particlesResolver.isInitialized$,
    ]).pipe(
      map(
        ([dbInstance, params, syncQueueInitialized]) =>
          !!dbInstance &&
          !!syncQueueInitialized &&
          !!params.cyberLcdUrl &&
          !!params.myAddress
      )
    );

    this.isInitialized$.subscribe((isInitialized) => {
      this.isInitialized = isInitialized;
    });
  }

  start() {
    this._loop$ = createLoopObservable(
      TWEETS_SYNC_INTERVAL,
      this.isInitialized$,
      defer(() => from(this.syncAll())),
      () => this.statusApi.sendStatus('in-progress'),
      TWEETS_SYNC_WARMUP
    );

    this._loop$.subscribe({
      next: (result) => this.statusApi.sendStatus('idle'),
      error: (err) => this.statusApi.sendStatus('error', err.toString()),
    });

    return this;
  }

  private async syncAll() {
    try {
      await executeSequentially(
        this.params.followings.map(
          (addr) => () =>
            this.syncParticlesFrom(this.params.myAddress!, addr, CID_TWEET)
        )
      );
      await executeSequentially(
        this.params.followings.map(
          (addr) => () =>
            this.syncParticlesFrom(this.params.myAddress!, addr, CID_FOLLOW)
        )
      );
    } catch (err) {
      console.error('>>> syncAllTweets', err);
      throw err;
    }
  }

  public async syncParticlesFrom(
    myAddress: NeuronAddress,
    address: NeuronAddress,
    cid: ParticleCid // CID_TWEET, CID_FOLLOW
  ) {
    const syncUpdates = [];
    try {
      if (this.inProgress.includes(address)) {
        console.log(`>> ${address} tweets sync already in progress`);
        return;
      }
      // add to in-progress list
      this.inProgress.push(address);

      this.statusApi.sendStatus('in-progress', `sync ${address}...`);
      const { timestampRead, unreadCount, timestampUpdate } =
        await this.db!.getSyncStatus(myAddress, address, EntryType.chat);

      const links = await fetchLinksByNeuronTimestamp(
        this.params.cyberLcdUrl!,
        address,
        cid,
        timestampUpdate + 1 // ofsset + 1 to fix milliseconds precision bug
      );

      const lastParticle = links.at(0);
      const unreadItemsCount = unreadCount + links.length;

      if (lastParticle) {
        await this.db!.putCyberlinks(links);

        const particles = links.map((t) => t.to);

        await this.particlesResolver!.enqueueBatch(
          particles,
          QueuePriority.HIGH
        );

        const newSyncItem = {
          ownerId: myAddress,
          entryType: EntryType.chat,
          id: address,
          timestampUpdate: lastParticle.timestamp,
          unreadCount: unreadItemsCount,
          timestampRead,
          disabled: false,
          lastId: lastParticle.transaction_hash,
          meta: {
            metaType: SenseMetaType.tweet,
            from: { cid },
            to: { cid: lastParticle.to, text: '', mime: '' },
          } as SenseTweetResultMeta,
        };
        // Update transaction
        const result = await this.db!.putSyncStatus(newSyncItem);

        if (result.ok) {
          syncUpdates.push(newSyncItem);
        }
      }
    } finally {
      this.channelApi.postSenseUpdate(syncUpdates);
      this.inProgress = this.inProgress.filter((addr) => addr !== address);
    }
  }
}

export default SyncTweetsLoop;

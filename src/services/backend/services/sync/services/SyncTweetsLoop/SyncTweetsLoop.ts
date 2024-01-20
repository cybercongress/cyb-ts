/* eslint-disable camelcase */
import { Observable, defer, from, map, combineLatest } from 'rxjs';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { broadcastStatus } from 'src/services/backend/channels/broadcastStatus';
import { EntryType } from 'src/services/CozoDb/types/entities';

import { NeuronAddress } from 'src/types/base';
import { QueuePriority } from 'src/services/QueueManager/types';
import { executeSequentially } from 'src/utils/async/promise';

import DbApi from '../../../dataSource/indexedDb/dbApiWrapper';

import { ServiceDeps } from '../types';

import { createLoopObservable } from '../utils/rxjs';
import { TWEETS_SYNC_INTERVAL, TWEETS_SYNC_WARMUP } from '../consts';
import ParticlesResolverQueue from '../ParticlesResolverQueue/ParticlesResolverQueue';
import { fetchTweetsByNeuronTimestamp } from '../../../dataSource/blockchain/lcd';

class SyncTweetsLoop {
  private isInitialized$: Observable<boolean>;

  private isInitialized = false;

  private db: DbApi | undefined;

  private particlesResolver: ParticlesResolverQueue | undefined;

  private inProgress: NeuronAddress[] = [];

  private _loop$: Observable<any> | undefined;

  public get loop$(): Observable<any> | undefined {
    return this._loop$;
  }

  private statusApi = broadcastStatus('tweets', new BroadcastChannelSender());

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
            (addr) => () => this.syncTweets(this.params.myAddress!, addr)
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
      defer(() => from(this.syncAllTweets())),
      () => this.statusApi.sendStatus('in-progress'),
      TWEETS_SYNC_WARMUP
    );

    this._loop$.subscribe({
      next: (result) => this.statusApi.sendStatus('idle'),
      error: (err) => this.statusApi.sendStatus('error', err.toString()),
    });

    return this;
  }

  private async syncAllTweets() {
    try {
      await executeSequentially(
        this.params.followings.map(
          (addr) => () => this.syncTweets(this.params.myAddress!, addr)
        )
      );
    } catch (err) {
      console.error('>>> syncAllTweets', err);
      throw err;
    }
  }

  public async syncTweets(myAddress: NeuronAddress, address: NeuronAddress) {
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

      const tweets = await fetchTweetsByNeuronTimestamp(
        this.params.cyberLcdUrl!,
        address,
        timestampUpdate + 1 // ofsset + 1 to fix milliseconds precision bug
      );

      const lastTweet = tweets.at(0);
      const unreadItemsCount = unreadCount + tweets.length;

      if (lastTweet) {
        await this.db!.putCyberlinks(tweets);

        const tweetParticles = tweets.map((t) => t.to);

        await this.particlesResolver!.enqueueBatch(
          tweetParticles,
          QueuePriority.HIGH
        );

        // Update transaction
        const res = await this.db!.putSyncStatus({
          ownerId: myAddress,
          entryType: EntryType.chat,
          id: address,
          timestampUpdate: lastTweet.timestamp,
          unreadCount: unreadItemsCount,
          timestampRead,
          disabled: false,
          lastId: lastTweet.transaction_hash,
          meta: {
            lastId: { cid: lastTweet.to },
          },
        });
      }
    } finally {
      // remove from in-progress list
      this.inProgress = this.inProgress.filter((addr) => addr !== address);
    }
  }
}

export default SyncTweetsLoop;

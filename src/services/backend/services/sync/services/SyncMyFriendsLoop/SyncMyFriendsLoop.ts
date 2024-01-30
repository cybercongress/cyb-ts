/* eslint-disable camelcase */
import { Observable, defer, from, map, combineLatest } from 'rxjs';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { broadcastStatus } from 'src/services/backend/channels/broadcastStatus';
import { EntryType } from 'src/services/CozoDb/types/entities';

import { NeuronAddress } from 'src/types/base';
import { QueuePriority } from 'src/services/QueueManager/types';
import { executeSequentially } from 'src/utils/async/promise';
import { CID_FOLLOW, CID_TWEET } from 'src/utils/consts';

import DbApi from '../../../dataSource/indexedDb/dbApiWrapper';

import { ServiceDeps } from '../types';

import { createLoopObservable } from '../utils/rxjs';
import { MY_FRIENDS_SYNC_INTERVAL, MY_FRIENDS_SYNC_WARMUP } from '../consts';
import ParticlesResolverQueue from '../ParticlesResolverQueue/ParticlesResolverQueue';
import { fetchLinksByNeuronTimestamp } from '../../../dataSource/blockchain/lcd';
import { SyncServiceParams } from '../../types';

import { ProgressTracker } from '../ProgressTracker/ProgressTracker';
import { fetchLinksCount } from '../../../dataSource/blockchain/indexer';

class SyncMyFriendsLoop {
  private isInitialized$: Observable<boolean>;

  private isInitialized = false;

  private db: DbApi | undefined;

  private particlesResolver: ParticlesResolverQueue | undefined;

  private inProgress: NeuronAddress[] = [];

  private _loop$: Observable<any> | undefined;

  private channelApi = new BroadcastChannelSender();

  private progressTracker = new ProgressTracker();

  public get loop$(): Observable<any> | undefined {
    return this._loop$;
  }

  private statusApi = broadcastStatus('my-friends', this.channelApi);

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
        console.log('------- subscribe', params.followings);
        const newFriends = params.followings.filter(
          (addr) => !this.params.followings.includes(addr)
        );

        executeSequentially(
          newFriends.map(
            (addr) => () => this.syncLinks(this.params.myAddress!, addr)
          )
        );
      }
    });

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
          !!params.cyberIndexUrl &&
          !!params.myAddress
      )
    );

    this.isInitialized$.subscribe((isInitialized) => {
      this.isInitialized = isInitialized;
    });
  }

  start() {
    this._loop$ = createLoopObservable(
      MY_FRIENDS_SYNC_INTERVAL,
      this.isInitialized$,
      defer(() => from(this.syncAll())),
      () => this.statusApi.sendStatus('in-progress', 'warm up...'),
      MY_FRIENDS_SYNC_WARMUP
    );

    this._loop$.subscribe({
      next: (result) => this.statusApi.sendStatus('idle'),
      error: (err) => this.statusApi.sendStatus('error', err.toString()),
    });

    return this;
  }

  private async syncAll() {
    try {
      const syncItemMap = new Map(
        (
          await this.db?.findSyncStatus({
            ownerId: this.params.myAddress!,
            entryType: EntryType.chat,
          })
        )?.map((i) => [i.id, { ...i, newLinkCount: 0 }])
      );

      this.statusApi.sendStatus('in-progress', `estimating...`);

      await Promise.all(
        this.params.followings.map(async (addr) => {
          const syncItem = syncItemMap.get(addr);
          const newLinkCount = await fetchLinksCount(
            this.params.cyberIndexUrl!,
            addr,
            [CID_FOLLOW, CID_TWEET],
            syncItem?.timestampUpdate || 0
          );

          syncItemMap.set(addr, {
            ...(syncItem || { id: addr }),
            newLinkCount,
          });
        })
      );
      const itemsToSync = [...syncItemMap.values()].filter(
        (i) => i.newLinkCount > 0
      );

      const totalCount = itemsToSync.reduce(
        (acc, item) => acc + item.newLinkCount,
        0
      ); // this.progressTracker.start();

      console.log('--------myfriends itemsToSync', itemsToSync, totalCount);

      this.progressTracker.start(totalCount);

      await executeSequentially(
        itemsToSync.map(
          (i) => () => this.syncLinks(this.params.myAddress!, i.id!)
        )
      );
    } catch (err) {
      console.error('>>> syncAllTweets', err);
      throw err;
    }
  }

  public async syncLinks(myAddress: NeuronAddress, address: NeuronAddress) {
    const syncUpdates = [];
    try {
      if (this.inProgress.includes(address)) {
        console.log(`>>> my-friends ${address} sync already in progress`);
        return;
      }

      // add to in-progress list
      this.inProgress.push(address);

      this.statusApi.sendStatus(
        'in-progress',
        `starting sync ${address}...`,
        this.progressTracker.progress
      );
      const { timestampRead, unreadCount, timestampUpdate } =
        await this.db!.getSyncStatus(myAddress, address, EntryType.chat);

      const timestampFrom = timestampUpdate + 1; // ofsset + 1 to fix milliseconds precision bug

      const linksTweet = await fetchLinksByNeuronTimestamp(
        this.params.cyberLcdUrl!,
        address,
        CID_TWEET,
        timestampFrom
      );

      const linksFollow = await fetchLinksByNeuronTimestamp(
        this.params.cyberLcdUrl!,
        address,
        CID_FOLLOW,
        timestampFrom
      );

      const links = [...linksFollow, ...linksTweet].sort(
        (a, b) => a.timestamp - b.timestamp
      );

      const progress = this.progressTracker.trackProgress(links.length);
      console.log(
        `------- myfriends ${address} progress `,
        progress,
        Math.round(progress.estimatedTime / 1000)
      );

      this.statusApi.sendStatus('in-progress', `sync ${address}...`, progress);

      const lastLink = links.at(0);
      const unreadItemsCount = unreadCount + links.length;

      if (lastLink) {
        await this.db!.putCyberlinks(links);

        const particles = links.map((t) => t.to);

        await this.particlesResolver!.enqueueBatch(
          particles,
          QueuePriority.HIGH
        );
        const { timestamp } = lastLink;
        const newSyncItem = {
          ownerId: myAddress,
          entryType: EntryType.chat,
          id: address,
          timestampUpdate: timestamp,
          unreadCount: unreadItemsCount,
          timestampRead,
          disabled: false,
          meta: lastLink,
        };
        // Update transaction
        const result = await this.db!.putSyncStatus(newSyncItem);

        if (result.ok) {
          syncUpdates.push(newSyncItem);
        }
      }
    } catch (err) {
      this.statusApi.sendStatus('error', err.toString());
    } finally {
      this.channelApi.postSenseUpdate(syncUpdates);
      this.inProgress = this.inProgress.filter((addr) => addr !== address);
    }
  }
}

export default SyncMyFriendsLoop;

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
import {
  fetchCyberlinksByNerounIterable,
  fetchLinksCount,
} from '../../../dataSource/blockchain/indexer';
import { SyncStatusDto } from 'src/services/CozoDb/types/dto';
import { dateToNumber } from 'src/utils/date';
import { mapLinkFromIndexerToDbEntity } from 'src/services/CozoDb/mapping';

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
        // console.log('------- subscribe', params.followings);

        // start immideatelly
        const newFriends = params.followings.filter(
          (addr) => !this.params.followings.includes(addr)
        );

        executeSequentially(
          newFriends.map(
            (addr) => () =>
              this.syncLinks(params.myAddress!, addr, params.cyberLcdUrl!)
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
      () => this.statusApi.sendStatus('in-progress', 'preparing...'),
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
      const { myAddress, cyberIndexUrl, followings } = this.params;
      const syncItemMap = new Map<
        NeuronAddress,
        Partial<SyncStatusDto> & { newLinkCount: number }
      >(
        (
          await this.db?.findSyncStatus({
            ownerId: myAddress!,
            entryType: EntryType.chat,
          })
        )?.map((i) => [i.id, { ...i, newLinkCount: 0 }])
      );

      this.statusApi.sendStatus('estimating', `estimating...`);

      await Promise.all(
        followings.map(async (addr) => {
          const syncItem = syncItemMap.get(addr);
          const newLinkCount = await fetchLinksCount(
            cyberIndexUrl!,
            addr,
            [CID_FOLLOW, CID_TWEET],
            (syncItem?.timestampUpdate || 0) + 1
          );

          syncItemMap.set(addr, {
            ...(syncItem || { id: addr }),
            newLinkCount,
          });
        })
      );
      const friendsToSync = [...syncItemMap.values()].filter(
        (i) => i.newLinkCount > 0
      );

      const totalCount = friendsToSync.reduce(
        (acc, item) => acc + item.newLinkCount,
        0
      ); // this.progressTracker.start();

      this.progressTracker.start(totalCount);
      this.statusApi.sendStatus(
        'in-progress',
        `sync...`,
        this.progressTracker.progress
      );

      await executeSequentially(
        friendsToSync.map(
          (i) => () => this.syncLinks(cyberIndexUrl!, myAddress!, i.id!)
        )
      );
    } catch (err) {
      console.error('>>> syncAllTweets', err);
      throw err;
    }
  }

  public async syncLinks(
    cyberIndexUrl: string,
    myAddress: NeuronAddress,
    address: NeuronAddress
  ) {
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

      // const linksTweet = await fetchLinksByNeuronTimestamp(
      //   cyberLcdUrl,
      //   address,
      //   CID_TWEET,
      //   timestampFrom
      // );

      // const linksFollow = await fetchLinksByNeuronTimestamp(
      //   cyberLcdUrl,
      //   address,
      //   CID_FOLLOW,
      //   timestampFrom
      // );

      // const links = [...linksFollow, ...linksTweet].sort(
      //   (a, b) => a.timestamp - b.timestamp
      // );
      const linksAsyncIterable = await fetchCyberlinksByNerounIterable(
        cyberIndexUrl,
        address,
        [CID_TWEET, CID_FOLLOW],
        timestampFrom
      );

      // eslint-disable-next-line no-restricted-syntax
      for await (const linksBatch of linksAsyncIterable) {
        const links = linksBatch.map(mapLinkFromIndexerToDbEntity);

        const unreadItemsCount = unreadCount + links.length;

        if (links.length > 0) {
          const lastLink = links.at(-1);

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
            timestampUpdate: lastLink!.timestamp,
            unreadCount: unreadItemsCount,
            timestampRead,
            disabled: false,
            meta: { ...lastLink! },
          };
          // Update transaction
          const result = await this.db!.putSyncStatus(newSyncItem);

          if (result.ok) {
            syncUpdates.push(newSyncItem);
          }

          this.statusApi.sendStatus(
            'in-progress',
            `sync ${address}...`,
            this.progressTracker.trackProgress(links.length)
          );
        }
      }
    } catch (err) {
      this.statusApi.sendStatus('error', err.toString());
    } finally {
      console.log('-----syncUpdates with redux', syncUpdates);
      this.channelApi.postSenseUpdate(syncUpdates);
      this.inProgress = this.inProgress.filter((addr) => addr !== address);
    }
  }
}

export default SyncMyFriendsLoop;

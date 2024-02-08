/* eslint-disable camelcase */
import {
  Observable,
  defer,
  from,
  map,
  combineLatest,
  throttleTime,
  auditTime,
} from 'rxjs';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { broadcastStatus } from 'src/services/backend/channels/broadcastStatus';
import { EntryType } from 'src/services/CozoDb/types/entities';

import { NeuronAddress } from 'src/types/base';
import { QueuePriority } from 'src/services/QueueManager/types';
import { executeSequentially } from 'src/utils/async/promise';
import { CID_FOLLOW, CID_TWEET } from 'src/constants/app';
import { SyncStatusDto } from 'src/services/CozoDb/types/dto';
import { mapLinkFromIndexerToDbEntity } from 'src/services/CozoDb/mapping';

import { ServiceDeps } from '../types';

import { createLoopObservable } from '../utils/rxjs';
import { MY_FRIENDS_SYNC_INTERVAL, MY_FRIENDS_SYNC_WARMUP } from '../consts';
import ParticlesResolverQueue from '../ParticlesResolverQueue/ParticlesResolverQueue';

import { SyncServiceParams } from '../../types';

import { ProgressTracker } from '../ProgressTracker/ProgressTracker';
import { fetchCyberlinksByNerounIterable } from '../../../dataSource/blockchain/indexer';
import DbApi from '../../../dataSource/indexedDb/dbApiWrapper';
import { CYBERLINKS_BATCH_LIMIT } from '../../../dataSource/blockchain/consts';

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
    });

    this.isInitialized$ = combineLatest([
      deps.dbInstance$,
      deps.params$,
      particlesResolver.isInitialized$,
    ]).pipe(
      auditTime(MY_FRIENDS_SYNC_WARMUP),
      map(
        ([dbInstance, params, syncQueueInitialized]) =>
          !!dbInstance &&
          !!syncQueueInitialized &&
          !!params.myAddress &&
          !!params.followings &&
          params.followings.length > 0
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
      () => this.statusApi.sendStatus('in-progress', 'preparing...')
      // MY_FRIENDS_SYNC_WARMUP
    );

    this._loop$.subscribe({
      next: (result) => this.statusApi.sendStatus('idle'),
      error: (err) => this.statusApi.sendStatus('error', err.toString()),
    });

    return this;
  }

  private async syncAll() {
    try {
      const { myAddress, followings } = this.params;

      this.statusApi.sendStatus('estimating');
      console.log('------- syncAll', myAddress, followings);

      this.progressTracker.start(followings.length);
      this.statusApi.sendStatus(
        'in-progress',
        `sync...`,
        this.progressTracker.progress
      );

      await executeSequentially(
        followings.map((addr) => () => this.syncLinks(myAddress!, addr))
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

      const linksAsyncIterable = await fetchCyberlinksByNerounIterable(
        address,
        [CID_TWEET, CID_FOLLOW],
        timestampFrom,
        CYBERLINKS_BATCH_LIMIT
      );

      // eslint-disable-next-line no-restricted-syntax
      for await (const linksBatch of linksAsyncIterable) {
        this.statusApi.sendStatus(
          'in-progress',
          `sync ${address}...`,
          this.progressTracker.trackProgress(1)
        );

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

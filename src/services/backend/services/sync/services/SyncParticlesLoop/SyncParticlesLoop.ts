import { Observable, defer, from, map, combineLatest } from 'rxjs';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { broadcastStatus } from 'src/services/backend/channels/broadcastStatus';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { SyncStatusDto } from 'src/services/CozoDb/types/dto';
import { QueuePriority } from 'src/services/QueueManager/types';
import { CyberlinkTxHash, NeuronAddress, ParticleCid } from 'src/types/base';

import { mapLinkFromIndexerToDbEntity } from 'src/services/CozoDb/mapping';
import { CID_TWEET } from 'src/constants/app';
import { dateToNumber } from 'src/utils/date';
import { SenseListItem } from 'src/services/backend/types/sense';

import DbApi from '../../../dataSource/indexedDb/dbApiWrapper';

import { ServiceDeps } from '../types';
import { fetchCyberlinksAndResolveParticles } from '../utils/links';
import { createLoopObservable } from '../utils/rxjs/loop';
import { MY_PARTICLES_SYNC_INTERVAL } from '../consts';
import ParticlesResolverQueue from '../ParticlesResolverQueue/ParticlesResolverQueue';
import { changeSyncStatus } from '../../utils';
import { SyncServiceParams } from '../../types';
import {
  fetchCyberlinksByNerounIterable,
  fetchLinksCount,
} from '../../../dataSource/blockchain/indexer';
import { ProgressTracker } from '../ProgressTracker/ProgressTracker';
import { CYBERLINKS_BATCH_LIMIT } from '../../../dataSource/blockchain/consts';
import { changeMyAddress } from '../utils/loop_XXXX';

class SyncParticlesLoop {
  private db: DbApi | undefined;

  private particlesResolver: ParticlesResolverQueue | undefined;

  private channelApi = new BroadcastChannelSender();

  private params: SyncServiceParams | undefined;

  private statusApi = broadcastStatus('particle', this.channelApi);

  private progressTracker = new ProgressTracker();

  private abortController: AbortController | undefined;

  private _loop$: Observable<any> | undefined;

  private restartLoop: (() => void) | undefined;

  public get loop$(): Observable<any> | undefined {
    return this._loop$;
  }

  constructor(deps: ServiceDeps, particlesResolver: ParticlesResolverQueue) {
    if (!deps.params$) {
      throw new Error('params$ is not defined');
    }

    deps.dbInstance$.subscribe((db) => {
      this.db = db;
    });

    deps.params$.subscribe((params) => {
      // restart on address change
      this.params = changeMyAddress(
        this.params,
        params,
        this.restart.bind(this)
      );
    });

    this.particlesResolver = particlesResolver;

    const isInitialized$ = combineLatest([
      deps.dbInstance$,
      deps.ipfsInstance$,
      deps.params$,
      particlesResolver.isInitialized$,
    ]).pipe(
      map(
        ([dbInstance, ipfsInstance, params, particleResolverInitialized]) =>
          !!ipfsInstance &&
          !!dbInstance &&
          !!particleResolverInitialized &&
          !!params.myAddress
      )
    );

    const { loop$, restart } = createLoopObservable(
      MY_PARTICLES_SYNC_INTERVAL,
      isInitialized$,
      defer(() => from(this.syncMain())),
      {
        onStartInterval: () => {
          console.log('-----START PARTICLE LOOP');
        },
        onError: (error) => {
          this.statusApi.sendStatus('error', error.toString());
        },
      }
    );

    this._loop$ = loop$;
    this.restartLoop = restart;
  }

  private restart() {
    this.abortController?.abort();
    this.restartLoop?.();
  }

  private async fetchNewTweets(
    myAddress: NeuronAddress,
    timestampUpdate: number
  ) {
    const tweetsAsyncIterable = await fetchCyberlinksByNerounIterable(
      myAddress,
      [CID_TWEET],
      timestampUpdate,
      CYBERLINKS_BATCH_LIMIT,
      this.abortController?.signal
    );

    const newTweets: SyncStatusDto[] = [];
    // eslint-disable-next-line no-await-in-loop, no-restricted-syntax
    for await (const tweetsBatch of tweetsAsyncIterable) {
      console.log(`-----sync fetchNewTweets ${timestampUpdate}`, tweetsBatch);
      this.statusApi.sendStatus(
        'in-progress',
        `fetching new tweets...`,
        this.progressTracker.trackProgress(1)
      );
      const syncStatusEntities = tweetsBatch.map((item) => {
        const { timestamp, to } = item;
        const timestampUpdate = dateToNumber(timestamp);

        // Initial state
        return {
          ownerId: myAddress,
          id: to,
          entryType: EntryType.particle,
          timestampUpdate,
          timestampRead: timestampUpdate,
          unreadCount: 0,
          disabled: false,
          meta: { ...item, timestamp: timestampUpdate },
        } as SyncStatusDto;
      });

      if (syncStatusEntities.length > 0) {
        const result = await this.db!.putSyncStatus(syncStatusEntities);
        newTweets.push(...syncStatusEntities);

        if (!result.ok) {
          console.log('NOT OK fetchMyTweets', result);
          //   this.channelApi.postSenseUpdate(syncStatusEntities);
        }
      }
    }

    return newTweets;
  }

  private async syncParticles(
    myAddress: NeuronAddress,
    syncItems: SyncStatusDto[]
  ) {
    const updatedSyncItems: SyncStatusDto[] = [];

    try {
      // eslint-disable-next-line no-restricted-syntax
      for (const syncItem of syncItems) {
        const { id, timestampUpdate } = syncItem;

        this.statusApi.sendStatus(
          'in-progress',
          `fetching tweet updates...`,
          this.progressTracker.trackProgress(1)
        );

        // eslint-disable-next-line no-await-in-loop
        const links = await fetchCyberlinksAndResolveParticles(
          id,
          timestampUpdate,
          this.particlesResolver!,
          QueuePriority.MEDIUM,
          this.abortController?.signal
        );

        if (links.length > 0) {
          // save links
          // eslint-disable-next-line no-await-in-loop
          const result = await this.db!.putCyberlinks(
            links.map(mapLinkFromIndexerToDbEntity)
          );

          const newItem = changeSyncStatus(syncItem, links, myAddress);

          updatedSyncItems.push(newItem);
        }
      }

      if (updatedSyncItems.length > 0) {
        const result = await this.db!.putSyncStatus(updatedSyncItems);
        if (!result.ok) {
          console.log('>>> syncParticles batch ERR:', result);
        }
      }
    } catch (e) {
      const isAborted = e instanceof DOMException && e.name === 'AbortError';

      console.log('>>> SyncParticlesLoop error:', e, isAborted);
      if (!isAborted) {
        throw e;
      }
    } finally {
      this.channelApi.postSenseUpdate(updatedSyncItems as SenseListItem[]);
    }
  }

  private async syncMain() {
    // setup abort controller
    this.abortController = new AbortController();

    const { myAddress } = this.params!;

    this.statusApi.sendStatus('estimating');

    const syncItemParticles = await this.db!.findSyncStatus({
      ownerId: myAddress!,
      entryType: EntryType.particle,
    });

    const timestampUpdate = syncItemParticles.at(0)?.timestampUpdate || 0;

    // Get count of new links after last update
    const newLinkCount = await fetchLinksCount(
      myAddress!,
      [CID_TWEET],
      timestampUpdate
    );

    this.progressTracker.start(newLinkCount + syncItemParticles.length);
    this.statusApi.sendStatus(
      'in-progress',
      'preparing...',
      this.progressTracker.progress
    );

    if (newLinkCount > 0) {
      // fetch and save new particles
      const newSyncItemParticles = await this.fetchNewTweets(
        myAddress!,
        timestampUpdate
      );

      // add to fetch-sync linked particles
      syncItemParticles.push(...newSyncItemParticles);
    }
    // console.log(`-----sync syncParticles before`, syncItemParticles);

    await this.syncParticles(myAddress!, syncItemParticles);
  }

  start() {
    this._loop$.subscribe((result) => this.statusApi.sendStatus('idle'));

    return this;
  }
}

export default SyncParticlesLoop;

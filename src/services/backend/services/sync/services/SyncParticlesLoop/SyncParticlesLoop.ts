import { map, combineLatest, distinctUntilChanged } from 'rxjs';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { SyncStatusDto } from 'src/services/CozoDb/types/dto';
import { QueuePriority } from 'src/services/QueueManager/types';
import { NeuronAddress } from 'src/types/base';

import { mapLinkFromIndexerToDto } from 'src/services/CozoDb/mapping';
import { CID_TWEET } from 'src/constants/app';
import { dateToUtcNumber } from 'src/utils/date';
import { SenseListItem } from 'src/services/backend/types/sense';
import { asyncIterableBatchProcessor } from 'src/utils/async/iterable';
import { throwIfAborted } from 'src/utils/async/promise';
import { entityToDto } from 'src/utils/dto';

import { ServiceDeps } from '../types';
import { fetchCyberlinksAndResolveParticles } from '../utils/links';

import { changeParticleSyncStatus } from '../../utils';
import {
  fetchCyberlinksByNerounIterable,
  fetchCyberlinksCount,
} from '../../../dataSource/blockchain/indexer';
import { CYBERLINKS_BATCH_LIMIT } from '../../../dataSource/blockchain/consts';
import BaseSyncLoop from '../BaseSyncLoop/BaseSyncLoop';
import { MAX_DATABASE_PUT_SIZE } from '../consts';
import { SyncServiceParams } from '../../types';

class SyncParticlesLoop extends BaseSyncLoop {
  protected createIsInitializedObserver(deps: ServiceDeps) {
    const isInitialized$ = combineLatest([
      deps.dbInstance$,
      deps.ipfsInstance$,
      deps.params$!.pipe(
        map((params) => params.myAddress),
        distinctUntilChanged()
      ),
      this.particlesResolver!.isInitialized$,
    ]).pipe(
      map(
        ([dbInstance, ipfsInstance, myAddress, particleResolverInitialized]) =>
          !!ipfsInstance &&
          !!dbInstance &&
          !!particleResolverInitialized &&
          !!myAddress
      )
    );

    return isInitialized$;
  }

  protected async sync(params: SyncServiceParams): Promise<void> {
    const { myAddress } = params;
    const { signal } = this.abortController;
    this.statusApi.sendStatus('estimating');

    const syncItemParticles = await this.db!.findSyncStatus({
      ownerId: myAddress!,
      entryType: EntryType.particle,
    });

    const timestampUpdate = syncItemParticles.at(0)?.timestampUpdate || 0;

    // Get count of new links after last update
    const newLinkCount = await fetchCyberlinksCount(
      myAddress!,
      [CID_TWEET],
      timestampUpdate,
      signal
    );

    this.cyblogCh.info(
      `>>> syncMyParticles ${myAddress} count ${newLinkCount}`
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
        timestampUpdate,
        signal
      );

      // add to fetch-sync linked particles
      syncItemParticles.push(...newSyncItemParticles);
    }
    await this.syncParticles(myAddress!, syncItemParticles, signal);
  }

  private async fetchNewTweets(
    myAddress: NeuronAddress,
    timestampUpdate: number,
    signal: AbortSignal
  ) {
    const tweetsAsyncIterable = await fetchCyberlinksByNerounIterable(
      myAddress,
      [CID_TWEET],
      timestampUpdate,
      CYBERLINKS_BATCH_LIMIT,
      this.abortController?.signal
    );

    const newTweets: SyncStatusDto[] = [];
    const existingParticles = await this.db!.findSyncStatus({
      ownerId: myAddress,
      entryType: EntryType.particle,
    });
    const existingParticlesMap = new Map(
      existingParticles.map((i) => [i.id, i])
    );
    // eslint-disable-next-line no-await-in-loop, no-restricted-syntax
    for await (const tweetsBatch of tweetsAsyncIterable) {
      this.statusApi.sendStatus(
        'in-progress',
        `fetching new tweets...`,
        this.progressTracker.trackProgress(1)
      );
      const syncStatusEntities = tweetsBatch.map(entityToDto).map((item) => {
        const { timestamp, to } = item;
        const timestampUpdate = dateToUtcNumber(timestamp);

        // In case my tweet already linked from other neuron, resync from beginning
        const timestampSyncFrom = existingParticlesMap.get(to)
          ? dateToUtcNumber(timestamp)
          : 0;

        // Initial state
        return {
          ownerId: myAddress,
          id: to,
          entryType: EntryType.particle,
          timestampUpdate: timestampSyncFrom,
          timestampRead: timestampUpdate,
          unreadCount: 0,
          disabled: false,
          meta: { ...item, timestamp: timestampUpdate },
        } as SyncStatusDto;
      });

      if (syncStatusEntities.length > 0) {
        await throwIfAborted(
          this.db!.putSyncStatus,
          signal
        )(syncStatusEntities);
        newTweets.push(...syncStatusEntities);
      }
    }

    return newTweets;
  }

  private async syncParticles(
    myAddress: NeuronAddress,
    syncItems: SyncStatusDto[],
    signal: AbortSignal
  ) {
    const updatedSyncItems: SyncStatusDto[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const syncItem of syncItems) {
      const { id, timestampUpdate } = syncItem;

      this.statusApi.sendStatus(
        'in-progress',
        `fetching tweet updates...`,
        this.progressTracker.trackProgress(1)
      );
      // eslint-disable-next-line no-await-in-loop
      const linksIndexer = await fetchCyberlinksAndResolveParticles(
        id,
        timestampUpdate,
        this.particlesResolver!,
        QueuePriority.MEDIUM,
        this.abortController?.signal
      );

      if (linksIndexer.length > 0) {
        const links = linksIndexer.map(mapLinkFromIndexerToDto);

        // save links
        // eslint-disable-next-line no-await-in-loop
        await asyncIterableBatchProcessor(
          links,
          (links) => throwIfAborted(this.db!.putCyberlinks, signal)(links),
          MAX_DATABASE_PUT_SIZE
        );

        const newItem = changeParticleSyncStatus(syncItem, links, myAddress);

        updatedSyncItems.push(newItem);
      }
    }

    if (updatedSyncItems.length > 0) {
      await throwIfAborted(this.db!.putSyncStatus, signal)(updatedSyncItems);
    }
    this.channelApi.postSenseUpdate(updatedSyncItems as SenseListItem[]);
  }
}

export default SyncParticlesLoop;

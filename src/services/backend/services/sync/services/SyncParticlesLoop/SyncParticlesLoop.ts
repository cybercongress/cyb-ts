import { map, combineLatest } from 'rxjs';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { SyncStatusDto } from 'src/services/CozoDb/types/dto';
import { QueuePriority } from 'src/services/QueueManager/types';
import { NeuronAddress } from 'src/types/base';

import { mapLinkFromIndexerToDbEntity } from 'src/services/CozoDb/mapping';
import { CID_TWEET } from 'src/constants/app';
import { dateToNumber } from 'src/utils/date';
import { SenseListItem } from 'src/services/backend/types/sense';

import { ServiceDeps } from '../types';
import { fetchCyberlinksAndResolveParticles } from '../utils/links';

import { changeSyncStatus } from '../../utils';
import {
  fetchCyberlinksByNerounIterable,
  fetchCyberlinksCount,
} from '../../../dataSource/blockchain/indexer';
import { CYBERLINKS_BATCH_LIMIT } from '../../../dataSource/blockchain/consts';
import BaseSyncLoop from '../BaseSyncLoop/BaseSyncLoop';

class SyncParticlesLoop extends BaseSyncLoop {
  protected getIsInitializedObserver(deps: ServiceDeps) {
    const isInitialized$ = combineLatest([
      deps.dbInstance$,
      deps.ipfsInstance$,
      deps.params$!,
      this.particlesResolver!.isInitialized$,
    ]).pipe(
      map(
        ([dbInstance, ipfsInstance, params, particleResolverInitialized]) =>
          !!ipfsInstance &&
          !!dbInstance &&
          !!particleResolverInitialized &&
          !!params?.myAddress
      )
    );

    return isInitialized$;
  }

  protected async sync(): Promise<void> {
    const { myAddress } = this.params!;

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
      this.abortController?.signal
    );

    console.log(`>>> syncMyParticles ${myAddress} count ${newLinkCount}`);

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
      // console.log(`-----sync fetchNewTweets ${timestampUpdate}`, tweetsBatch);
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

    this.channelApi.postSenseUpdate(updatedSyncItems as SenseListItem[]);
  }
}

export default SyncParticlesLoop;

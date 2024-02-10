/* eslint-disable camelcase */
import { map, combineLatest } from 'rxjs';
import { EntryType } from 'src/services/CozoDb/types/entities';

import { NeuronAddress } from 'src/types/base';
import { QueuePriority } from 'src/services/QueueManager/types';
import { executeSequentially } from 'src/utils/async/promise';
import { CID_FOLLOW, CID_TWEET } from 'src/constants/app';
import { mapLinkFromIndexerToDbEntity } from 'src/services/CozoDb/mapping';

import { ServiceDeps } from '../types';

import { fetchCyberlinksByNerounIterable } from '../../../dataSource/blockchain/indexer';
import { CYBERLINKS_BATCH_LIMIT } from '../../../dataSource/blockchain/consts';
import BaseSyncLoop from '../BaseSyncLoop/BaseSyncLoop';

class SyncMyFriendsLoop extends BaseSyncLoop {
  private inProgress: NeuronAddress[] = [];

  protected getIsInitializedObserver(deps: ServiceDeps) {
    const isInitialized$ = combineLatest([
      deps.dbInstance$,
      deps.params$!,
      this.particlesResolver!.isInitialized$,
    ]).pipe(
      // auditTime(MY_FRIENDS_SYNC_WARMUP),
      map(
        ([dbInstance, params, syncQueueInitialized]) =>
          !!dbInstance &&
          !!syncQueueInitialized &&
          !!params.myAddress &&
          !!params.followings &&
          params.followings.length > 0
      )
    );

    return isInitialized$;
  }

  protected async sync() {
    try {
      this.statusApi.sendStatus('in-progress', 'preparing...');
      const { myAddress, followings } = this.params;

      this.statusApi.sendStatus('estimating');
      console.log(`>>> syncMyFriends ${myAddress} count ${followings.length}`);

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
      const { timestampRead, unreadCount, meta } = await this.db!.getSyncStatus(
        myAddress,
        address,
        EntryType.chat
      );

      const { timestampUpdateChat = 0, timestampUpdateContent = 0 } =
        meta || {};

      const timestampFrom = timestampUpdateContent + 1; // ofsset + 1 to fix milliseconds precision bug

      const linksAsyncIterable = await fetchCyberlinksByNerounIterable(
        address,
        [CID_TWEET, CID_FOLLOW],
        timestampFrom,
        CYBERLINKS_BATCH_LIMIT,
        this.abortController?.signal
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
            timestampUpdate: Math.max(lastLink!.timestamp, timestampUpdateChat),
            unreadCount: unreadItemsCount,
            timestampRead,
            disabled: false,
            meta: {
              ...lastLink!,
              timestampUpdateContent: lastLink!.timestamp,
              timestampUpdateChat,
            },
          };
          // Update transaction
          const result = await this.db!.putSyncStatus(newSyncItem);

          if (result.ok) {
            syncUpdates.push(newSyncItem);
          }
        }
      }
    } catch (err) {
      console.log('>>> SyncMyFriends error', address, err);
      this.statusApi.sendStatus('error', err.toString());
    } finally {
      // console.log('-----syncUpdates with redux', syncUpdates);
      this.channelApi.postSenseUpdate(syncUpdates);
      this.inProgress = this.inProgress.filter((addr) => addr !== address);
    }
  }
}

export default SyncMyFriendsLoop;

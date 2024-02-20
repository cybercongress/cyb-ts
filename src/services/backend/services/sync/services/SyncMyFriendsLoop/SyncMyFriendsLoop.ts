/* eslint-disable camelcase */
import {
  map,
  combineLatest,
  Observable,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import { equals } from 'ramda';

import { EntryType } from 'src/services/CozoDb/types/entities';

import { NeuronAddress } from 'src/types/base';
import { QueuePriority } from 'src/services/QueueManager/types';
import { isAbortException } from 'src/utils/exceptions/helpers';

import { CID_FOLLOW, CID_TWEET } from 'src/constants/app';
import { mapLinkFromIndexerToDbEntity } from 'src/services/CozoDb/mapping';

import { ServiceDeps } from '../types';

import { fetchCyberlinksByNerounIterable } from '../../../dataSource/blockchain/indexer';
import { CYBERLINKS_BATCH_LIMIT } from '../../../dataSource/blockchain/consts';
import BaseSyncLoop from '../BaseSyncLoop/BaseSyncLoop';
import { SyncServiceParams } from '../../types';

class SyncMyFriendsLoop extends BaseSyncLoop {
  private inProgress: NeuronAddress[] = [];

  protected createIsInitializedObserver(deps: ServiceDeps) {
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
    this.statusApi.sendStatus('in-progress', 'preparing...');
    const { myAddress, followings } = this.params;
    console.log(`>>> sync my friends!!!!`, myAddress, followings);

    this.statusApi.sendStatus('estimating');
    console.log(`>>> syncMyFriends ${myAddress} count ${followings.length}`);

    this.progressTracker.start(followings.length);
    this.statusApi.sendStatus(
      'in-progress',
      `sync...`,
      this.progressTracker.progress
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const addr of followings) {
      // eslint-disable-next-line no-await-in-loop
      await this.syncLinks(myAddress!, addr);
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

          syncUpdates.push(newSyncItem);
        }
      }
    } catch (err) {
      console.log('>>> SyncMyFriends error', address, err);
      if (!isAbortException(err)) {
        this.statusApi.sendStatus('error', err.toString());
      } else {
        throw err;
      }
    } finally {
      // console.log('-----syncUpdates with redux', syncUpdates);
      this.channelApi.postSenseUpdate(syncUpdates);
      this.inProgress = this.inProgress.filter((addr) => addr !== address);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  protected createRestartObserver(
    params$: Observable<SyncServiceParams>
  ): Observable<boolean> {
    return super.createRestartObserver(params$).pipe(
      switchMap((addressChanged) => {
        return params$.pipe(
          map((params) => params.followings),
          distinctUntilChanged((a, b) => a.length === 0 || equals(a, b)),
          // take(1),
          map(() => true)
        );
      })
    );
  }
}

export default SyncMyFriendsLoop;

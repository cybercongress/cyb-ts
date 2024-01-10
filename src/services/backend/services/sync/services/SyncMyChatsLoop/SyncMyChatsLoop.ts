/* eslint-disable camelcase */
import { Observable, defer, from, map, combineLatest } from 'rxjs';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { broadcastStatus } from 'src/services/backend/channels/broadcastStatus';
import { EntryType } from 'src/services/CozoDb/types/entities';

import DbApi from '../../../dataSource/indexedDb/dbApiWrapper';

import { ServiceDeps } from '../../types';
import { extractSenseChats } from '../utils/sense';
import { createLoopObservable } from '../utils/rxjs';
import { MY_CHATS_SYNC_INTERVAL } from '../consts';
import { SyncServiceParams } from '../../types';

class SyncMyChatsLoop {
  private isInitialized$: Observable<boolean>;

  private db: DbApi | undefined;

  private _loop$: Observable<any> | undefined;

  public get loop$(): Observable<any> {
    return this._loop$;
  }

  private statusApi = broadcastStatus('my-chats', new BroadcastChannelSender());

  private params: SyncServiceParams = {
    myAddress: null,
    followings: [],
  };

  constructor(deps: ServiceDeps) {
    if (!deps.params$) {
      throw new Error('params$ is not defined');
    }

    deps.dbInstance$.subscribe((db) => {
      this.db = db;
    });

    deps.params$.subscribe((params) => {
      this.params = params;
    });

    this.isInitialized$ = combineLatest([deps.dbInstance$, deps.params$]).pipe(
      map(([dbInstance, params]) => !!dbInstance && !!params.myAddress)
    );
  }

  start() {
    this._loop$ = createLoopObservable(
      MY_CHATS_SYNC_INTERVAL,
      this.isInitialized$,
      defer(() => from(this.syncMyChats())),
      () => this.statusApi.sendStatus('in-progress')
    );

    this._loop$.subscribe({
      next: (result) => this.statusApi.sendStatus('idle'),
      error: (err) => this.statusApi.sendStatus('error', err.toString()),
    });

    return this;
  }

  private async syncMyChats() {
    try {
      const syncItems = await this.db?.findSyncStatus({
        entryType: EntryType.chat,
      });

      const syncItemsMap = new Map(syncItems?.map((i) => [i.id, i]));

      const myTransactions = await this.db?.getTransactions(
        this.params.myAddress!,
        'asc'
      );

      const myChats = extractSenseChats(this.params.myAddress!, myTransactions);
      myChats.forEach((chat) => {
        const syncItem = syncItemsMap.get(chat.userAddress);

        const { hash, timestamp } = chat.transactions.at(-1)!;

        const lastChatTimestamp = timestamp;
        if (!syncItem) {
          this.db!.putSyncStatus({
            entryType: EntryType.chat,
            id: chat.userAddress,
            timestampUpdate: lastChatTimestamp,
            unreadCount: chat.transactions.length,
            timestampRead: 0,
            disabled: false,
            lastId: hash,
            meta: chat.last,
          });
        } else {
          const { id, timestampRead, timestampUpdate } = syncItem;
          const unreadCount = chat.transactions.filter(
            (t) => t.timestamp > timestampRead!
          ).length;
          if (timestampUpdate! < lastChatTimestamp) {
            this.db!.updateSyncStatus({
              id,
              timestampUpdate: lastChatTimestamp,
              unreadCount,
              meta: chat.last,
            });
          }
        }
      });
    } catch (err) {
      console.error('>>> SyncMyChats', err);
      throw err;
    }
  }
}

export default SyncMyChatsLoop;

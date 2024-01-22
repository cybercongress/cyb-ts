import { EntryType } from 'src/services/CozoDb/types/entities';
import DbApiWrapper from 'src/services/backend/services/dataSource/indexedDb/dbApiWrapper';
import { NeuronAddress } from 'src/types/base';
import { extractSenseChats } from '../../utils/sense';
import {
  SenseListItem,
  SenseMessageResultMeta,
  SenseMetaType,
} from 'src/services/backend/types/sense';

// eslint-disable-next-line import/prefer-default-export
export const syncMyChats = async (
  db: DbApiWrapper,
  myAddress: NeuronAddress
) => {
  const syncItems = await db.findSyncStatus({
    ownerId: myAddress,
    entryType: [EntryType.chat, EntryType.transactions],
  });

  const syncItemsMap = new Map(syncItems?.map((i) => [i.id, i]));

  const myTransactions = await db.getTransactions(myAddress, 'asc');

  const myChats = extractSenseChats(myAddress, myTransactions!);
  const results: SenseListItem[] = [];
  myChats.forEach(async (chat) => {
    const syncItem = syncItemsMap.get(chat.userAddress);

    const { hash, timestamp } = chat.transactions.at(-1)!;

    const lastChatTimestamp = timestamp;

    if (!syncItem) {
      const newItem = {
        ownerId: myAddress,
        entryType: EntryType.chat,
        id: chat.userAddress,
        timestampUpdate: lastChatTimestamp,
        unreadCount: chat.transactions.length,
        timestampRead: 0,
        disabled: false,
        lastId: hash,
        meta: chat.last,
      };
      const result = await db.putSyncStatus(newItem);
      if (result.ok) {
        results.push(newItem);
      }
    } else {
      const { id, timestampRead, timestampUpdate } = syncItem;

      const unreadCount = chat.transactions.filter(
        (t) => t.timestamp > timestampRead!
      ).length;
      if (timestampUpdate! < lastChatTimestamp) {
        const syncStatusChanges = {
          entryType: syncItem.entryType,
          ownerId: myAddress,
          id: id!,
          timestampUpdate: lastChatTimestamp,
          unreadCount,
          meta: {
            ...chat.last,
          } as SenseMessageResultMeta,
        };
        const result = await db.updateSyncStatus(syncStatusChanges);
        if (result.ok) {
          results.push({ ...syncItem, ...syncStatusChanges } as SenseListItem);
        }
      }
    }
  });

  return results;
};

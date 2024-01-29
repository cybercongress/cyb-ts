import { EntryType } from 'src/services/CozoDb/types/entities';
import DbApiWrapper from 'src/services/backend/services/dataSource/indexedDb/dbApiWrapper';
import { NeuronAddress } from 'src/types/base';
import { SenseListItem } from 'src/services/backend/types/sense';

import { extractSenseChats } from '../../utils/sense';

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
    const lastTransaction = chat.transactions.at(-1)!;
    const { timestamp: lastChatTimestamp, hash } = lastTransaction;

    const syncItemHeader = {
      entryType: EntryType.chat,
      ownerId: myAddress,
      meta: { transaction_hash: hash },
      timestampUpdate: lastChatTimestamp,
    };

    if (!syncItem) {
      const newItem = {
        ...syncItemHeader,
        id: chat.userAddress,
        unreadCount: chat.transactions.length,
        timestampRead: 0,
        disabled: false,
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
          ...syncItemHeader,
          id: id!,
          unreadCount,
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

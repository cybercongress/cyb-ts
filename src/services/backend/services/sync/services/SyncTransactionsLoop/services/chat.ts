import { EntryType } from 'src/services/CozoDb/types/entities';
import DbApiWrapper from 'src/services/backend/services/dataSource/indexedDb/dbApiWrapper';
import { NeuronAddress } from 'src/types/base';
import { extractSenseChats } from '../../utils/sense';

export const syncMyChats = async (
  db: DbApiWrapper,
  myAddress: NeuronAddress
) => {
  const syncItems = await db.findSyncStatus({
    ownerId: myAddress,
    entryType: EntryType.chat,
  });

  const syncItemsMap = new Map(syncItems?.map((i) => [i.id, i]));

  const myTransactions = await db.getTransactions(myAddress, 'asc');

  const myChats = extractSenseChats(myAddress, myTransactions!);

  myChats.forEach((chat) => {
    const syncItem = syncItemsMap.get(chat.userAddress);

    const { hash, timestamp } = chat.transactions.at(-1)!;

    const lastChatTimestamp = timestamp;

    if (!syncItem) {
      db.putSyncStatus({
        ownerId: myAddress,
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
        db.updateSyncStatus({
          ownerId: myAddress,
          id,
          timestampUpdate: lastChatTimestamp,
          unreadCount,
          meta: chat.last,
        });
      }
    }
  });
};

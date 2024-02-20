import { EntryType } from 'src/services/CozoDb/types/entities';
import DbApiWrapper from 'src/services/backend/services/dataSource/indexedDb/dbApiWrapper';
import { NeuronAddress } from 'src/types/base';
import { SenseListItem } from 'src/services/backend/types/sense';

import { extractSenseChats } from '../../utils/sense';

// eslint-disable-next-line import/prefer-default-export
export const syncMyChats = async (
  db: DbApiWrapper,
  myAddress: NeuronAddress,
  timestampFrom?: number
) => {
  const syncItems = await db.findSyncStatus({
    ownerId: myAddress,
    entryType: EntryType.transactions,
  });

  const syncItemsMap = new Map(syncItems?.map((i) => [i.id, i]));

  const myTransactions = await db.getTransactions(myAddress, {
    order: 'asc',
    timestampFrom,
  });

  const myChats = extractSenseChats(myAddress, myTransactions!);

  const results: SenseListItem[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const chat of myChats.values()) {
    const syncItem = syncItemsMap.get(chat.userAddress);
    const lastTransaction = chat.transactions.at(-1)!;

    const { timestamp: transactionTimestamp, hash, index } = lastTransaction;

    const syncItemHeader = {
      entryType: EntryType.chat,
      ownerId: myAddress,
      timestampUpdate: transactionTimestamp,
      meta: {
        transaction_hash: hash,
        index,
      },
    };

    if (!syncItem) {
      const newItem = {
        ...syncItemHeader,
        id: chat.userAddress,
        unreadCount: chat.transactions.length,
        timestampRead: 0,
        disabled: false,
      };

      // eslint-disable-next-line no-await-in-loop
      await db.putSyncStatus(newItem);

      results.push({ ...newItem, meta: lastTransaction });
    } else {
      const { id, timestampRead, timestampUpdate, meta } = syncItem;
      const { timestampUpdateContent = 0 } = meta || {};
      const unreadCount = chat.transactions.filter(
        (t) => t.timestamp > timestampRead!
      ).length;

      if (timestampUpdate < transactionTimestamp) {
        const syncStatusChanges = {
          ...syncItemHeader,
          id: id!,
          unreadCount,
          timestampUpdate: Math.max(timestampUpdateContent, timestampUpdate),

          meta: {
            ...syncItemHeader.meta,
            timestampUpdateChat: transactionTimestamp,
            timestampUpdateContent,
          },
        };

        // eslint-disable-next-line no-await-in-loop
        await db.updateSyncStatus(syncStatusChanges);

        results.push({
          ...syncItem,
          ...syncStatusChanges,
          meta: lastTransaction,
        } as SenseListItem);
      }
    }
  }
  return results;
};

import { EntryType } from 'src/services/CozoDb/types/entities';
import DbApiWrapper from 'src/services/backend/services/dataSource/indexedDb/dbApiWrapper';
import { NeuronAddress } from 'src/types/base';
import {
  SenseListItem,
  SenseTransactionMeta,
} from 'src/services/backend/types/sense';
import { throwIfAborted } from 'src/utils/async/promise';
import { extractSenseChats } from '../../utils/sense';

// eslint-disable-next-line import/prefer-default-export
export const syncMyChats = async (
  db: DbApiWrapper,
  myAddress: NeuronAddress,
  timestampFrom: number,
  signal: AbortSignal,
  shouldUpdateTimestamp = true
) => {
  const syncItems = await db.findSyncStatus({
    ownerId: myAddress,
    entryType: EntryType.chat,
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
    // const lastUpdateTimestamp = Math.max(transactionTimestamp, syncItem?.timestampUpdate);
    const syncItemHeader = {
      entryType: EntryType.chat,
      ownerId: myAddress,
      meta: {
        transactionHash: hash,
        index,
      } as SenseTransactionMeta,
    };
    // if (
    //   chat.userAddress === 'bostrom13hepw93y8mjcew7mfra5z7ju7k6585348dnux4' ||
    //   chat.userAddress === 'bostrom1a4krl6m7jg7ckczk94hh0wdlcezvpgwcwkrpcg'
    // ) {
    //   debugger;
    // }
    // if no sync item(first message/initial)
    if (!syncItem) {
      const unreadCount = chat.transactions.filter(
        (t) => t.timestamp > chat.lastSendTimestamp
      ).length; // uread count on top of my last send message

      const newItem = {
        ...syncItemHeader,
        id: chat.userAddress,
        unreadCount,
        // if 'fast' then no shift update poiter till 'slow' reupdate
        timestampUpdate: shouldUpdateTimestamp ? transactionTimestamp : 0,
        timestampRead: chat.lastSendTimestamp,
        disabled: false,
      };

      // eslint-disable-next-line no-await-in-loop
      await throwIfAborted(db.putSyncStatus, signal)(newItem);

      results.push({ ...newItem, meta: lastTransaction });
    } else {
      const {
        id,
        timestampRead,
        timestampUpdate,
        meta,
        unreadCount: prevUnreadCount,
      } = syncItem;

      const lastTimestampRead = Math.max(
        timestampRead!,
        chat.lastSendTimestamp
      );
      const { timestampUpdateContent = 0, timestampUpdateChat = 0 } = meta;
      const timestampUnreadFrom = Math.max(
        chat.lastSendTimestamp,
        timestampUpdateChat
      );
      const unreadCount =
        prevUnreadCount +
        chat.transactions.filter((t) => t.timestamp > timestampUnreadFrom) // + new messages count
          .length;

      if (timestampUpdate < transactionTimestamp) {
        const syncStatusChanges = {
          ...syncItemHeader,
          id: id!,
          unreadCount,
          timestampRead: lastTimestampRead,
          timestampUpdate: Math.max(
            timestampUpdateContent,
            timestampUpdate,
            timestampUpdateChat
          ),

          meta: {
            ...syncItemHeader.meta,
            // if message source is 'fast' then no update till 'slow' reupdate
            timestampUpdateChat: shouldUpdateTimestamp
              ? transactionTimestamp
              : timestampUpdateChat,
            timestampUpdateContent,
          },
        };

        // eslint-disable-next-line no-await-in-loop
        await throwIfAborted(db.updateSyncStatus, signal)(syncStatusChanges);

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

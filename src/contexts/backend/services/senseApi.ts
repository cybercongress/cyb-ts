import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { CID_TWEET } from 'src/constants/app';
import { SyncStatusDto, TransactionDto } from 'src/services/CozoDb/types/dto';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { transformToDbEntity } from 'src/services/CozoDb/utils';
import DbApiWrapper from 'src/services/backend/services/dataSource/indexedDb/dbApiWrapper';
import {
  MSG_SEND_TRANSACTION_TYPE,
  MsgSendValue,
} from 'src/services/backend/services/indexer/types';
import { SenseTransactionResultMeta } from 'src/services/backend/types/sense';
import { NeuronAddress, ParticleCid, TransactionHash } from 'src/types/base';

type LocalSenseChatMessage = {
  transactionHash: TransactionHash;
  fromAddress: NeuronAddress;
  toAddress: NeuronAddress;
  amount: Coin[];
  memo: string;
};

const prepareSenseChatEntities = (
  {
    transactionHash,
    fromAddress,
    toAddress,
    amount,
    memo,
  }: LocalSenseChatMessage,
  syncItem?: SyncStatusDto
) => {
  const index = 0;
  const timestamp = new Date().getTime();
  const success = true;

  const value = transformToDbEntity({
    fromAddress,
    toAddress,
    amount,
  }) as MsgSendValue;

  const meta = transformToDbEntity({
    transactionHash,
    index,
    timestamp,
    success,
    value,
    memo,
    localFlag: true,
  }) as SenseTransactionResultMeta;

  const transaction = {
    hash: transactionHash,
    type: MSG_SEND_TRANSACTION_TYPE,
    index,
    timestamp,
    success: true,
    value,
    memo,
    neuron: fromAddress,
    localFlag: true, // mark as local
  } as TransactionDto;

  const newSyncItem = syncItem
    ? { ...syncItem, meta: { ...syncItem.meta, ...meta } }
    : {
        id: toAddress,
        entryType: EntryType.chat,
        ownerId: fromAddress,
        timestampRead: 0,
        timestampUpdate: 0,
        disabled: false,
        unreadCount: 0,
        meta,
      };

  return { transaction, syncItem: newSyncItem };
};

export const createSenseApi = (
  dbApi: DbApiWrapper,
  myAddress?: NeuronAddress,
  followingAddresses = [] as NeuronAddress[]
) => ({
  getList: () => dbApi.getSenseList(myAddress),
  markAsRead: (id: NeuronAddress | ParticleCid) =>
    dbApi.senseMarkAsRead(myAddress!, id),
  getAllParticles: (fields: string[]) => dbApi.getParticles(fields),
  getLinks: (cid: ParticleCid) => dbApi.getLinks({ cid }),
  addMsgSendAsLocal: async (msg: LocalSenseChatMessage) => {
    /*
    This function add to database virtual sync item
    and create transaction as well.
    When actual data is recieved from blockchain,
    thoose 'local' items must be rewritten by that.
    */
    const syncItems = await dbApi.findSyncStatus({
      ownerId: myAddress!,
      entryType: EntryType.chat,
      id: msg.toAddress,
    });

    const { transaction, syncItem } = prepareSenseChatEntities(
      msg,
      syncItems[0]
    );
    console.log('------addMsgSendAsLocal', syncItems[0], transaction, syncItem);
    await dbApi.putTransactions([transaction]);
    await dbApi.putSyncStatus([syncItem]);
  },
  getTransactions: (neuron: NeuronAddress) => dbApi.getTransactions(neuron),
  getFriendItems: async (userAddress: NeuronAddress) => {
    if (!myAddress) {
      throw new Error('myAddress is not defined');
    }
    const chats = await dbApi.getMyChats(myAddress, userAddress);
    const links = followingAddresses.includes(userAddress)
      ? await dbApi.getLinks({ neuron: userAddress, cid: CID_TWEET })
      : [];

    return [...chats, ...links].sort((a, b) =>
      a.timestamp > b.timestamp ? 1 : -1
    );
  },
});

export type SenseApi = ReturnType<typeof createSenseApi> | null;

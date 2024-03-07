import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { isParticle } from 'src/features/particle/utils';
import { TransactionDto } from 'src/services/CozoDb/types/dto';
import DbApiWrapper from 'src/services/backend/services/dataSource/indexedDb/dbApiWrapper';
import {
  MSG_SEND_TRANSACTION_TYPE,
  MsgSendValue,
} from 'src/services/backend/services/indexer/types';
import { syncMyChats } from 'src/services/backend/services/sync/services/SyncTransactionsLoop/services/chat';
import { SENSE_FRIEND_PARTICLES } from 'src/services/backend/services/sync/services/consts';
import { NeuronAddress, ParticleCid, TransactionHash } from 'src/types/base';
import { EntityToDto } from 'src/types/dto';
import { getNowUtcTime } from 'src/utils/utils';

type LocalSenseChatMessage = {
  transactionHash: TransactionHash;
  fromAddress: NeuronAddress;
  toAddress: NeuronAddress;
  amount: Coin[];
  memo: string;
};

const prepareSenseTransaction = ({
  transactionHash,
  fromAddress,
  toAddress,
  amount,
  memo,
}: LocalSenseChatMessage) => {
  const value = {
    fromAddress,
    toAddress,
    amount,
  } as EntityToDto<MsgSendValue>;

  const transaction = {
    hash: transactionHash,
    type: MSG_SEND_TRANSACTION_TYPE,
    index: 0,
    timestamp: getNowUtcTime(),
    success: true,
    value,
    memo,
    neuron: fromAddress,
    blockHeight: -1,
  } as TransactionDto;

  return transaction;
};

export const createSenseApi = (
  dbApi: DbApiWrapper,
  myAddress?: NeuronAddress,
  followingAddresses = [] as NeuronAddress[]
) => ({
  getList: () => dbApi.getSenseList(myAddress),
  markAsRead: async (
    id: NeuronAddress | ParticleCid,
    lastTimestampRead?: number
  ) => {
    const syncItem = await dbApi.getSyncStatus(myAddress!, id);

    let unreadCount = 0;
    let timestampRead = syncItem.timestampUpdate;

    if (lastTimestampRead) {
      timestampRead = lastTimestampRead;

      if (isParticle(id)) {
        const links = await dbApi.getLinks({
          cid: id,
          neuron: myAddress!,
          timestampFrom: lastTimestampRead,
        });

        unreadCount = links.length;
      } else {
        const links = await dbApi.getLinks({
          cid: SENSE_FRIEND_PARTICLES,
          neuron: id,
          timestampFrom: lastTimestampRead,
        });

        const chats = await dbApi.getMyChats(myAddress!, id);

        unreadCount = links.length + chats.length;
      }
    }

    const res = await dbApi.updateSyncStatus({
      id,
      ownerId: myAddress!,
      timestampRead, //  conditional or read all
      unreadCount,
    });
    console.log('------senseMarkAsRead', syncItem, res, timestampRead);
    // console.timeEnd(`---senseMarkAsRead done ${id}`);
    return res;
  },
  getAllParticles: (fields: string[]) => dbApi.getParticlesRaw(fields),
  getLinks: (cid: ParticleCid) => dbApi.getLinks({ cid }),
  addMsgSendAsLocal: async (msg: LocalSenseChatMessage) => {
    /*
    This function create syntetic transaction (blockHeight=-1)
    and create syncItem as well.
    */
    const transaction = prepareSenseTransaction(msg);

    await dbApi.putTransactions([transaction]);
    await syncMyChats(
      dbApi,
      myAddress!,
      transaction.timestamp,
      new AbortController().signal,
      false
    );
  },
  getTransactions: (neuron: NeuronAddress) => dbApi.getTransactions(neuron),
  getFriendItems: async (userAddress: NeuronAddress) => {
    if (!myAddress) {
      throw new Error('myAddress is not defined');
    }
    const chats = await dbApi.getMyChats(myAddress, userAddress);
    const links = followingAddresses.includes(userAddress)
      ? await dbApi.getLinks({
          neuron: userAddress,
          cid: SENSE_FRIEND_PARTICLES,
        })
      : [];

    // merge 2 lists and reorder
    const result = [...chats, ...links].sort((a, b) =>
      a.timestamp > b.timestamp ? 1 : -1
    );

    return result;
  },
});

export type SenseApi = ReturnType<typeof createSenseApi> | null;

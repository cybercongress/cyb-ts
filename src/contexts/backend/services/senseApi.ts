import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { CID_FOLLOW, CID_TWEET } from 'src/constants/app';
import { TransactionDto } from 'src/services/CozoDb/types/dto';
import DbApiWrapper from 'src/services/backend/services/dataSource/indexedDb/dbApiWrapper';
import {
  MSG_SEND_TRANSACTION_TYPE,
  MsgSendValue,
} from 'src/services/backend/services/indexer/types';
import { syncMyChats } from 'src/services/backend/services/sync/services/SyncTransactionsLoop/services/chat';
import { NeuronAddress, ParticleCid, TransactionHash } from 'src/types/base';
import { EntityToDto } from 'src/types/dto';

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
    timestamp: new Date().getTime(),
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
  markAsRead: (id: NeuronAddress | ParticleCid) =>
    dbApi.senseMarkAsRead(myAddress!, id),
  getAllParticles: (fields: string[]) => dbApi.getParticles(fields),
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
          cid: [CID_TWEET, CID_FOLLOW],
        })
      : [];
    return [...chats, ...links];
  },
});

export type SenseApi = ReturnType<typeof createSenseApi> | null;

import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { CID_TWEET } from 'src/constants/app';
import { TransactionDto } from 'src/services/CozoDb/types/dto';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { dtoToEntity } from 'src/utils/dto';
import DbApiWrapper from 'src/services/backend/services/dataSource/indexedDb/dbApiWrapper';
import {
  MSG_SEND_TRANSACTION_TYPE,
  MsgSendValue,
} from 'src/services/backend/services/indexer/types';
import { syncMyChats } from 'src/services/backend/services/sync/services/SyncTransactionsLoop/services/chat';
import { NeuronAddress, ParticleCid, TransactionHash } from 'src/types/base';

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
}: LocalSenseChatMessage) =>
  // syncItem?: SyncStatusDto
  {
    const index = 0;
    const timestamp = new Date().getTime();

    const value = dtoToEntity({
      fromAddress,
      toAddress,
      amount,
    }) as MsgSendValue;

    const transaction = {
      hash: transactionHash,
      type: MSG_SEND_TRANSACTION_TYPE,
      index,
      timestamp,
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
    const syncItems = await dbApi.findSyncStatus({
      ownerId: myAddress!,
      entryType: EntryType.chat,
      id: msg.toAddress,
    });

    const transaction = prepareSenseTransaction(msg);
    console.log('------addMsgSendAsLocal', syncItems[0], transaction);

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
      ? await dbApi.getLinks({ neuron: userAddress, cid: CID_TWEET })
      : [];

    return [...chats, ...links].sort((a, b) =>
      a.timestamp > b.timestamp ? 1 : -1
    );
  },
});

export type SenseApi = ReturnType<typeof createSenseApi> | null;

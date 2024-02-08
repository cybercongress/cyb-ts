import { CID_TWEET } from 'src/constants/app';
import DbApiWrapper from 'src/services/backend/services/dataSource/indexedDb/dbApiWrapper';
import { NeuronAddress, ParticleCid } from 'src/types/base';

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

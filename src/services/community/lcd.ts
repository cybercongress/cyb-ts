import axios from 'axios';
import { NeuronAddress, ParticleCid } from 'src/types/base';
import { CID_FOLLOW } from 'src/constants/app';
import { getIpfsHash } from 'src/utils/ipfs/helpers';
import { LCD_URL } from 'src/constants/config';
// import { Api } from 'src/generated/lcd';

// const lcdApi = new Api({ baseURL: LCD_URL });

export const getFollowsAsCid = async (
  address: NeuronAddress,
  signal?: AbortSignal
): Promise<ParticleCid[]> => {
  // const response = await lcdApi.cosmos.getTxsEvent(
  //   {
  //     events: [
  //       `cyberlink.neuron=${address}`,
  //       `cyberlink.particleFrom=${CID_FOLLOW}`,
  //     ],
  //     paginationLimit: '1000000000',
  //   },
  //   { signal }
  // );

  const response = await axios({
    method: 'get',
    url: `${LCD_URL}/txs?cyberlink.neuron=${address}&cyberlink.particleFrom=${CID_FOLLOW}&limit=1000000000`,
    signal,
  });

  if (!response.data.txs) {
    return [];
  }
  return response.data.txs.map(
    (item) => item.tx.value.msg[0].value.links[0].to
  );
};

export const getFollowers = async (
  address: NeuronAddress,
  signal?: AbortSignal
): Promise<NeuronAddress[]> => {
  const addressHash = await getIpfsHash(address);

  const response = await axios({
    method: 'get',
    url: `${LCD_URL}/txs?cyberlink.particleFrom=${CID_FOLLOW}&cyberlink.particleTo=${addressHash}&limit=1000000000`,
    signal,
  });

  if (!response.data.txs) {
    return [];
  }
  return response.data.txs.map((item) => item.tx.value.msg[0].value.neuron);
};

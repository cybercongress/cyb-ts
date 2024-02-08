import axios from 'axios';
import { CYBER_NODE_URL_LCD } from 'src/constants/config';
import { NeuronAddress, ParticleCid } from 'src/types/base';
import { CID_FOLLOW } from 'src/constants/app';
import { getIpfsHash } from 'src/utils/search/utils';

export const getFollowsAsCid = async (
  address: NeuronAddress
): Promise<ParticleCid[]> => {
  const response = await axios({
    method: 'get',
    url: `${CYBER_NODE_URL_LCD}/txs?cyberlink.neuron=${address}&cyberlink.particleFrom=${CID_FOLLOW}&limit=1000000000`,
  });

  return response.data.txs.map(
    (item) => item.tx.value.msg[0].value.links[0].to
  );
};

export const getFollowers = async (
  address: NeuronAddress
): Promise<NeuronAddress[]> => {
  const addressHash = await getIpfsHash(address);

  const response = await axios({
    method: 'get',
    url: `${CYBER_NODE_URL_LCD}/txs?cyberlink.particleFrom=${CID_FOLLOW}&cyberlink.particleTo=${addressHash}&limit=1000000000`,
  });
  return response.data.txs.map((item) => item.tx.value.msg[0].value.neuron);
};

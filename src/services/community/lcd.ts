import axios from 'axios';
import { NeuronAddress, ParticleCid } from 'src/types/base';
import { CID_FOLLOW } from 'src/constants/app';
import { getIpfsHash } from 'src/utils/ipfs/helpers';
import { CONTRACT_ADDRESS_PASSPORT } from 'src/containers/portal/utils';
import { toAscii, toBase64 } from '@cosmjs/encoding';
import { PassportContractQuery } from 'src/services/soft.js/api/passport';
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

// need this request to query passports with any queryClient chain
export async function getPassport(query: PassportContractQuery) {
  const response = await axios.get(
    `${LCD_URL}/cosmwasm/wasm/v1/contract/${CONTRACT_ADDRESS_PASSPORT}/smart/${toBase64(
      toAscii(JSON.stringify(query))
    )}`
  );
  return response.data.data;
}

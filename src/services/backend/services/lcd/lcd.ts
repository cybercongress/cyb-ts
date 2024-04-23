import axios from 'axios';
import { CYBER_NODE_URL_LCD } from 'src/constants/config';
import { NeuronAddress, ParticleCid } from 'src/types/base';
import { CID_FOLLOW } from 'src/constants/app';
import { getIpfsHash } from 'src/utils/ipfs/helpers';
import { CONTRACT_ADDRESS_PASSPORT } from 'src/containers/portal/utils';
import { toAscii, toBase64 } from '@cosmjs/encoding';
import { PassportContractQuery } from 'src/soft.js/api/passport';

export const getFollowsAsCid = async (
  address: NeuronAddress,
  signal?: AbortSignal
): Promise<ParticleCid[]> => {
  const response = await axios({
    method: 'get',
    url: `${CYBER_NODE_URL_LCD}/txs?cyberlink.neuron=${address}&cyberlink.particleFrom=${CID_FOLLOW}&limit=1000000000`,
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
    url: `${CYBER_NODE_URL_LCD}/txs?cyberlink.particleFrom=${CID_FOLLOW}&cyberlink.particleTo=${addressHash}&limit=1000000000`,
    signal,
  });
  // console.log(
  //   '-----getFollowers',
  //   `${CYBER_NODE_URL_LCD}/txs?cyberlink.particleFrom=${CID_FOLLOW}&cyberlink.particleTo=${addressHash}&limit=1000000000`,
  //   response.data
  // );
  if (!response.data.txs) {
    return [];
  }
  return response.data.txs.map((item) => item.tx.value.msg[0].value.neuron);
};

export async function getTransaction(txHash: string) {
  // https://lcd.bostrom.cybernode.ai/cosmos/tx/v1beta1/txs/67FD87EBCC1633B779C154C1CAFD48DE71350074A04F742DAD418F69F1D05BB0
  const response = axios.get(
    `${CYBER_NODE_URL_LCD}/cosmos/tx/v1beta1/txs/${txHash}`
  );
  return response;
}

// need this request to query passports with any queryClient chain
export async function getPassport(query: PassportContractQuery) {
  const response = await axios.get(
    `${CYBER_NODE_URL_LCD}/cosmwasm/wasm/v1/contract/${CONTRACT_ADDRESS_PASSPORT}/smart/${toBase64(
      toAscii(JSON.stringify(query))
    )}`
  );
  return response.data.data;
}

import { NeuronAddress, ParticleCid } from 'src/types/base';
import { CID_FOLLOW } from 'src/constants/app';
import { getIpfsHash } from 'src/utils/ipfs/helpers';
import { getTransactions } from 'src/services/transactions/lcd';

export const getFollowsAsCid = async (
  address: NeuronAddress,
  signal?: AbortSignal
): Promise<ParticleCid[]> => {
  const response = await getTransactions({
    events: [
      {
        key: 'cyberlink.neuron',
        value: address,
      },
      {
        key: 'cyberlink.particleFrom',
        value: CID_FOLLOW,
      },
    ],
    pagination: {
      limit: 1000000000,
    },
    config: {
      signal,
    },
  });

  if (!response.txResponses.length) {
    return [];
  }

  return response.txResponses.map(
    (item) => item?.tx?.body?.messages[0].links[0].to
  );
};

export const getFollowers = async (
  address: NeuronAddress,
  signal?: AbortSignal
): Promise<NeuronAddress[]> => {
  const addressHash = await getIpfsHash(address);

  const response = await getTransactions({
    events: [
      {
        key: 'cyberlink.particleFrom',
        value: CID_FOLLOW,
      },
      {
        key: 'cyberlink.particleTo',
        value: addressHash,
      },
    ],
    pagination: {
      limit: 1000000000,
    },
    config: {
      signal,
    },
  });

  if (!response.txResponses.length) {
    return [];
  }

  // debugger;
  // check

  return response.txResponses
    .map((item) => item?.tx?.body?.messages?.[0].value?.neuron)
    .filter(Boolean);
};

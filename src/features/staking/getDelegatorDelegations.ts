import { CyberClient } from '@cybercongress/cyber-js';
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking';

// eslint-disable-next-line import/prefer-default-export
export const getDelegatorDelegations = async (
  client: CyberClient,
  addressBech32: string
): Promise<DelegationResponse[]> => {
  let nextKey;
  const delegationData: DelegationResponse[] = [];

  let done = false;
  while (!done) {
    // eslint-disable-next-line no-await-in-loop
    const responsedelegatorDelegations = await client.delegatorDelegations(
      addressBech32,
      nextKey
    );

    delegationData.push(...responsedelegatorDelegations.delegationResponses);

    const key = responsedelegatorDelegations?.pagination?.nextKey;

    if (key) {
      nextKey = key;
    } else {
      done = true;
    }
  }

  return delegationData;
};

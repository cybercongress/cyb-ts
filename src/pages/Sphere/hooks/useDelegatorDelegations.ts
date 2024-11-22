import { Coin } from '@cosmjs/stargate';
import { useCyberClient } from 'src/contexts/queryCyberClient';

function useDelegatorDelegations(addressActive?: string) {
  const { hooks } = useCyberClient();

  const { data: delegationsResponse, refetch: refetchDelegations } =
    hooks.cosmos.staking.v1beta1.useDelegatorDelegations({
      request: { delegatorAddr: addressActive || '' },
      options: { enabled: Boolean(addressActive) },
    });

  const delegationsData =
    delegationsResponse && delegationsResponse.delegationResponses
      ? delegationsResponse.delegationResponses.reduce<{ [key: string]: Coin }>(
          (acc, item) => ({
            ...acc,
            [item.delegation.validatorAddress]: item.balance,
          }),
          {}
        )
      : {};

  return { delegationsData, refetchDelegations };
}

export default useDelegatorDelegations;

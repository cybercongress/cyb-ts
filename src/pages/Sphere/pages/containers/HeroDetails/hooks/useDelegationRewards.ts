import { useCyberClient } from 'src/contexts/queryCyberClient';

function useDelegationRewards(
  addressActive?: string,
  operatorAddress?: string
) {
  const { hooks } = useCyberClient();

  const { data: dataDelegationRewards, refetch } =
    hooks.cosmos.distribution.v1beta1.useDelegationRewards({
      request: {
        delegatorAddress: addressActive || '',
        validatorAddress: operatorAddress || '',
      },
      options: { enabled: Boolean(hooks && addressActive && operatorAddress) },
    });

  const reward = dataDelegationRewards?.rewards
    ? dataDelegationRewards.rewards[0]
    : undefined;

  return { reward, refetch };
}

export default useDelegationRewards;

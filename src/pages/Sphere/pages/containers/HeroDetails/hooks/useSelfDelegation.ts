import { useCyberClient } from 'src/contexts/queryCyberClient';
import { fromBech32 } from 'src/utils/utils';

function useSelfDelegation(operatorAddress?: string) {
  const { hooks } = useCyberClient();

  const delegateAddress = operatorAddress
    ? fromBech32(operatorAddress)
    : undefined;

  const { data: dataDelegatorValidator } =
    hooks.cosmos.staking.v1beta1.useDelegation({
      request: {
        validatorAddr: operatorAddress || '',
        delegatorAddr: delegateAddress || '',
      },
      options: {
        enabled: Boolean(hooks && delegateAddress && operatorAddress),
      },
    });

  const selfDelegationCoin = dataDelegatorValidator
    ? dataDelegatorValidator.delegationResponse?.balance
    : undefined;
  return { selfDelegationCoin };
}

export default useSelfDelegation;

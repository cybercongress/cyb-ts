import { useAppSelector } from 'src/redux/hooks';
import useQueryClientMethod from './useQueryClientMethod';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { QueryDelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/query';
import { CyberClient } from '@cybercongress/cyber-js';

type Params = Parameters<CyberClient['delegation']>;

// TODO: improve types
// rename to better name
function useDelegationFunc(
  delegatorAddress: Params['0'],
  validatorAddress: Params['1']
) {
  const { data, ...rest } = useQueryClientMethod<QueryDelegationResponse>(
    'delegation',
    [delegatorAddress, validatorAddress]
  );

  const { delegationResponse } = data || {};

  return {
    data: delegationResponse
      ? {
          validatorAddress: delegationResponse?.delegation?.validatorAddress,
          shares: delegationResponse?.delegation?.shares,
          balance: delegationResponse?.balance,
        }
      : undefined,
    ...rest,
  };
}

function useDelegation(validatorAddress: string) {
  const address = useAppSelector(selectCurrentAddress);

  return useDelegationFunc(address, validatorAddress);
}

export default useDelegation;

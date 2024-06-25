import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import useQueryClientMethod from '../../../hooks/useQueryClientMethod';

const methodName = 'delegation';

type Params = NonNullable<
  Parameters<typeof useQueryClientMethod<typeof methodName>>[1]
>;

// TODO: seems possible to improve types
function useDelegationFunc(
  delegatorAddress: Params['0'],
  validatorAddress: Params['1']
) {
  const { data, ...rest } = useQueryClientMethod<typeof methodName>(
    methodName,
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

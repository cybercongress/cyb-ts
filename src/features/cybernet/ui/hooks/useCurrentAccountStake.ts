import { useAppSelector } from 'src/redux/hooks';
import useCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { StakeInfo } from '../../types';

function useCurrentAccountStake() {
  const currentAddress = useAppSelector(selectCurrentAddress);

  const query = useCybernetContract<StakeInfo>({
    query: {
      get_stake_info_for_coldkey: {
        coldkey: currentAddress,
      },
    },
    skip: !currentAddress,
  });

  console.log(query);

  return query;
}

export default useCurrentAccountStake;

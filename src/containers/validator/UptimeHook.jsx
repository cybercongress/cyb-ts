import { useUptimeByAddressQuery } from 'src/generated/graphql';
import { INFINITY } from 'src/constants/app';
import { BECH32_PREFIX_VAL_CONS } from 'src/constants/config';
import BigNumber from 'bignumber.js';
import { Dots } from '../../components';
import { fromBech32 } from '../../utils/utils';

function useUptime({ accountUser }) {
  const { loading, data, error } = useUptimeByAddressQuery({
    variables: {
      address: `${fromBech32(accountUser, BECH32_PREFIX_VAL_CONS)}`,
    },
  });

  if (loading) {
    return <Dots />;
  }

  if (error) {
    return INFINITY;
  }

  return `${new BigNumber(data.uptime)
    .shiftedBy(2)
    .dp(2, BigNumber.ROUND_FLOOR)
    .toString()} %`;
}

export default useUptime;

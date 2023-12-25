import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from 'src/contexts/queryClient';
import { QueryLiquidityPoolsResponse } from '@cybercongress/cyber-js/build/codec/tendermint/liquidity/v1beta1/query';
import { Option } from 'src/types';

type OptionPoolListInterval = {
  refetchInterval?: number | false;
};

function usePoolListInterval(
  option: OptionPoolListInterval = { refetchInterval: false }
) {
  const queryClient = useQueryClient();

  const { data } = useQuery(
    ['liquidityPools'],
    () => {
      return queryClient?.pools() as Option<QueryLiquidityPoolsResponse>;
    },
    {
      enabled: Boolean(queryClient),
      refetchInterval: option.refetchInterval,
    }
  );

  return data?.pools;
}

export default usePoolListInterval;

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from 'src/contexts/queryClient';
import { Pool } from '@cybercongress/cyber-js/build/codec/tendermint/liquidity/v1beta1/liquidity';
import { QueryLiquidityPoolsResponse } from '@cybercongress/cyber-js/build/codec/tendermint/liquidity/v1beta1/query';
import { Option } from 'src/types';

type OptionPoolListInterval = {
  refetchInterval?: number | false;
};

function usePoolListInterval(
  option: OptionPoolListInterval = { refetchInterval: false }
) {
  const queryClient = useQueryClient();
  const [poolsData, setPoolsData] = useState<Pool[]>();
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

  useEffect(() => {
    if (data) {
      setPoolsData(data.pools);
    }
  }, [data]);

  return poolsData;
}

export default usePoolListInterval;

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useSdk from 'src/hooks/useSdk';
import { Pool } from '@cybercongress/cyber-js/build/codec/tendermint/liquidity/v1beta1/liquidity';
import { QueryLiquidityPoolsResponse } from '@cybercongress/cyber-js/build/codec/tendermint/liquidity/v1beta1/query';

type Option<T> = T | undefined;

type OptionPoolListInterval = {
  refetchInterval?: number | false;
};

function usePoolListInterval(
  option: OptionPoolListInterval = { refetchInterval: false }
) {
  const { queryClient } = useSdk();
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
    if (data !== undefined) {
      setPoolsData(data.pools);
    }
  }, [data]);

  return poolsData;
}

export default usePoolListInterval;

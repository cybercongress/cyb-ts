import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useSdk from 'src/hooks/useSdk';
import {
  Params,
  Pool,
} from '@cybercongress/cyber-js/build/codec/tendermint/liquidity/v1beta1/liquidity';
import {
  QueryLiquidityPoolsResponse,
  QueryParamsResponse,
} from '@cybercongress/cyber-js/build/codec/tendermint/liquidity/v1beta1/query';

type Option<T> = T | undefined;

export function usePoolListInterval() {
  const { queryClient } = useSdk();
  const [poolsData, setPoolsData] = useState<Pool[]>();
  const { data } = useQuery(
    ['liquidityPools'],
    () => {
      return queryClient?.pools() as Option<QueryLiquidityPoolsResponse>;
    },
    {
      enabled: Boolean(queryClient),
      refetchInterval: 50000,
    }
  );

  useEffect(() => {
    if (data !== undefined) {
      setPoolsData(data.pools);
    }
  }, [data]);

  return poolsData;
}

export function useGetParams() {
  const { queryClient } = useSdk();
  const { data } = useQuery(
    ['liquidityParams'],
    () => {
      return queryClient?.liquidityParams() as Option<QueryParamsResponse>;
    },
    {
      enabled: Boolean(queryClient),
    }
  );
  const [params, setParams] = useState<Params>();

  useEffect(() => {
    const getLiquidityParams = () => {
      if (data !== undefined) {
        setParams(data.params);
      }
    };
    getLiquidityParams();
  }, [data]);

  return params;
}

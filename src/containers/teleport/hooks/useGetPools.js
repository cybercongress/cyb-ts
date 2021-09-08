import { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import useSWR from 'swr';
import { AppContext } from '../../../context';
import { CYBER } from '../../../utils/config';

export function usePoolListInterval(interval = 8000) {
  const { data, error } = useSWR(
    `${CYBER.CYBER_NODE_URL_LCD}/cosmos/liquidity/v1beta1/pools`,
    Axios,
    {
      refreshInterval: interval,
    }
  );

  if (!data && !error) {
    return { poolsData: [], error };
  }

  return { poolsData: data?.data.pools, error };
}

export function useGetParams() {
  const { jsCyber } = useContext(AppContext);
  const [params, setParams] = useState(null);

  useEffect(() => {
    const getLiquidityParams = async () => {
      if (jsCyber !== null) {
        const responseLiquidityParams = await jsCyber.liquidityParams();

        console.log(`responseLiquidityParams`, responseLiquidityParams);
        setParams(responseLiquidityParams.params);
      }
    };
    getLiquidityParams();
  }, [jsCyber]);

  return { params };
}

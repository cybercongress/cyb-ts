import { useEffect, useState, useContext } from 'react';
import useSWR from 'swr';
import { AppContext } from '../../../context';
import { CYBER } from '../../../utils/config';

const fetcher = (args) => fetch(args).then((res) => res.json());

export function usePoolListInterval() {
  try {
    const response = useSWR(
      `${CYBER.CYBER_NODE_URL_LCD}/cosmos/liquidity/v1beta1/pools`,
      fetcher,
      {
        errorRetryCount: 3,
        refreshInterval: 10000,
      }
    );

    if (!response) {
      return { poolsData: [] };
    }

    const typedData = response.data;

    return { poolsData: typedData.pools };
  } catch (error) {
    return { poolsData: [] };
  }
}

export function useGetParams() {
  const { jsCyber } = useContext(AppContext);
  const [params, setParams] = useState(null);

  useEffect(() => {
    const getLiquidityParams = async () => {
      if (jsCyber !== null) {
        const responseLiquidityParams = await jsCyber.liquidityParams();
        setParams(responseLiquidityParams.params);
      }
    };
    getLiquidityParams();
  }, [jsCyber]);

  return { params };
}

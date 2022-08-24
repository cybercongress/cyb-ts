import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { AppContext } from '../../../context';
import { CYBER } from '../../../utils/config';

const apiCall = async () => {
  try {
    const response = await axios({
      url: `${CYBER.CYBER_NODE_URL_LCD}/cosmos/liquidity/v1beta1/pools`,
      method: 'GET',
      headers: {
        accept: 'Application/json',
        'Content-Type': 'Application/json',
      },
    });
    return response.data.pools;
  } catch (error) {
    return [];
  }
};

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

// export function usePoolListInterval() {
//   const [poolsData, setPoolsData] = useState([]);
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCount(count + 1);
//     }, 10000);
//     return () => clearInterval(interval);
//   }, [count]);

//   useEffect(() => {
//     const confirmTx = async () => {
//       const data = await apiCall();
//       if (data) {
//         setPoolsData(data);
//       }
//     };
//     confirmTx();
//   }, [count]);

//   return { poolsData };
// }

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

import { useState, useEffect, useCallback } from 'react';
import BigNumber from 'bignumber.js';
import { useQueryClient } from 'src/contexts/queryClient';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { DENOM_LIQUID, BASE_DENOM } from 'src/constants/config';
import useGetTotalSupply from './useGetTotalSupply';
import usePoolListInterval from './usePoolListInterval';
import { reduceBalances, convertAmount } from '../utils/utils';

const defaultTokenList = {
  [BASE_DENOM]: 0,
  [DENOM_LIQUID]: 0,
  milliampere: 0,
  millivolt: 0,
  tocyb: 0,
};

const calculatePrice = (coinsPair, balances, tracesDenom) => {
  let price = 0;
  const tokenA = coinsPair[0];
  const tokenB = coinsPair[1];
  const [{ coinDecimals: coinDecimalsA }] = tracesDenom(tokenA);
  const [{ coinDecimals: coinDecimalsB }] = tracesDenom(tokenB);

  const amountA = new BigNumber(convertAmount(balances[tokenA], coinDecimalsA));
  const amountB = new BigNumber(convertAmount(balances[tokenB], coinDecimalsB));

  if (amountA.comparedTo(0) && amountB.comparedTo(0)) {
    price = amountA.dividedBy(amountB).toNumber();
  }

  return price;
};

const getPoolPrice = (data, tracesDenom) => {
  const copyObj = { ...data };
  Object.keys(copyObj).forEach((key) => {
    const element = copyObj[key];
    if (element.balances) {
      const coinsPair = element.reserveCoinDenoms;
      const { balances } = element;
      let price = 0;
      if (coinsPair[0] === DENOM_LIQUID || coinsPair[1] === DENOM_LIQUID) {
        if (coinsPair[0] === DENOM_LIQUID) {
          price = calculatePrice(coinsPair, balances, tracesDenom);
        } else {
          price = calculatePrice(
            [...coinsPair].reverse(),
            balances,
            tracesDenom
          );
          copyObj[key].reserveCoinDenoms = [...coinsPair].reverse();
        }
      } else {
        price = calculatePrice(coinsPair, balances, tracesDenom);
      }
      element.price = price;
    }
  });
  return copyObj;
};

const getPoolsBalance = async (data, client) => {
  const copyObj = { ...data };
  // eslint-disable-next-line no-restricted-syntax
  for (const key in copyObj) {
    if (Object.hasOwnProperty.call(copyObj, key)) {
      const element = copyObj[key];
      const { reserveAccountAddress } = element;
      // eslint-disable-next-line no-await-in-loop
      const dataBalsnce = await client.getAllBalances(reserveAccountAddress);
      const reduceDataBalances = reduceBalances(dataBalsnce);
      element.balances = reduceDataBalances;
    }
  }
  return copyObj;
};

function useGetMarketData() {
  const queryClient = useQueryClient();
  const { tracesDenom } = useIbcDenom();
  // const [fetchDataWorker] = useWorker(getMarketData);
  const [dataTotal, setDataTotal] = useState({});
  const [poolsTotal, setPoolsTotal] = useState([]);
  const [marketData, setMarketData] = useState({});
  const { totalSupplyAll: dataTotalSupply } = useGetTotalSupply({
    refetchInterval: 1000 * 60 * 3,
  });
  const dataPools = usePoolListInterval({ refetchInterval: 1000 * 60 * 3 });

  useEffect(() => {
    const marketDataLS = localStorage.getItem('marketData');
    if (marketDataLS !== null) {
      const marketDataLSPObj = JSON.parse(marketDataLS);
      setMarketData({ ...marketDataLSPObj });
    }
  }, []);

  useEffect(() => {
    try {
      if (dataTotalSupply && Object.keys(dataTotalSupply).length > 0) {
        setDataTotal({ ...defaultTokenList, ...dataTotalSupply });
      }
    } catch (error) {
      console.log('error', error);
      setDataTotal([]);
    }
  }, [dataTotalSupply]);

  useEffect(() => {
    const getPpools = async () => {
      try {
        if (dataPools && dataPools.length > 0) {
          const reduceObj = dataPools.reduce(
            (obj, item) => ({
              ...obj,
              [item.poolCoinDenom]: {
                ...item,
              },
            }),
            {}
          );
          const poolsBalance = await getPoolsBalance(reduceObj, queryClient);
          const poolPriceObj = getPoolPrice(poolsBalance, tracesDenom);
          setPoolsTotal(poolPriceObj);
        }
      } catch (error) {
        console.log('error', error);
        setPoolsTotal([]);
      }
    };
    getPpools();
  }, [dataPools, queryClient, tracesDenom]);

  useEffect(() => {
    try {
      if (
        Object.keys(dataTotal).length > 0 &&
        Object.keys(poolsTotal).length > 0
      ) {
        const marketDataObj = {};
        marketDataObj[DENOM_LIQUID] = 1;
        Object.keys(dataTotal).forEach((keyI) => {
          Object.keys(poolsTotal).forEach((keyJ) => {
            const itemJ = poolsTotal[keyJ];
            const { reserveCoinDenoms } = itemJ;
            if (
              reserveCoinDenoms[0] === DENOM_LIQUID &&
              reserveCoinDenoms[1] === keyI
            ) {
              marketDataObj[keyI] = itemJ.price;
            }
          });
        });
        const tempdataPool = getMarketDataPool(marketDataObj);
        const resultMarketDataObj = { ...marketDataObj, ...tempdataPool };
        setMarketData(resultMarketDataObj);
        saveToLocalStorage(resultMarketDataObj);
      }
    } catch (error) {
      console.log('error', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTotal, poolsTotal]);

  const saveToLocalStorage = (obj) => {
    if (Object.keys(obj).length > 0) {
      localStorage.setItem('marketData', JSON.stringify(obj));
    }
  };

  const getMarketDataPool = useCallback(
    (data) => {
      try {
        const tempMarketData = {};
        if (Object.keys(dataTotal).length > 0) {
          const filteredDataTotalSupply = Object.keys(dataTotal).filter(
            (item) => item.includes('pool')
          );

          filteredDataTotalSupply.forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(poolsTotal, key)) {
              const { reserveCoinDenoms, balances } = poolsTotal[key];

              if (
                Object.prototype.hasOwnProperty.call(data, reserveCoinDenoms[0])
              ) {
                let marketCapTemp = 0;
                reserveCoinDenoms.forEach((itemJ) => {
                  if (data[itemJ] && balances[itemJ]) {
                    const marketDataPrice = data[itemJ];
                    const [{ coinDecimals }] = tracesDenom(itemJ);
                    const balancesConvert = convertAmount(
                      balances[itemJ],
                      coinDecimals
                    );
                    const marketCapaTemp = marketDataPrice * balancesConvert;
                    marketCapTemp += marketCapaTemp;
                  }
                });
                if (marketCapTemp > 0) {
                  const total = dataTotal[key];
                  const price = marketCapTemp / total;
                  tempMarketData[key] = price;
                }
              }
            }
          });
        }
        return tempMarketData;
      } catch (error) {
        console.log('error', error);
        return {};
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataTotal, poolsTotal]
  );

  return { marketData, dataTotal };
}

export default useGetMarketData;

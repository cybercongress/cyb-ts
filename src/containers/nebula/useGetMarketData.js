import { useState, useEffect, useContext, useCallback } from 'react';
import BigNumber from 'bignumber.js';
import { AppContext } from '../../context';
import { reduceBalances } from '../../utils/utils';
import { getCoinDecimals } from '../teleport/utils';

const defaultTokenList = {
  boot: 0,
  hydrogen: 0,
  milliampere: 0,
  millivolt: 0,
  tocyb: 0,
};

const calculatePrice = (coinsPair, balances) => {
  let price = 0;
  const tokenA = coinsPair[0];
  const tokenB = coinsPair[1];
  const amountA = new BigNumber(
    getCoinDecimals(Number(balances[tokenA]), tokenA)
  );
  const amountB = new BigNumber(
    getCoinDecimals(Number(balances[tokenB]), tokenB)
  );

  if ([tokenA, tokenB].sort()[0] !== tokenA) {
    price = amountB.dividedBy(amountA);
    price = price.multipliedBy(0.97).toNumber();
  } else {
    price = amountA.dividedBy(amountB);
    price = price.multipliedBy(1.03).toNumber();
  }
  return price;
};

const getPoolPrice = (data) => {
  const copyObj = { ...data };
  Object.keys(copyObj).forEach((key) => {
    const element = copyObj[key];
    if (element.balances) {
      const coinsPair = element.reserveCoinDenoms;
      const { balances } = element;
      let price = 0;
      if (coinsPair[0] === 'hydrogen' || coinsPair[1] === 'hydrogen') {
        if (coinsPair[0] === 'hydrogen') {
          price = calculatePrice(coinsPair.reverse(), balances);
        } else {
          price = calculatePrice(coinsPair, balances);
        }
      } else {
        price = calculatePrice(coinsPair, balances);
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
      element.balances = reduceBalances(dataBalsnce);
    }
  }
  return copyObj;
};

function useGetMarketData() {
  const { jsCyber } = useContext(AppContext);
  // const [fetchDataWorker] = useWorker(getMarketData);
  const [dataTotal, setDataTotal] = useState({});
  const [poolsTotal, setPoolsTotal] = useState([]);
  const [marketData, setMarketData] = useState({});

  useEffect(() => {
    const getBankTotal = async () => {
      if (jsCyber !== null) {
        const dataTotalSupply = await jsCyber.totalSupply();
        try {
          if (dataTotalSupply && dataTotalSupply.length > 0) {
            const reduceDataTotalSupply = reduceBalances(dataTotalSupply);
            setDataTotal({ ...defaultTokenList, ...reduceDataTotalSupply });
          }
        } catch (error) {
          console.log('error', error);
          setDataTotal([]);
        }
      }
    };
    getBankTotal();
  }, [jsCyber]);

  useEffect(() => {
    const getPpools = async () => {
      if (jsCyber !== null) {
        const dataPools = await jsCyber.pools();
        try {
          const { pools } = dataPools;
          if (dataPools && pools && Object.keys(pools).length > 0) {
            const reduceObj = pools.reduce(
              (obj, item) => ({
                ...obj,
                [item.poolCoinDenom]: {
                  ...item,
                },
              }),
              {}
            );
            const poolsBalance = await getPoolsBalance(reduceObj, jsCyber);
            const poolPriceObj = getPoolPrice(poolsBalance);
            setPoolsTotal(poolPriceObj);
          }
        } catch (error) {
          console.log('error', error);
          setPoolsTotal([]);
        }
      }
    };
    getPpools();
  }, [jsCyber]);

  useEffect(() => {
    try {
      if (
        Object.keys(dataTotal).length > 0 &&
        Object.keys(poolsTotal).length > 0
      ) {
        const marketDataObj = {};
        marketDataObj.hydrogen = 1;
        Object.keys(dataTotal).forEach((keyI) => {
          Object.keys(poolsTotal).forEach((keyJ) => {
            const itemJ = poolsTotal[keyJ];
            const { reserveCoinDenoms } = itemJ;
            if (
              reserveCoinDenoms[0] === keyI &&
              reserveCoinDenoms[1] === 'hydrogen'
            ) {
              marketDataObj[keyI] = itemJ.price;
            }
          });
        });
        const tempdataPool = getMarketDataPool(marketDataObj);
        setMarketData({ ...marketDataObj, ...tempdataPool });
      }
    } catch (error) {
      console.log('error', error);
    }
  }, [dataTotal, poolsTotal]);

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
                    const balancesA = balances[itemJ];
                    const marketCapaTemp = marketDataPrice * balancesA;
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
    [dataTotal, poolsTotal]
  );

  return { marketData, dataTotal };
}

export default useGetMarketData;

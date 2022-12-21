import { useState, useEffect, useContext, useCallback } from 'react';
import BigNumber from 'bignumber.js';
import axios from 'axios';
import { AppContext } from '../../context';
import { reduceBalances } from '../../utils/utils';
import { getCoinDecimals } from '../teleport/utils';
import { CYBER } from '../../utils/config';
import { findDenomInTokenList, isNative } from '../../hooks/useTraseDenom';

const defaultTokenList = {
  [CYBER.DENOM_CYBER]: 0,
  [CYBER.DENOM_LIQUID_TOKEN]: 0,
  milliampere: 0,
  millivolt: 0,
  tocyb: 0,
};

export const fncTraseDenom = (denomTrase, listIbcAccet) => {
  const infoDenomTemp = {
    denom: denomTrase,
    coinDecimals: 0,
  };
  let findDenom = null;

  if (!denomTrase.includes('pool')) {
    if (!isNative(denomTrase)) {
      if (
        listIbcAccet !== null &&
        Object.keys(listIbcAccet).length > 0 &&
        Object.prototype.hasOwnProperty.call(listIbcAccet, denomTrase)
      ) {
        const { baseDenom } = listIbcAccet[denomTrase];
        findDenom = baseDenom;
      }
    } else {
      findDenom = denomTrase;
    }

    if (findDenom !== null) {
      const denomInfoFromList = findDenomInTokenList(findDenom);
      if (denomInfoFromList !== null) {
        const { denom, coinDecimals } = denomInfoFromList;
        infoDenomTemp.denom = denom;
        infoDenomTemp.coinDecimals = coinDecimals;
      }
    }
  }

  return { ...infoDenomTemp };
};

export function getDisplayAmount(rawAmount, precision) {
  return new BigNumber(rawAmount).shiftedBy(-precision).toFixed(precision);
}

const calculatePrice = (coinsPair, balances, ibcDataDenom) => {
  let price = 0;
  const tokenA = coinsPair[0];
  const tokenB = coinsPair[1];
  const { coinDecimals: coinDecimalsA } = fncTraseDenom(tokenA, ibcDataDenom);
  const { coinDecimals: coinDecimalsB } = fncTraseDenom(tokenB, ibcDataDenom);

  const amountA = new BigNumber(
    getDisplayAmount(balances[tokenA], coinDecimalsA)
  );
  const amountB = new BigNumber(
    getDisplayAmount(balances[tokenB], coinDecimalsB)
  );

  if (amountA.comparedTo(0) && amountB.comparedTo(0)) {
    price = amountA.dividedBy(amountB).toNumber();
  }

  return price;
};

const getPoolPrice = (data, ibcDataDenom) => {
  const copyObj = { ...data };
  Object.keys(copyObj).forEach((key) => {
    const element = copyObj[key];
    if (element.balances) {
      const coinsPair = element.reserveCoinDenoms;
      const { balances } = element;
      let price = 0;
      if (
        coinsPair[0] === CYBER.DENOM_LIQUID_TOKEN ||
        coinsPair[1] === CYBER.DENOM_LIQUID_TOKEN
      ) {
        if (coinsPair[0] === CYBER.DENOM_LIQUID_TOKEN) {
          price = calculatePrice(coinsPair, balances, ibcDataDenom);
        } else {
          price = calculatePrice(coinsPair.reverse(), balances, ibcDataDenom);
        }
      } else {
        price = calculatePrice(coinsPair, balances, ibcDataDenom);
      }
      element.price = price;
    }
  });
  return copyObj;
};

const reduceAmountFunc = (data, ibcDataDenom) => {
  let balances = {};
  if (Object.keys(data).length > 0) {
    balances = Object.keys(data).reduce((obj, item) => {
      const amount = data[item];
      const { coinDecimals } = fncTraseDenom(item, ibcDataDenom);
      const reduceAmount = getDisplayAmount(amount, coinDecimals);
      return {
        ...obj,
        [item]: reduceAmount,
      };
    }, {});
  }

  return balances;
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
  const { jsCyber, ibcDataDenom } = useContext(AppContext);
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
            const poolsBalance = await getPoolsBalance(
              reduceObj,
              jsCyber,
              ibcDataDenom
            );
            const poolPriceObj = getPoolPrice(poolsBalance, ibcDataDenom);
            setPoolsTotal(poolPriceObj);
          }
        } catch (error) {
          console.log('error', error);
          setPoolsTotal([]);
        }
      }
    };
    getPpools();
  }, [jsCyber, ibcDataDenom]);

  useEffect(() => {
    try {
      if (
        Object.keys(dataTotal).length > 0 &&
        Object.keys(poolsTotal).length > 0
      ) {
        const marketDataObj = {};
        marketDataObj[CYBER.DENOM_LIQUID_TOKEN] = 1;
        Object.keys(dataTotal).forEach((keyI) => {
          Object.keys(poolsTotal).forEach((keyJ) => {
            const itemJ = poolsTotal[keyJ];
            const { reserveCoinDenoms } = itemJ;
            if (
              reserveCoinDenoms[0] === CYBER.DENOM_LIQUID_TOKEN &&
              reserveCoinDenoms[1] === keyI
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
                    const balancesA = getCoinDecimals(balances[itemJ], itemJ);
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

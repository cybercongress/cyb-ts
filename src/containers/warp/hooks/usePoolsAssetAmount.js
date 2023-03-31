import BigNumber from 'bignumber.js';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context';
import { convertAmount, reduceBalances } from '../../../utils/utils';

const usePoolsAssetAmount = (pools) => {
  const { jsCyber, traseDenom, marketData } = useContext(AppContext);
  const [poolsBal, setPoolsBal] = useState([]);
  const [poolsData, setPoolsData] = useState([]);
  const [totalCap, setTotalCap] = useState(0);

  useEffect(() => {
    const lastPoolCapLocalStorage = localStorage.getItem('lastPoolCap');
    const lastPoolLocalStorage = localStorage.getItem('lastPoolData');

    if (lastPoolCapLocalStorage !== null) {
      setTotalCap(new BigNumber(lastPoolCapLocalStorage).toNumber());
    }

    if (lastPoolLocalStorage !== null) {
      const lastPoolLSData = JSON.parse(lastPoolLocalStorage);
      if (lastPoolLSData.length > 0) {
        setPoolsData(lastPoolLSData);
      }
    }
  }, []);

  useEffect(() => {
    const getBalances = async () => {
      if (jsCyber !== null && pools.length > 0) {
        const newArrPools = [];
        for (let index = 0; index < pools.length; index += 1) {
          const pool = pools[index];
          const assetsData = {};
          const { reserve_account_address: addressPool } = pool;
          // eslint-disable-next-line no-await-in-loop
          const getBalancePromise = await jsCyber.getAllBalances(addressPool);
          const dataReduceBalances = reduceBalances(getBalancePromise);
          Object.keys(dataReduceBalances).forEach((key) => {
            const amount = new BigNumber(dataReduceBalances[key]).toNumber();
            const { coinDecimals } = traseDenom(key);
            const reduceAmoun = convertAmount(amount, coinDecimals);
            assetsData[key] = reduceAmoun;
          });
          newArrPools.push({ ...pool, assets: { ...assetsData } });
        }
        setPoolsBal(newArrPools);
      }
    };
    getBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsCyber, pools]);

  useEffect(() => {
    if (poolsBal.length > 0) {
      const newArrPools = [];
      let totalCapTemp = new BigNumber(0);
      poolsBal.forEach((pool) => {
        const { reserve_coin_denoms: coinDenoms, assets } = pool;
        let cap = new BigNumber(0);
        coinDenoms.forEach((item) => {
          if (
            Object.keys(marketData).length > 0 &&
            Object.prototype.hasOwnProperty.call(assets, item) &&
            Object.prototype.hasOwnProperty.call(marketData, item)
          ) {
            const amountA = new BigNumber(assets[item]);
            const priceA = marketData[item];
            const capItem = amountA.multipliedBy(priceA);
            cap = cap.plus(capItem);
          }
        });
        totalCapTemp = totalCapTemp.plus(cap);
        newArrPools.push({
          ...pool,
          cap: cap.dp(0, BigNumber.ROUND_FLOOR).toNumber(),
        });
      });

      setTotalCap(totalCapTemp.dp(0, BigNumber.ROUND_FLOOR).toNumber());
      if (totalCapTemp.comparedTo(0)) {
        localStorage.setItem(
          'lastPoolCap',
          totalCapTemp.dp(0, BigNumber.ROUND_FLOOR).toString()
        );
      }

      if (Object.keys(marketData).length > 0) {
        const sortedArr = newArrPools.sort((a, b) => b.cap - a.cap);
        setPoolsData(sortedArr);
        localStorage.setItem('lastPoolData', JSON.stringify(sortedArr));
      } else {
        setPoolsData(newArrPools);
        localStorage.setItem('lastPoolData', JSON.stringify(newArrPools));
      }
    }
  }, [poolsBal, marketData]);

  return { poolsData, totalCap };
};

export default usePoolsAssetAmount;

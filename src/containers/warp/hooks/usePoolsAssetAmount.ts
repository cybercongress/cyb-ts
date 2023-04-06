import BigNumber from 'bignumber.js';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context';
import { convertAmount, reduceBalances } from '../../../utils/utils';
import { Pool } from '@cybercongress/cyber-js/build/codec/tendermint/liquidity/v1beta1/liquidity';
import { Option } from 'src/types/common';
import useSdk from 'src/hooks/useSdk';
import { OptionNeverArray, PoolsWithAssetsType, PoolsWithAssetsCapType, AssetsType } from '../type';



const usePoolsAssetAmount = (pools: Option<Pool[]>) => {
  const { queryClient } = useSdk();
  const { traseDenom, marketData } = useContext(AppContext);
  const [poolsBal, setPoolsBal] = useState<
    OptionNeverArray<PoolsWithAssetsType[]>
  >([]);
  const [poolsData, setPoolsData] = useState<
    OptionNeverArray<PoolsWithAssetsCapType[]>
  >([]);
  const [totalCap, setTotalCap] = useState<number>(0);

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
      if (queryClient && pools) {
        const newArrPools: PoolsWithAssetsType[] = [];
        for (let index = 0; index < pools.length; index += 1) {
          const pool = pools[index];
          const assetsData: AssetsType = {};
          const { reserveAccountAddress } = pool;
          // eslint-disable-next-line no-await-in-loop
          const getBalancePromise = await queryClient.getAllBalances(
            reserveAccountAddress
          );
          const dataReduceBalances = reduceBalances(getBalancePromise);
          Object.keys(dataReduceBalances).forEach((key) => {
            const amount = new BigNumber(dataReduceBalances[key]).toNumber();
            const { coinDecimals } = traseDenom(key);
            const reduceAmoun = convertAmount(amount, coinDecimals);
            assetsData[key] = reduceAmoun;
          });
          if (Object.keys(assetsData).length > 0) {
            newArrPools.push({ ...pool, assets: { ...assetsData } });
          }
        }
        setPoolsBal(newArrPools);
      }
    };
    getBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, pools]);

  useEffect(() => {
    if (poolsBal.length > 0) {
      const newArrPools: PoolsWithAssetsCapType[] = [];
      let totalCapTemp = new BigNumber(0);
      poolsBal.forEach((pool) => {
        const { reserveCoinDenoms, assets } = pool;
        let cap = new BigNumber(0);
        reserveCoinDenoms.forEach((item) => {
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

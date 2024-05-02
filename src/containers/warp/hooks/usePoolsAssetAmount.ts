import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { Pool } from '@cybercongress/cyber-js/build/codec/tendermint/liquidity/v1beta1/liquidity';
import { Option } from 'src/types';
import { useQueryClient } from 'src/contexts/queryClient';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { useAppData } from 'src/contexts/appData';
import {
  OptionNeverArray,
  PoolsWithAssetsType,
  PoolsWithAssetsCapType,
  AssetsType,
} from '../type';
import { convertAmount, reduceBalances } from '../../../utils/utils';

const usePoolsAssetAmount = (pools: Option<Pool[]>) => {
  const queryClient = useQueryClient();
  const { marketData } = useAppData();
  const { tracesDenom } = useIbcDenom();
  const [poolsBal, setPoolsBal] = useState<
    OptionNeverArray<PoolsWithAssetsType[]>
  >([]);
  const [poolsData, setPoolsData] = useState<
    OptionNeverArray<PoolsWithAssetsCapType[]>
  >([]);
  const [totalCap, setTotalCap] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const lastPoolCapLocalStorage = localStorage.getItem('lastPoolCap');
    // const lastPoolLocalStorage = localStorage.getItem('lastPoolData');

    if (lastPoolCapLocalStorage !== null) {
      setTotalCap(new BigNumber(lastPoolCapLocalStorage).toNumber());
    }

    // if (lastPoolLocalStorage !== null) {
    //   const lastPoolLSData = JSON.parse(lastPoolLocalStorage);
    //   if (lastPoolLSData.length > 0) {
    //     setPoolsData(lastPoolLSData);
    //   }
    // }
  }, []);

  useEffect(() => {
    (async () => {
      if (!queryClient || !pools) {
        return;
      }
      setLoading(true);
      const newArrPools: PoolsWithAssetsType[] = [];
      // eslint-disable-next-line no-restricted-syntax
      for await (const pool of pools) {
        const assetsData: AssetsType = {};
        const { reserveAccountAddress } = pool;

        const getBalancePromise = await queryClient.getAllBalances(
          reserveAccountAddress
        );

        const dataReduceBalances = reduceBalances(getBalancePromise);
        Object.keys(dataReduceBalances).forEach((key) => {
          const amount = new BigNumber(dataReduceBalances[key]).toNumber();
          const [{ coinDecimals }] = tracesDenom(key);
          const reduceAmoun = convertAmount(amount, coinDecimals);
          assetsData[key] = reduceAmoun;
        });
        if (Object.keys(assetsData).length > 0) {
          newArrPools.push({ ...pool, assets: { ...assetsData } });
        }
      }

      setPoolsBal(newArrPools);
      setLoading(false);
    })();
  }, [queryClient, pools, tracesDenom]);

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

  return { poolsData, totalCap, loading };
};

export default usePoolsAssetAmount;

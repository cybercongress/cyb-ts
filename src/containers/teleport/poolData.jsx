/* eslint-disable no-restricted-syntax */
import React, { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import BigNumber from 'bignumber.js';
import { NoItems } from '../../components';
import { PoolsInfo, PoolCard } from './components/pool';
import { useGetMySharesInPools, usePoolsAssetAmount } from './hooks';
import styles from './components/pool/styles.scss';

function PoolData({ data, totalSupplyData, accountBalances }) {
  const { poolsData, totalCap } = usePoolsAssetAmount(data);
  const { myCap } = useGetMySharesInPools(accountBalances);

  const useMyProcent = useMemo(() => {
    if (totalCap > 0 && myCap > 0) {
      return new BigNumber(myCap)
        .dividedBy(totalCap)
        .multipliedBy(100)
        .dp(3, BigNumber.ROUND_FLOOR)
        .toNumber();
    }

    return 0;
  }, [totalCap, myCap]);

  const itemsPools = useMemo(() => {
    if (poolsData.length > 0) {
      return poolsData.map((item) => {
        const keyItem = uuidv4();

        return (
          <PoolCard
            key={keyItem}
            pool={item}
            totalSupplyData={totalSupplyData}
            accountBalances={accountBalances}
          />
        );
      });
    }
    return [];
  }, [poolsData]);

  return (
    <div className={styles.PoolDataContainer}>
      <PoolsInfo
        myCap={myCap}
        totalCap={totalCap}
        useMyProcent={useMyProcent}
      />
      {Object.keys(itemsPools).length > 0 ? (
        itemsPools
      ) : (
        <NoItems text="No Pools" />
      )}
    </div>
  );
}

export default PoolData;

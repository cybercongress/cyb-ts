/* eslint-disable no-restricted-syntax */
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import BigNumber from 'bignumber.js';
import useSetActiveAddress from 'src/hooks/useSetActiveAddress';
import { useSelector } from 'react-redux';
import useGetTotalSupply from 'src/hooks/useGetTotalSupply';
import { NoItems, MainContainer } from 'src/components';
import usePoolListInterval from 'src/hooks/usePoolListInterval';
import { PoolsInfo, PoolCard } from './pool';
import { getBalances } from '../teleport/hooks';
import styles from './pool/styles.scss';
import useGetMySharesInPools from './hooks/useGetMySharesInPools';
import usePoolsAssetAmount from './hooks/usePoolsAssetAmount';
import useWarpDexTickers from 'src/hooks/useGetWarpPools';

function WarpDashboardPools() {
  const { defaultAccount } = useSelector((state) => state.pocket);
  const { vol24 } = useWarpDexTickers();
  const data = usePoolListInterval();
  const { poolsData, totalCap } = usePoolsAssetAmount(data);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const { liquidBalances: accountBalances } = getBalances(addressActive);
  const { myCap } = useGetMySharesInPools(accountBalances);
  const { totalSupplyAll } = useGetTotalSupply();

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
            totalSupplyData={totalSupplyAll}
            accountBalances={accountBalances}
          />
        );
      });
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolsData]);

  return (
    <MainContainer width="85%">
      <div className={styles.PoolDataContainer}>
        <PoolsInfo
          myCap={myCap}
          totalCap={totalCap}
          useMyProcent={useMyProcent}
          vol24={vol24}
        />
        {Object.keys(itemsPools).length > 0 ? (
          itemsPools
        ) : (
          <NoItems text="No Pools" />
        )}
      </div>
    </MainContainer>
  );
}

export default WarpDashboardPools;

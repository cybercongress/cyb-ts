/* eslint-disable no-restricted-syntax */
import { useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import BigNumber from 'bignumber.js';
import useSetActiveAddress from 'src/hooks/useSetActiveAddress';
import { useSelector } from 'react-redux';
import useGetTotalSupply from 'src/hooks/useGetTotalSupply';
import { NoItems, MainContainer, LinkWindow } from 'src/components';
import usePoolListInterval from 'src/hooks/usePoolListInterval';
import useWarpDexTickers from 'src/hooks/useGetWarpPools';
import { Coin } from '@cosmjs/launchpad';
import useGetBalances from 'src/hooks/getBalances';
import { PoolsInfo, PoolCard } from './pool';
import styles from './pool/styles.module.scss';
import useGetMySharesInPools from './hooks/useGetMySharesInPools';
import usePoolsAssetAmount from './hooks/usePoolsAssetAmount';
import Loader2 from 'src/components/ui/Loader2';
import { useAdviser } from 'src/features/adviser/context';

function WarpDashboardPools() {
  const { defaultAccount } = useSelector((state) => state.pocket);
  const { vol24Total, vol24ByPool } = useWarpDexTickers();
  const data = usePoolListInterval();
  const { poolsData, totalCap, loading } = usePoolsAssetAmount(data);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const { liquidBalances: accountBalances } = useGetBalances(addressActive);
  const { myCap } = useGetMySharesInPools(accountBalances);
  const { totalSupplyAll } = useGetTotalSupply();

  const { setAdviser } = useAdviser();

  useEffect(() => {
    if (loading) {
      setAdviser('loading...', 'yellow');
    } else {
      setAdviser(
        <span>
          warp is power dex for all things cyber.{' '}
          <LinkWindow to="https://api.warp-dex.cyb.ai/docs">
            api docs
          </LinkWindow>
        </span>
      );
    }
  }, [setAdviser, loading]);

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
        let vol24: Coin | undefined;

        if (Object.prototype.hasOwnProperty.call(vol24ByPool, item.id)) {
          vol24 = vol24ByPool[item.id];
        }

        return (
          <PoolCard
            key={keyItem}
            pool={item}
            totalSupplyData={totalSupplyAll}
            accountBalances={accountBalances}
            vol24={vol24}
          />
        );
      });
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolsData, vol24ByPool]);

  return (
    <MainContainer width="100%">
      <div className={styles.PoolDataContainer}>
        <PoolsInfo
          myCap={myCap}
          totalCap={totalCap}
          useMyProcent={useMyProcent}
          vol24={vol24Total}
        />
        {Object.keys(itemsPools).length > 0
          ? itemsPools
          : !loading && <NoItems text="No Pools" />}
      </div>
    </MainContainer>
  );
}

export default WarpDashboardPools;

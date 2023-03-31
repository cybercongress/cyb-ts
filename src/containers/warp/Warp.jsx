/* eslint-disable no-restricted-syntax */
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import BigNumber from 'bignumber.js';
import useSetActiveAddress from 'src/hooks/useSetActiveAddress';
import { connect } from 'react-redux';
import useGetTotalSupply from 'src/hooks/useGetTotalSupply';
import { NoItems } from '../../components';
import { PoolsInfo, PoolCard } from './pool';
import { getBalances, usePoolListInterval } from '../teleport/hooks';
import styles from './pool/styles.scss';
import { MainContainer } from '../portal/components';
import useGetMySharesInPools from './hooks/useGetMySharesInPools';
import usePoolsAssetAmount from './hooks/usePoolsAssetAmount';

function Warp({ defaultAccount }) {
  const { poolsData: data } = usePoolListInterval();
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

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(Warp);

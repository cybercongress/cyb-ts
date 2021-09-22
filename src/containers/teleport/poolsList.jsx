import React, { useEffect, useState, useContext } from 'react';
import { Pane } from '@cybercongress/gravity';
import { ValueImg, NoItems } from '../../components';
import { PoolItemsList } from './components';
import { formatNumber } from '../../utils/utils';

const checkValue = (obj, value) => {
  return Object.prototype.hasOwnProperty.call(obj, value);
};

const PoolInfo = ({ pool, accountBalances, totalSupply }) => {
  const [sharesToken, setSharesToken] = useState(null);

  useEffect(() => {
    setSharesToken(null);
    if (
      totalSupply !== null &&
      Object.prototype.hasOwnProperty.call(totalSupply, pool.pool_coin_denom) &&
      accountBalances !== null &&
      Object.prototype.hasOwnProperty.call(
        accountBalances,
        pool.pool_coin_denom
      )
    ) {
      const amountTotal = totalSupply[pool.pool_coin_denom];
      const amountAccountBalances = accountBalances[pool.pool_coin_denom];
      const shares = formatNumber(
        (amountAccountBalances / amountTotal) * 100,
        2
      );
      setSharesToken(shares);
    }
  }, [totalSupply, pool, accountBalances]);

  return (
    <Pane
      width="100%"
      display="flex"
      flexDirection="column"
      borderBottom="1px solid #979797"
      marginTop={10}
    >
      <Pane display="flex" alignItems="center" marginBottom={10}>
        {pool.reserve_coin_denoms.map((items) => (
          <ValueImg text={items} onlyImg />
        ))}
        <Pane marginLeft={10} fontSize="18px">
          <ValueImg text={pool.reserve_coin_denoms[0]} onlyText /> -{' '}
          <ValueImg text={pool.reserve_coin_denoms[1]} onlyText />
        </Pane>
      </Pane>
      {pool.reserve_coin_denoms.map((items) => (
        <PoolItemsList
          addressPool={pool.reserve_account_address}
          token={items}
        />
      ))}
      {sharesToken !== null && (
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          marginBottom={10}
        >
          <Pane>My shares:</Pane>
          <Pane>{sharesToken} %</Pane>
        </Pane>
      )}
    </Pane>
  );
};

function PoolsList({ poolsData, accountBalances, totalSupply, selectedTab }) {
  let poolsDataItems = [];

  if (poolsData && Object.keys(poolsData).length > 0) {
    if (selectedTab === 'sub-liquidity' && accountBalances !== null) {
      poolsDataItems = poolsData
        .filter((pool) => checkValue(accountBalances, pool.pool_coin_denom))
        .map((item) => (
          <PoolInfo
            pool={item}
            accountBalances={accountBalances}
            totalSupply={totalSupply}
          />
        ));
    } else {
      poolsDataItems = poolsData.map((item) => (
        <PoolInfo
          pool={item}
          accountBalances={accountBalances}
          totalSupply={totalSupply}
        />
      ));
    }
  }

  return (
    <>
      <Pane marginBottom={10} marginTop={50} fontSize="18px">
        Pools:
      </Pane>
      {Object.keys(poolsDataItems).length > 0 ? (
        poolsDataItems
      ) : (
        <NoItems text="No shares in pools" />
      )}
    </>
  );
}

export default React.memo(PoolsList);

/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState, useMemo } from 'react';
import { CardStatisics, LinkWindow, NoItems, Denom } from '../../components';
import { exponentialToDecimal } from '../../utils/utils';
import { PoolItemsList } from './components';
import coinDecimalsConfig from '../../utils/configToken';
import { ContainerGradient } from '../portal/components';

const styleContainer = {
  display: 'flex',
  flexDirection: 'column',
  padding: '25px',
  // alignItems: 'center',
  backgroundColor: '#000',
  minWidth: '200px',
  // maxWidth: '500px',
  boxShadow: '0 0 5px #36d6ae',
  borderRadius: '5px',
  position: 'relative',
};

const styleTitleContainer = {
  display: 'flex',
  marginBottom: '20px',
  alignItems: 'center',
};

const styleContainerImg = {
  display: 'flex',
  justifyContent: 'center',
};

const styleTitleDenomContainer = {
  display: 'flex',
  fontWeight: '600',
  fontSize: '18px',
  color: '#fff',
};

const styleAmountPoolContainer = {
  borderBottom: '1px solid #ffffff6e',
};

const styleTitleAmountPoolContainer = {
  fontWeight: '600',
  color: '#ffffffb3',
  marginBottom: '6px',
  display: 'inline-block',
};

const styleMySharesContainer = {
  marginTop: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const inactiveStyle = {
  position: 'absolute',
  right: '0px',
  marginRight: '10px',
  color: 'rgb(255, 145, 0)',
  fontSize: '18px',
  top: '0',
  marginTop: '10px',
};

const TitlePool = ({ pool, useInactive }) => (
  <>
    <div style={{ display: 'flex', gap: '10px' }}>
      <div style={styleContainerImg}>
        <Denom
          size={30}
          denomValue={pool.reserve_coin_denoms[0]}
          onlyImg
          zIndexImg={1}
        />
        <Denom
          size={30}
          denomValue={pool.reserve_coin_denoms[1]}
          onlyImg
          marginContainer="0px 0px 0px -8px"
        />
      </div>
      <div>
        <div
          style={{
            fontSize: '16px',
            color: '#ffffffb3',
            fontWeight: 600,
          }}
        >
          Pool #{pool.id}
        </div>
        <div style={styleTitleDenomContainer}>
          <Denom denomValue={pool.reserve_coin_denoms[0]} onlyText />/
          <Denom denomValue={pool.reserve_coin_denoms[1]} onlyText />
        </div>
      </div>
      {useInactive && <div style={inactiveStyle}>inactive</div>}
    </div>
  </>
);

const PoolCard = ({ pool, totalSupplyData, accountBalances }) => {
  const [sharesToken, setSharesToken] = useState(null);

  useEffect(() => {
    setSharesToken(null);
    if (
      totalSupplyData !== null &&
      Object.prototype.hasOwnProperty.call(
        totalSupplyData,
        pool.pool_coin_denom
      ) &&
      accountBalances !== null &&
      Object.prototype.hasOwnProperty.call(
        accountBalances,
        pool.pool_coin_denom
      )
    ) {
      const amountTotal = totalSupplyData[pool.pool_coin_denom];
      const amountAccountBalances = accountBalances[pool.pool_coin_denom];
      const procent = (amountAccountBalances / amountTotal) * 100;
      const shares = exponentialToDecimal(procent.toPrecision(2));
      setSharesToken(shares);
    }
  }, [totalSupplyData, pool, accountBalances]);

  const useInactive = useMemo(() => {
    try {
      const { reserve_coin_denoms: reserveCoinDenoms } = pool;
      if (reserveCoinDenoms && Object.keys(reserveCoinDenoms).length > 0) {
        for (const key in reserveCoinDenoms) {
          if (Object.hasOwnProperty.call(reserveCoinDenoms, key)) {
            const item = reserveCoinDenoms[key];
            if (item.includes('ibc')) {
              if (
                !Object.prototype.hasOwnProperty.call(coinDecimalsConfig, item)
              ) {
                return true;
              }
            }
          }
        }
      }

      return false;
    } catch (error) {
      console.log('error', error);
      return false;
    }
  }, [pool]);

  // console.log('useInactive', useInactive)

  return (
    <ContainerGradient
      togglingDisable
      userStyleContent={{ minHeight: '150px' }}
      title={<TitlePool useInactive={useInactive} pool={pool} />}
    >
      <div>
        {pool.reserve_coin_denoms.map((items) => (
          <>
            <PoolItemsList
              addressPool={pool.reserve_account_address}
              token={items}
            />
          </>
        ))}
      </div>
      {sharesToken !== null && (
        <div style={styleMySharesContainer}>
          <div style={styleTitleAmountPoolContainer}>My shares</div>
          <div>{sharesToken} %</div>
        </div>
      )}
    </ContainerGradient>
  );
};

const stylePoolDataContainer = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,270px), 1fr))',
  gridGap: '50px',
  margin: '0 auto',
  width: '100%',
};

function PoolData({ data, totalSupplyData, accountBalances }) {
  let itemsPools = [];

  if (data && Object.keys(data).length > 0) {
    itemsPools = data.map((item) => (
      <PoolCard
        key={item.id}
        pool={item}
        totalSupplyData={totalSupplyData}
        accountBalances={accountBalances}
      />
    ));
  }

  return (
    <div style={stylePoolDataContainer}>
      {Object.keys(itemsPools).length > 0 ? (
        itemsPools
      ) : (
        <NoItems text="No Pools" />
      )}
    </div>
  );
}

export default PoolData;

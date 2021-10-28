import React, { useEffect, useState } from 'react';
import { CardStatisics, LinkWindow, Dots, ValueImg } from '../../components';
import { exponentialToDecimal } from '../../utils/utils';
import { PoolItemsList } from './components';

// const test = [
//   {
//     id: '1',
//     typeId: 1,
//     reserveCoinDenoms: ['boot', 'hydrogen'],
//     reserveAccountAddress: 'bostrom1wrtkzr96362ty7ad0qrwhkpx743xcjrtv7j2cw',
//     poolCoinDenom:
//       'pool70D7610CBA8E94B27BAD7806EBD826F5626C486BBF5C490D1463D72314353C66',
//   },
//   // {
//   //   id: '2',
//   //   typeId: 1,
//   //   reserveCoinDenoms: ['boot', 'milliampere'],
//   //   reserveAccountAddress: 'bostrom1wrtkzr96362ty7ad0qrwhkpx743xcjrtv7j2cw',
//   //   poolCoinDenom:
//   //     'pool70D7610CBA8E94B27BAD7806EBD826F5626C486BBF5C490D1463D72314353C66',
//   // },
//   // {
//   //   id: '3',
//   //   typeId: 1,
//   //   reserveCoinDenoms: ['hydrogen', 'millivolt'],
//   //   reserveAccountAddress: 'bostrom1wrtkzr96362ty7ad0qrwhkpx743xcjrtv7j2cw',
//   //   poolCoinDenom:
//   //     'pool70D7610CBA8E94B27BAD7806EBD826F5626C486BBF5C490D1463D72314353C66',
//   // },
// ];

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
};

const styleTitleContainer = {
  display: 'flex',
  marginBottom: '20px',
  alignItems: 'center',
};

const styleContainerImg = {
  padding: '5px',
  marginRight: '20px',
};

const styleTitleDenomContainer = {
  fontWeight: '600',
  color: '#ffffffb3',
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

  return (
    <div style={styleContainer}>
      <div style={styleTitleContainer}>
        <div style={styleContainerImg}>
          <ValueImg
            size={30}
            text={pool.reserve_coin_denoms[0]}
            onlyImg
            zIndexImg={1}
          />
          <ValueImg
            size={30}
            text={pool.reserve_coin_denoms[1]}
            onlyImg
            marginContainer="0px 0px 0px -8px"
          />
        </div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 600, marginBottom: 5 }}>
            Pool #{pool.id}
          </div>
          <div style={styleTitleDenomContainer}>
            <ValueImg text={pool.pool_coin_denom[0]} onlyText />/
            <ValueImg text={pool.pool_coin_denom[1]} onlyText />
          </div>
        </div>
      </div>
      <div style={sharesToken !== null ? styleAmountPoolContainer : {}}>
        <span style={styleTitleAmountPoolContainer}>Total amount</span>
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
    </div>
  );
};

const stylePoolDataContainer = {
  display: 'grid',
  // gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,320px), 1fr))',
  gridGap: '25px',
  margin: '0 auto',
  width: '60%',
};

function PoolData({ data, totalSupplyData, accountBalances }) {
  let itemsPools = [];

  if (Object.keys(data).length > 0) {
    itemsPools = data.map((item) => (
      <PoolCard
        key={item.id}
        pool={item}
        totalSupplyData={totalSupplyData}
        accountBalances={accountBalances}
      />
    ));
  }

  return <div style={stylePoolDataContainer}>{itemsPools}</div>;
}

export default PoolData;

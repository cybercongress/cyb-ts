import React, { useMemo } from 'react';
import { Pane } from '@cybercongress/gravity';
import BigNumber from 'bignumber.js';
import { TokenSetter } from './components';
import { Denom } from '../../components';
import { exponentialToDecimal, formatNumber } from '../../utils/utils';
import { ButtonIcon } from './components/slider';
import { getCoinDecimals } from './utils';

const imgSwap = require('../../image/exchange-arrows.svg');

// return (
//   <>
//     <div style={{ display: 'flex' }}>
//       1<Denom marginContainer="0px 0px 0px 3px" denomValue={tokenA} /> =
//       <div style={{ whiteSpace: 'nowrap' }}>
//         {price % 10 > 0
//           ? formatNumber(Math.floor(price))
//           : exponentialToDecimal(price.toPrecision(3))}
//       </div>
//       <Denom denomValue={tokenB} />
//     </div>
//     <div style={{ display: 'flex' }}>
//       1<Denom marginContainer="0px 0px 0px 3px" denomValue={tokenB} /> =
//       <div style={{ whiteSpace: 'nowrap' }}>
//         {reversePrice % 10 > 0
//           ? formatNumber(Math.floor(reversePrice))
//           : exponentialToDecimal(reversePrice.toPrecision(3))}
//       </div>
//       <Denom denomValue={tokenA} />
//     </div>
//   </>
// );

function Swap({ stateSwap, swap }) {
  const {
    accountBalances,
    totalSupply,
    tokenB,
    setTokenB,
    tokenBAmount,
    tokenA,
    setTokenA,
    tokenAAmount,
    amountChangeHandler,
    tokenChange,
    tokenAPoolAmount,
    tokenBPoolAmount,
    swapPrice,
  } = stateSwap;

  const getTokenPrice = useMemo(() => {
    if (tokenAPoolAmount > 0 && tokenBPoolAmount > 0) {
      const price = swapPrice;
      return (
        <div
          style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}
        >
          <div style={{ whiteSpace: 'nowrap' }}>
            {price >= 1
              ? formatNumber(price)
              : exponentialToDecimal(price.toPrecision(3))}
          </div>
          <Denom marginContainer="0px 0px 0px 3px" denomValue={tokenA} /> /{' '}
          <Denom denomValue={tokenB} />
        </div>
      );
    }
    return <span> </span>;
  }, [swapPrice]);

  return (
    <Pane
      maxWidth="390px"
      height="500px"
      display="flex"
      alignItems="center"
      flexDirection="column"
    >
      <TokenSetter
        id="tokenAAmount"
        accountBalances={accountBalances}
        totalSupply={totalSupply}
        selected={tokenB}
        token={tokenA}
        onChangeSelect={setTokenA}
        onChangeInput={amountChangeHandler}
        valueInput={tokenAAmount}
        textLeft={swap ? 'Sell' : ''}
      />
      {/* <Slider
        id="tokenAAmount"
        tokenA={tokenA}
        tokenB={tokenB}
        tokenAAmount={tokenAAmount}
        accountBalances={accountBalances}
      /> */}
      <ButtonIcon
        onClick={() => tokenChange()}
        img={imgSwap}
        style={{
          position: 'relative',
          top: 0,
          transform: 'unset',
          left: 0,
        }}
      />
      <TokenSetter
        id="tokenBAmount"
        accountBalances={accountBalances}
        totalSupply={totalSupply}
        token={tokenB}
        selected={tokenA}
        onChangeSelect={setTokenB}
        onChangeInput={amountChangeHandler}
        valueInput={tokenBAmount}
        textLeft={swap ? 'Buy' : ''}
        readonly="readonly"
      />
      <Pane
        display="flex"
        justifyContent="space-between"
        width="100%"
        flexDirection="row"
        alignItems="flex-end"
        marginTop={20}
      >
        <div>Rate:</div>
        <div>{getTokenPrice}</div>
      </Pane>
      <Pane
        display="flex"
        justifyContent="space-between"
        width="100%"
        flexDirection="row"
        alignItems="flex-end"
        marginTop={10}
      >
        <div>Swap Fees:</div>
        <div>0.3%</div>
      </Pane>
    </Pane>
  );
}

export default React.memo(Swap);

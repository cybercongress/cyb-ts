import React, { useMemo } from 'react';
import { Pane } from '@cybercongress/gravity';
import { TokenSetter } from './components';
import { Denom } from '../../components';
import { exponentialToDecimal, formatNumber } from '../../utils/utils';
import { ButtonIcon } from './components/slider';

const imgSwap = require('../../image/exchange-arrows.svg');

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
    swapPrice,
    tokenChange,
    tokenAPoolAmount,
    tokenBPoolAmount,
  } = stateSwap;

  const getTokenPrice = useMemo(() => {
    let price = 0;
    let reversePrice = 0;
    if (tokenAPoolAmount > 0 && tokenBPoolAmount > 0) {
      let orderPrice = 0;
      if ([tokenA, tokenB].sort()[0] !== tokenA) {
        orderPrice =
          (Number(tokenBPoolAmount) / Number(tokenAPoolAmount)) * 0.97;
        price = orderPrice;
        reversePrice = 1 / orderPrice;
      } else {
        orderPrice =
          (Number(tokenAPoolAmount) / Number(tokenBPoolAmount)) * 1.03;
        reversePrice = orderPrice;
        price = 1 / orderPrice;
      }
      return (
        <>
          <div style={{ display: 'flex' }}>
            1<Denom marginContainer="0px 0px 0px 3px" denomValue={tokenA} /> =
            <div style={{ whiteSpace: 'nowrap' }}>
              {price % 10 > 0
                ? formatNumber(Math.floor(price))
                : exponentialToDecimal(price.toPrecision(3))}
            </div>
            <Denom denomValue={tokenB} />
          </div>
          <div style={{ display: 'flex' }}>
            1<Denom marginContainer="0px 0px 0px 3px" denomValue={tokenB} /> =
            <div style={{ whiteSpace: 'nowrap' }}>
              {reversePrice % 10 > 0
                ? formatNumber(Math.floor(reversePrice))
                : exponentialToDecimal(reversePrice.toPrecision(3))}
            </div>
            <Denom denomValue={tokenA} />
          </div>
        </>
      );
    }
    return <span> </span>;
  }, [tokenAPoolAmount, tokenBPoolAmount, tokenA, tokenB]);

  const getSwapFees = useMemo(() => {
    if (swapPrice && swapPrice !== Infinity) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex' }}>
            <div>{Math.floor(tokenAAmount * 0.0015)}</div>
            <Denom marginContainer="0px 0px 0px 3px" denomValue={tokenA} />
          </div>
          <div style={{ display: 'flex' }}>
            <div>{Math.floor(tokenBAmount * 0.0015)}</div>
            <Denom marginContainer="0px 0px 0px 3px" denomValue={tokenB} />
          </div>
        </div>
      );
    }
    return <span> </span>;
  }, [tokenAAmount, tokenBAmount, swapPrice]);

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
      />
      <Pane
        display="flex"
        justifyContent="flex-end"
        width="100%"
        flexDirection="column"
        alignItems=" flex-end"
      >
        <div>Rate:</div>
        <div>{getTokenPrice}</div>
      </Pane>
      <Pane
        display="flex"
        justifyContent="flex-end"
        width="100%"
        flexDirection="column"
        alignItems=" flex-end"
        marginTop={10}
      >
        <div>Swap Fees:</div>
        <div>{getSwapFees}</div>
      </Pane>
    </Pane>
  );
}

export default React.memo(Swap);

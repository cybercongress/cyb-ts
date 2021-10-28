import React, { useMemo } from 'react';
import { Pane } from '@cybercongress/gravity';
import { TokenSetter } from './components';
import { ValueImg } from '../../components';
import { exponentialToDecimal } from '../../utils/utils';
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
    tokenAPoolAmount,
    tokenBPoolAmount,
    tokenChange,
  } = stateSwap;

  const getTokenPrice = useMemo(() => {
    const price = tokenAPoolAmount / tokenBPoolAmount;
    if (price && price !== Infinity) {
      return (
        <span>
          {exponentialToDecimal(price.toPrecision(3))}{' '}
          <ValueImg text={tokenA} /> / <ValueImg text={tokenB} />
        </span>
      );
    }
    return <span> </span>;
  }, [tokenAPoolAmount, tokenBPoolAmount]);

  const getSwapFees = useMemo(() => {
    const price = tokenAAmount / tokenBAmount;
    if (price && price !== Infinity) {
      return (
        <span>
          {Math.floor(tokenAAmount * 0.0015)} <ValueImg text={tokenA} /> <br />{' '}
          {Math.floor(tokenBAmount * 0.0015)} <ValueImg text={tokenB} />
        </span>
      );
    }
    return <span> </span>;
  }, [tokenAAmount, tokenBAmount]);

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
        <div>Price:</div>
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

import React from 'react';
import { Pane } from '@cybercongress/gravity';
import { TokenSetter } from './components';
import { ButtonIcon, ValueImg } from '../../components';

const imgSwap = require('../../image/swap-horizontal.svg');

function Swap({ stateSwap, text }) {
  const {
    accountBalances,
    tokenB,
    setTokenB,
    tokenBAmount,
    tokenA,
    setTokenA,
    tokenAAmount,
    amountChangeHandler,
    tokenAPoolAmount,
    tokenBPoolAmount,
    tokenPrice,
    tokenChange,
  } = stateSwap;

  const getTokenPrice = (a, b, priceToken) => {
    if (priceToken === null) {
      const price = b / a;
      if (price && price !== Infinity) {
        return (
          <span>
            {parseFloat(price.toFixed(6))} <ValueImg text={tokenA} /> /{' '}
            <ValueImg text={tokenB} />
          </span>
        );
      }
    } else {
      return (
        <span>
          {parseFloat(priceToken.toFixed(6))} <ValueImg text={tokenA} /> /{' '}
          <ValueImg text={tokenB} />
        </span>
      );
    }
  };

  function getSwapFees(a, b) {
    const price = b / a;
    if (price && price !== Infinity) {
      return (
        <span>
          {Math.floor(a * 0.0015)} <ValueImg text={tokenA} /> <br />{' '}
          {Math.floor(b * 0.0015)} <ValueImg text={tokenB} />
        </span>
      );
    }
  }

  return (
    <Pane
      maxWidth="390px"
      display="flex"
      alignItems="center"
      flexDirection="column"
    >
      <TokenSetter
        id="tokenAAmount"
        accountBalances={accountBalances}
        selected={tokenB}
        token={tokenA}
        onChangeSelect={setTokenA}
        onChangeInput={amountChangeHandler}
        valueInput={tokenAAmount}
        textLeft={text ? 'Sell' : ''}
      />
      <ButtonIcon
        onClick={() => tokenChange()}
        // active={selectMethod === 'ledger'}
        placement="left"
        img={imgSwap}
        text="reverse"
        style={{ transform: 'rotate(90deg)' }}
      />
      <TokenSetter
        id="tokenBAmount"
        accountBalances={accountBalances}
        token={tokenB}
        selected={tokenA}
        onChangeSelect={setTokenB}
        onChangeInput={amountChangeHandler}
        valueInput={tokenBAmount}
        textLeft={text ? 'Buy' : ''}
      />
      {/* <Pane
        display="flex"
        justifyContent="flex-end"
        width="100%"
        flexDirection="column"
        alignItems=" flex-end"
      >
        <div>Price:</div>
        <div>
          {getTokenPrice(tokenAPoolAmount, tokenBPoolAmount, tokenPrice)}
        </div>
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
        <div>{getSwapFees(tokenAAmount, tokenBAmount)}</div>
      </Pane> */}
    </Pane>
  );
}

export default Swap;

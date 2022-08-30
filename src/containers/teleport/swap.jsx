import React, { useMemo } from 'react';
import { Pane } from '@cybercongress/gravity';
import BigNumber from 'bignumber.js';
import { TokenSetter } from './components';
import { Denom } from '../../components';
import { exponentialToDecimal, formatNumber } from '../../utils/utils';
import { ButtonIcon, Slider } from './components/slider';
import GetTxs from "./components/txHistory/tx";
//import { getCoinDecimals } from './utils';

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
    networkA,
    setNetworkA,
    networkB,
    setNetworkB,
    typeTxs,
    balanceIbc,
    denomIbc,
    setPercentageBalanceHook,
    networks,
    tokens,
    addressActive,
  } = stateSwap;



  const getTokenPrice = useMemo(() => {
    if (tokenAPoolAmount > 0 && tokenBPoolAmount > 0
        && tokens
        && Object.prototype.hasOwnProperty.call(tokens, tokenA)
        && Object.prototype.hasOwnProperty.call(tokens, tokenB)) { // Skip unknown tokens
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
          <Denom marginContainer="0px 0px 0px 3px" denomData={tokens[tokenA]} denomValue={tokenA} /> /{' '}
          <Denom denomData={tokens[tokenB]} denomValue={tokenB} />
        </div>
      );
    }
    return <span> N/A</span>;
  }, [swapPrice]);

  const getTextSellSend = useMemo(() => {
    if (swap) {
      if (typeTxs === 'swap') {
        return 'sell';
      }
      return 'send';
    }
    return 'add';
  }, [typeTxs, swap]);

  const getTextToBuy = useMemo(() => {
    if (swap) {
      if (typeTxs === 'swap') {
        return 'buy';
      }
      return 'to';
    }
    return 'add';
  }, [typeTxs, swap]);


  return (
    <Pane
      maxWidth="390px"
      width="375px"
      height="500px"
      display="flex"
      alignItems="center"
      flexDirection="column"
      gridGap="10px"
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
        textLeft={getTextSellSend}
        selectedNetwork={networkA}
        onChangeSelectNetwork={setNetworkA}
        typeTxs={typeTxs}
        denomIbc={denomIbc}
        // ibc={typeTxs !== 'swap'}
        balanceIbc={balanceIbc}
        ibc={typeTxs === 'deposit'}
        swap={swap}
        networks={networks}
        tokens={tokens}
      />
      <Slider
        id="tokenAAmount"
        tokenA={tokenA}
        tokenB={tokenB}
        tokenAAmount={tokenAAmount}
        accountBalances={accountBalances}
        setPercentageBalanceHook={setPercentageBalanceHook}
        coinReverseAction={tokenChange}
      />
      {/* <ButtonIcon
        onClick={() => tokenChange()}
        img={imgSwap}
        style={{
          position: 'relative',
          top: 0,
          transform: 'unset',
          left: 0,
        }}
      /> */}
      <TokenSetter
        id="tokenBAmount"
        accountBalances={accountBalances}
        totalSupply={totalSupply}
        token={tokenB}
        selected={tokenA}
        onChangeSelect={setTokenB}
        onChangeInput={amountChangeHandler}
        valueInput={tokenBAmount}
        textLeft={getTextToBuy}
        readonly="readonly"
        selectedNetwork={networkB}
        onChangeSelectNetwork={setNetworkB}
        typeTxs={typeTxs}
        ibcTokenB={typeTxs !== 'swap'}
        swap={swap}
        networks={networks}
        tokens={tokens}
      />
      {typeTxs === 'swap' && swap && (
        <>
          <Pane
            display="flex"
            justifyContent="space-between"
            width="100%"
            flexDirection="row"
            alignItems="flex-end"
            marginTop={30}
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

          <Pane
              display="flex"
              justifyContent="space-between"
              width="100%"
              flexDirection="row"
              alignItems="flex-end"
              marginTop={10}
          >
          { addressActive ? <GetTxs accountUser={addressActive.bech32}  /> : ''}
          </Pane>
        </>
      )}
    </Pane>
  );
}

export default React.memo(Swap);

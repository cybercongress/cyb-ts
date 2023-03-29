import React, { useMemo } from 'react';
import { Pane } from '@cybercongress/gravity';
import { TokenSetter } from './components';
import { DenomArr } from '../../components';
import { exponentialToDecimal, formatNumber } from '../../utils/utils';
import { ButtonIcon } from './components/slider';
import { networkList } from './utils';

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

function Swap({ stateSwap, swap, amountChangeHandler, ...props }) {
  const {
    accountBalances,
    totalSupply,
    tokenB,
    setTokenB,
    tokenBAmount,
    tokenA,
    setTokenA,
    tokenAAmount,
    tokenChange,
    tokenAPoolAmount,
    tokenBPoolAmount,
    swapPrice,
    networkA,
    onChangeSelectNetworksA,
    onChangeSelectNetworksB,
    networkB,
    typeTxs,
    balanceIbc,
    denomIbc,
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
          <DenomArr marginContainer="0px 0px 0px 3px" denomValue={tokenA} /> /{' '}
          <DenomArr denomValue={tokenB} />
        </div>
      );
    }
    return <span> </span>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const ListNetworkB = useMemo(() => {
    if (networkA === 'bostrom') {
      const reduceData = { ...networkList };

      delete reduceData[networkB];
      return reduceData;
    }
    return { bostrom: 'bostrom' };
  }, [networkA, networkB]);

  const ListNetworkA = useMemo(() => {
    if (networkB === 'bostrom') {
      const reduceData = { ...networkList };

      delete reduceData[networkA];
      return reduceData;
    }
    return { bostrom: 'bostrom' };
  }, [networkB, networkA]);

  return (
    <Pane
      maxWidth="390px"
      width="375px"
      height="500px"
      display="flex"
      alignItems="center"
      flexDirection="column"
      gridGap="10px"
      {...props}
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
        onChangeSelectNetwork={onChangeSelectNetworksA}
        typeTxs={typeTxs}
        denomIbc={denomIbc}
        // ibc={typeTxs !== 'swap'}
        balanceIbc={balanceIbc}
        ibc={typeTxs === 'deposit'}
        swap={swap}
        network={ListNetworkA}
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
        textLeft={getTextToBuy}
        selectedNetwork={networkB}
        onChangeSelectNetwork={onChangeSelectNetworksB}
        typeTxs={typeTxs}
        ibcTokenB={typeTxs !== 'swap'}
        swap={swap}
        network={ListNetworkB}
      />
      {typeTxs === 'swap' && swap && (
        <>
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
        </>
      )}
    </Pane>
  );
}

export default React.memo(Swap);

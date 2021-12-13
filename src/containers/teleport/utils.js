import { formatNumber, convertResources } from '../../utils/utils';

export function sortReserveCoinDenoms(x, y) {
  return [x, y].sort();
}

export function getDepositCoins(denoms, amounts) {
  return {
    denoms: [denoms[0], denoms[1]],
    amounts: [amounts[denoms[0]], amounts[denoms[1]]],
  };
}

export function getMyTokenBalance(token, indexer) {
  if (indexer === null) {
    return `My Balance: 0`;
  }
  const balance = Number(Number(indexer[token])).toFixed(2);
  if (balance !== 'NaN') {
    return `My Balance: ${balance}`;
  }
  return `My Balance: 0`;
}

export function calculateCounterPairAmount(e, state, type) {
  const inputAmount = e.target.value;

  let price = null;
  let counterPairAmount = 0;
  let counterPair = '';

  if (state.tokenAPoolAmount > 0 && state.tokenBPoolAmount > 0) {
    if (type === 'swap') {
      const swapFeeRatio = 0.9985; // ultimaetly get params
      let swapPrice = null;

      if (e.target.id === 'tokenAAmount') {
        swapPrice = state.tokenAPoolAmount / state.tokenBPoolAmount;

        counterPairAmount = Math.floor(
          (inputAmount / swapPrice) * swapFeeRatio
        );

        console.log('From');
        console.log('swapPrice', swapPrice);
        console.log('counterPairAmount', counterPairAmount);
      } else {
        swapPrice = state.tokenBPoolAmount / state.tokenAPoolAmount;
        counterPairAmount = Math.floor(inputAmount / swapFeeRatio / swapPrice);

        console.log('To');
        console.log('swapPrice', swapPrice);
        console.log('counterPairAmount', counterPairAmount);
      }

      price = 1 / swapPrice;
    } else {
      if (e.target.id === 'tokenAAmount') {
        price = state.tokenBPoolAmount / state.tokenAPoolAmount;
        counterPair = 'tokenBAmount';
        counterPairAmount = inputAmount * price;
      } else {
        price = state.tokenAPoolAmount / state.tokenBPoolAmount;
        counterPair = 'tokenAAmount';
        counterPairAmount = inputAmount * price;
      }
      counterPairAmount = Math.floor(counterPairAmount);
    }
  }

  return {
    price,
    counterPair,
    counterPairAmount,
  };
}

export function calculateSlippage(swapAmount, poolReserve) {
  let slippage = (2 * swapAmount) / poolReserve;

  if (slippage > 0.997) {
    slippage = 0.997;
  }

  return slippage;
}

export const reduceAmounToken = (amount, token, reverse) => {
  let amountReduce = amount;

  if (token === 'millivolt' || token === 'milliampere') {
    if (reverse) {
      amountReduce = amount * 10 ** 3;
    } else {
      amountReduce = amount * 10 ** -3;
    }
  }

  return amountReduce;
};

export const reduceTextCoin = (text) => {
  switch (text) {
    case 'millivolt':
      return 'V';

    case 'milliampere':
      return 'A';

    case 'hydrogen':
      return 'H';

    case 'boot':
      return 'BOOT';

    default:
      return text;
  }
};

export function getPoolToken(pool, myPoolTokens) {
  const myPools = [];
  pool.forEach((item) => {
    if (
      Object.prototype.hasOwnProperty.call(myPoolTokens, item.pool_coin_denom)
    ) {
      const myTokenAmount = myPoolTokens[item.pool_coin_denom];
      myPools.push({
        coinDenom: `${reduceTextCoin(
          item.reserve_coin_denoms[0]
        )}-${reduceTextCoin(item.reserve_coin_denoms[1])}`,
        reserveCoinDenoms: [
          item.reserve_coin_denoms[0],
          item.reserve_coin_denoms[1],
        ],
        poolCoinDenom: item.pool_coin_denom,
        myTokenAmount,
        id: item.id,
      });
    }
  });

  return myPools;
}

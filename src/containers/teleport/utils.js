import BigNumber from 'bignumber.js';
import { formatNumber, convertResources } from '../../utils/utils';
import coinDecimalsIbc from './configToken';

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

  const price = null;
  let counterPairAmount = 0;
  const counterPair = '';

  if (state.tokenAPoolAmount > 0 && state.tokenBPoolAmount > 0) {
    const { tokenA, tokenB, tokenAPoolAmount, tokenBPoolAmount } = state;
    const poolAmountA = new BigNumber(Number(tokenAPoolAmount));
    const poolAmountB = new BigNumber(Number(tokenBPoolAmount));
    let swapPrice = null;
    if ([tokenA, tokenB].sort()[0] === tokenA) {
      swapPrice = poolAmountB.dividedBy(poolAmountA).toNumber();
    } else {
      swapPrice = poolAmountB.dividedBy(poolAmountA).toNumber();
    }
    counterPairAmount = Math.floor(inputAmount * swapPrice);

    // const swapFeeRatio = 0.9985; // ultimaetly get params

    // swapPrice = state.tokenAPoolAmount / state.tokenBPoolAmount;

    // counterPairAmount = Math.floor((inputAmount / swapPrice) * swapFeeRatio);

    console.log('From');
    console.log('swapPrice', swapPrice);
    console.log('counterPairAmount', counterPairAmount);
  }

  return {
    price,
    counterPair,
    counterPairAmount,
  };
}

function pow(a) {
  let result = 1;
  for (let i = 0; i < a; i++) {
    result *= 10;
  }
  return result;
}

const decFnc = (number, dec, reverse) => {
  let amount = number;

  if (reverse) {
    if (dec > 0) {
      amount = parseFloat(number) * pow(dec);
    }
  } else if (dec > 0) {
    amount = parseFloat(number) / pow(dec);
  }
  return amount;
};

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

  if (token.includes('ibc')) {
    if (Object.prototype.hasOwnProperty.call(coinDecimalsIbc, token)) {
      const { coinDecimals } = coinDecimalsIbc[token];
      if (reverse) {
        amountReduce = decFnc(parseFloat(amount), coinDecimals, reverse);
      } else {
        amountReduce = decFnc(parseFloat(amount), coinDecimals, reverse);
      }
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

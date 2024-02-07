import { Pool } from '@cybercongress/cyber-js/build/codec/tendermint/liquidity/v1beta1/liquidity';
import { ObjKeyValue } from 'src/types/data';
import BigNumber from 'bignumber.js';
import { MyPoolsT } from './type';
import coinDecimalsConfig from '../../utils/configToken';

const reduceTextCoin = (text: string) => {
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

export function getPoolToken(
  pool: Pool[],
  myPoolTokens: ObjKeyValue
): MyPoolsT[] {
  const myPools: MyPoolsT[] = [];

  pool.forEach((item) => {
    if (myPoolTokens[item.poolCoinDenom]) {
      const myTokenAmount = myPoolTokens[item.poolCoinDenom];
      myPools.push({
        ...item,
        coinDenom: `${reduceTextCoin(
          item.reserveCoinDenoms[0]
        )}-${reduceTextCoin(item.reserveCoinDenoms[1])}`,
        myTokenAmount,
      });
    }
  });

  return myPools;
}

function getMyTokenBalance(token, indexer) {
  if (indexer === null) {
    return 0;
  }
  const balance = Number(Number(indexer[token])).toFixed(2);
  if (balance !== 'NaN') {
    return balance;
  }
  return 0;
}

export function getMyTokenBalanceNumber(denom: string, indexer) {
  return Number(getMyTokenBalance(denom, indexer));
}

function pow(a) {
  let result = 1;
  for (let i = 0; i < a; i++) {
    result *= 10;
  }
  return result;
}

const getCoinDecimals = (amount, token: string) => {
  let amountReduce = amount;

  if (coinDecimalsConfig[token]) {
    const { coinDecimals } = coinDecimalsConfig[token];
    if (coinDecimals) {
      amountReduce = parseFloat(amount) / pow(coinDecimals);
    }
  }
  return amountReduce;
};

const getDecimals = (denom) => {
  let decimals = 0;
  if (coinDecimalsConfig[denom]) {
    decimals = coinDecimalsConfig[denom].coinDecimals;
  }
  return decimals;
};

const getCounterPairAmount = (amount, decimals, swapPrice) => {
  const inputAmountBN = new BigNumber(amount);
  return inputAmountBN
    .dividedBy(swapPrice)
    .dp(decimals, BigNumber.ROUND_FLOOR)
    .toNumber();
};

export function calculateCounterPairAmount(values, e, state) {
  const inputAmount = values;

  let counterPairAmount = 0;

  const { tokenAPoolAmount, tokenA, tokenBPoolAmount, tokenB } = state;

  const poolAmountA = new BigNumber(
    getCoinDecimals(Number(tokenAPoolAmount), tokenA)
  );
  const poolAmountB = new BigNumber(
    getCoinDecimals(Number(tokenBPoolAmount), tokenB)
  );

  if (
    inputAmount.length > 0 &&
    poolAmountA.comparedTo(0) > 0 &&
    poolAmountB.comparedTo(0) > 0
  ) {
    let swapPrice = null;
    let decimals = 0;

    if (e.target.id === 'tokenAAmount') {
      swapPrice = poolAmountA.dividedBy(poolAmountB);
      swapPrice = swapPrice.multipliedBy(1.03).toNumber();
      if (tokenB.length > 0) {
        decimals = getDecimals(tokenB);
      }
      counterPairAmount = getCounterPairAmount(
        inputAmount,
        decimals,
        swapPrice
      );
    } else {
      swapPrice = poolAmountB.dividedBy(poolAmountA);
      swapPrice = swapPrice.multipliedBy(0.97).toNumber();

      if (tokenA.length > 0) {
        decimals = getDecimals(tokenA);
      }
      counterPairAmount = getCounterPairAmount(
        inputAmount,
        decimals,
        swapPrice
      );
    }
  }
  return {
    counterPairAmount,
  };
}

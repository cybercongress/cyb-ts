import BigNumber from 'bignumber.js';
import { getDisplayAmount } from 'src/utils/utils';

export function sortReserveCoinDenoms(x, y) {
  return [x, y].sort();
}

export function calculatePairAmount(inputAmount: string | number, state) {
  const {
    tokenB,
    tokenA,
    tokenBPoolAmount,
    tokenAPoolAmount,
    coinDecimalsA,
    coinDecimalsB,
    isReverse,
  } = state;

  let counterPairAmount = new BigNumber(0);
  let swapPrice = new BigNumber(0);
  let price = new BigNumber(0);
  const feeRatio = new BigNumber(0.03);
  const swapFeeRatio = new BigNumber(1).minus(feeRatio); // TO DO get params

  const poolAmountA = new BigNumber(
    getDisplayAmount(tokenAPoolAmount, coinDecimalsA)
  );
  const poolAmountB = new BigNumber(
    getDisplayAmount(tokenBPoolAmount, coinDecimalsB)
  );

  const powA = new BigNumber(1).multipliedBy(
    new BigNumber(10).pow(coinDecimalsA)
  );
  const powB = new BigNumber(1).multipliedBy(
    new BigNumber(10).pow(coinDecimalsB)
  );

  const amount = new BigNumber(inputAmount);
  const amount2 = amount.multipliedBy(2);

  const isPoolPair = [tokenA, tokenB].sort()[0] === tokenA;

  let poolCoins: BigNumber[] = [];

  if (isPoolPair) {
    poolCoins = [poolAmountA, poolAmountB];
  } else {
    poolCoins = [poolAmountB, poolAmountA];
  }

  if ((isPoolPair && !isReverse) || (!isPoolPair && isReverse)) {
    swapPrice = poolCoins[1].dividedBy(poolCoins[0].plus(amount2));
    price = new BigNumber(1)
      .dividedBy(swapPrice)
      .dividedBy(powA)
      .dividedBy(powB);
  }

  if ((isPoolPair && isReverse) || (!isPoolPair && !isReverse)) {
    swapPrice = poolCoins[0].dividedBy(poolCoins[1].plus(amount2));
    price = new BigNumber(swapPrice).dividedBy(powA).dividedBy(powB);
  }

  if (isReverse) {
    counterPairAmount = amount
      .multipliedBy(swapPrice.multipliedBy(new BigNumber(1).plus(feeRatio)))
      .dp(coinDecimalsA, BigNumber.ROUND_FLOOR);
  } else {
    counterPairAmount = amount
      .multipliedBy(swapPrice.multipliedBy(swapFeeRatio))
      .dp(coinDecimalsB, BigNumber.ROUND_FLOOR);
  }

  return { counterPairAmount, price };
}

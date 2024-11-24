import { Coin } from '@cosmjs/stargate';
import { Validator } from '@cybercongress/cyber-ts/cosmos/staking/v1beta1/staking';
import BigNumber from 'bignumber.js';

function big(value: BigNumber.Value) {
  return new BigNumber(value);
}

function reduceDetails(
  validatorInfo: Validator,
  bondedTokens: number,
  selfDelegationCoin?: Coin,
  stakingProvisions?: string
) {
  const power = bondedTokens
    ? big(validatorInfo.tokens)
        .dividedBy(bondedTokens)
        .multipliedBy(100)
        .dp(2, BigNumber.ROUND_FLOOR)
        .toNumber()
    : undefined;

  const self = selfDelegationCoin
    ? big(selfDelegationCoin.amount)
        .dividedBy(validatorInfo.delegatorShares)
        .multipliedBy(100)
        .dp(3, BigNumber.ROUND_FLOOR)
        .toNumber()
    : undefined;

  const delegatorShares = self
    ? big(100).minus(self).dp(3, BigNumber.ROUND_FLOOR).toNumber()
    : undefined;

  const totalVotingPower = big(bondedTokens).multipliedBy(
    big(1).minus(validatorInfo.commission.commissionRates.rate)
  );

  const estimatedApr =
    bondedTokens && stakingProvisions
      ? big(stakingProvisions)
          .dividedBy(totalVotingPower)
          .multipliedBy(100)
          .dp(2, BigNumber.ROUND_FLOOR)
          .toNumber()
      : undefined;

  return {
    apr: estimatedApr,
    power,
    selfStake: self,
    delegatorStake: delegatorShares,
  };
}

export default reduceDetails;

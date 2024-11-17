import { Validator } from '@cybercongress/cyber-ts/cosmos/staking/v1beta1/staking';
import BigNumber from 'bignumber.js';
import { Coin } from '@cosmjs/stargate';
import { ValidatorTableData } from '../types/tableData';

type Options = {
  bondedTokens: number;
  delegationsData: { [key: string]: Coin };
  stakingProvisions?: string;
};

const checkRank = (percent: number): ValidatorTableData['rank'] => {
  switch (true) {
    case percent < 0.33:
      return '33';
    case percent < 0.67:
      return '67';
    default:
      return 'primary';
  }
};

function reduceValidatorData(data: Validator[], options: Options) {
  const { bondedTokens, delegationsData, stakingProvisions } = options;
  return data.reduce<{ total: number; list: ValidatorTableData[] }>(
    (acc, item, id) => {
      const { jailed, operatorAddress, tokens, commission } = item;

      acc.total = jailed
        ? acc.total
        : new BigNumber(acc.total).plus(tokens).toNumber();

      const percent = new BigNumber(acc.total)
        .dividedBy(bondedTokens)
        .toNumber();

      const delegation = delegationsData[operatorAddress] || undefined;

      const powerPercent = new BigNumber(tokens)
        .dividedBy(bondedTokens)
        .multipliedBy(100)
        .dp(2, BigNumber.ROUND_FLOOR)
        .toFixed(2);

      const totalVotingPower = new BigNumber(bondedTokens).multipliedBy(
        new BigNumber(1).minus(commission.commissionRates.rate)
      );

      const estimatedApr = stakingProvisions
        ? new BigNumber(stakingProvisions)
            .dividedBy(totalVotingPower)
            .toNumber()
        : 0;

      acc.list.push({
        ...item,
        delegation,
        id: id + 1,
        apr: estimatedApr,
        powerPercent,
        rank: jailed ? 'primary' : checkRank(percent),
      });
      return acc;
    },
    { total: 0, list: [] }
  ).list;
}

export default reduceValidatorData;

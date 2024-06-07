/* eslint-disable no-restricted-syntax */
import { Decimal } from '@cosmjs/math';
import BigNumber from 'bignumber.js';
import { useQuery } from '@tanstack/react-query';
import { getDelegatorDelegations } from 'src/utils/search/utils';
import { BECH32_PREFIX_VALOPER, BASE_DENOM } from 'src/constants/config';
import { fromBech32 } from '../../../utils/utils';
import { useStake as useVerseStake } from 'src/features/cybernet/ui/hooks/useCurrentAccountStake';

const initValue = {
  denom: BASE_DENOM,
  amount: '0',
};

export const initValueMainToken = {
  liquid: { ...initValue },
  frozen: { ...initValue },
  melting: { ...initValue },
  growth: { ...initValue },
  total: { ...initValue },
  cyberver: { ...initValue },
};

const initValueResponseFunc = (denom = '', amount = 0) => {
  return { denom, amount };
};

const getDelegationsAmount = (data) => {
  let delegationsAmount = new BigNumber(0);
  if (data.length) {
    data.forEach((itemDelegation) => {
      delegationsAmount = delegationsAmount.plus(itemDelegation.balance.amount);
    });
  }
  return initValueResponseFunc(BASE_DENOM, delegationsAmount.toString());
};

const getUnbondingAmount = (data) => {
  let unbondingAmount = new BigNumber(0);
  const { unbondingResponses } = data;
  if (unbondingResponses && Object.keys(unbondingResponses).length > 0) {
    unbondingResponses.forEach((unbond) => {
      unbond.entries.forEach((entry) => {
        unbondingAmount = unbondingAmount.plus(entry.balance);
      });
    });
  }
  return initValueResponseFunc(BASE_DENOM, unbondingAmount.toString());
};

const getRewardsAmount = (data) => {
  let rewardsAmount = new BigNumber(0);
  const { total } = data;
  if (total && total.length > 0) {
    const [{ amount }] = total;
    rewardsAmount = rewardsAmount.plus(
      Decimal.fromAtomics(amount, 18).floor().toString()
    );
  }
  return initValueResponseFunc(BASE_DENOM, rewardsAmount.toString());
};

const getCommissionAmount = (data) => {
  let commissionAmount = new BigNumber(0);

  if (data.commission.commission.length > 0) {
    const { commission } = data;
    const [{ amount }] = commission.commission;
    commissionAmount = commissionAmount.plus(
      Decimal.fromAtomics(amount, 18).floor().toString()
    );
  }
  return initValueResponseFunc(BASE_DENOM, commissionAmount.toString());
};

export const useGetBalance = (client, addressBech32) => {
  // seems combine to 1 hook
  const s1 = useVerseStake({
    address: addressBech32,
    contractAddress:
      'pussy1j9qku20ssfjdzgl3y5hl0vfxzsjwzwn7d7us2t2n4ejgc6pesqcqhnxsz0',
  });

  const s2 = useVerseStake({
    address: addressBech32,
    contractAddress:
      'pussy1guj27rm0uj2mhwnnsr8j7cz6uvsz2d759kpalgqs60jahfzwgjcs4l28cw',
  });

  const total1 = s1.data?.reduce((acc, { stake }) => acc + stake, 0) || 0;
  const total2 = s2.data?.reduce((acc, { stake }) => acc + stake, 0) || 0;
  const totalCyberver = total1 + total2;

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, isFetching } = useQuery(
      ['getBalance', addressBech32],
      async () => {
        const responsegetBalance = await client.getBalance(
          addressBech32,
          BASE_DENOM
        );

        const responsedelegatorDelegations = await getDelegatorDelegations(
          client,
          addressBech32
        );

        const delegationsAmount = getDelegationsAmount(
          responsedelegatorDelegations
        );

        const responsedelegatorUnbondingDelegations =
          await client.delegatorUnbondingDelegations(addressBech32);

        const unbondingAmount = getUnbondingAmount(
          responsedelegatorUnbondingDelegations
        );

        const responsedelegationTotalRewards =
          await client.delegationTotalRewards(addressBech32);

        const rewardsAmount = getRewardsAmount(responsedelegationTotalRewards);

        const dataValidatorAddress = fromBech32(
          addressBech32,
          BECH32_PREFIX_VALOPER
        );

        const responsevalidatorCommission = await client.validatorCommission(
          dataValidatorAddress
        );

        const commissionAmount = getCommissionAmount(
          responsevalidatorCommission
        );

        const resultBalance = {
          liquid: responsegetBalance,
          frozen: delegationsAmount,
          melting: unbondingAmount,
          growth: rewardsAmount,
          cyberver: {
            denom: BASE_DENOM,
            amount: totalCyberver,
          },
        };

        if (commissionAmount.amount > 0) {
          resultBalance.commission = commissionAmount;
        }

        const total = Object.values(resultBalance).reduce((acc, item) => {
          return new BigNumber(acc).plus(item.amount).toString();
        }, 0);

        return {
          ...resultBalance,
          total: {
            denom: BASE_DENOM,
            amount: total,
          },
        };
      },
      {
        enabled: Boolean(client && addressBech32),
      }
    );

    if (data && data !== null && !isFetching) {
      return data;
    }

    return undefined;
  } catch (error) {
    console.log(`error`, error);
    const tempObj = { ...initValueMainToken };
    delete tempObj.total;
    return { ...tempObj };
  }
};

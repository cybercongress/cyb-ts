/* eslint-disable no-restricted-syntax */
import { Decimal } from '@cosmjs/math';
import BigNumber from 'bignumber.js';
import { useQuery } from '@tanstack/react-query';
import { getDelegatorDelegations } from 'src/utils/search/utils';
import { BECH32_PREFIX_VALOPER, BASE_DENOM } from 'src/constants/config';
import { fromBech32 } from '../../../utils/utils';
import { useStake as useVerseStake } from 'src/features/cybernet/ui/hooks/useCurrentAccountStake';
import { CYBERVER_CONTRACTS } from 'src/features/cybernet/constants';

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

function useCyberverBalance({ address }) {
  // will be refactored to loop
  const s1 = useVerseStake({
    address,
    contractAddress: CYBERVER_CONTRACTS[0],
    skip: !address,
  });

  const s2 = useVerseStake({
    address,
    contractAddress: CYBERVER_CONTRACTS[1],
    skip: !address,
  });

  const total1 = s1.data?.reduce((acc, { stake }) => acc + stake, 0) || 0;
  const total2 = s2.data?.reduce((acc, { stake }) => acc + stake, 0) || 0;

  const totalCyberver = (total1 + total2).toString();

  return totalCyberver;
}

export const useGetBalance = (client, addressBech32) => {
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

      const commissionAmount = getCommissionAmount(responsevalidatorCommission);

      const resultBalance = {
        liquid: responsegetBalance,
        frozen: delegationsAmount,
        melting: unbondingAmount,
        growth: rewardsAmount,
      };

      if (commissionAmount.amount > 0) {
        resultBalance.commission = commissionAmount;
      }

      return resultBalance;
    },
    {
      enabled: Boolean(client && addressBech32),
    }
  );

  const totalCyberver = useCyberverBalance({ address: addressBech32 });

  // TODO: refactor below
  if (isFetching) {
    return { ...initValueMainToken };
  }

  const result = {
    ...initValueMainToken,
    ...data,
  };

  if (data && totalCyberver) {
    result.cyberver = {
      denom: BASE_DENOM,
      amount: totalCyberver,
    };
  }

  const total = Object.values(result).reduce((acc, item) => {
    return new BigNumber(acc).plus(item.amount).toString();
  }, 0);

  result.total = {
    denom: BASE_DENOM,
    amount: total,
  };

  return result;
};

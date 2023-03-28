/* eslint-disable no-restricted-syntax */
import { Decimal } from '@cosmjs/math';
import BigNumber from 'bignumber.js';
import { useQuery } from '@tanstack/react-query';
import { CYBER } from '../../../utils/config';
import { fromBech32 } from '../../../utils/utils';

const { DENOM_CYBER } = CYBER;

const initValue = {
  denom: DENOM_CYBER,
  amount: '0',
};

export const initValueMainToken = {
  liquid: { ...initValue },
  frozen: { ...initValue },
  melting: { ...initValue },
  growth: { ...initValue },
  total: { ...initValue },
};

const initValueResponseFunc = (denom = '', amount = 0) => {
  return { denom, amount };
};

const getDelegationsAmount = (data) => {
  const { delegationResponses } = data;
  let delegationsAmount = new BigNumber(0);
  if (delegationResponses && Object.keys(delegationResponses).length > 0) {
    delegationResponses.forEach((itemDelegation) => {
      delegationsAmount = delegationsAmount.plus(itemDelegation.balance.amount);
    });
  }
  return initValueResponseFunc(DENOM_CYBER, delegationsAmount.toString());
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
  return initValueResponseFunc(DENOM_CYBER, unbondingAmount.toString());
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
  return initValueResponseFunc(DENOM_CYBER, rewardsAmount.toString());
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
  return initValueResponseFunc(DENOM_CYBER, commissionAmount.toString());
};

export const useGetBalance = (client, addressBech32) => {
  try {
    const { data, isFetching } = useQuery(
      ['getBalance', addressBech32],
      async () => {
        const responsegetBalance = await client.getBalance(
          addressBech32,
          DENOM_CYBER
        );

        const responsedelegatorDelegations = await client.delegatorDelegations(
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
          CYBER.BECH32_PREFIX_ACC_ADDR_CYBERVALOPER
        );

        const responsevalidatorCommission = await client.validatorCommission(
          dataValidatorAddress
        );

        const commissionAmount = getCommissionAmount(
          responsevalidatorCommission
        );

        return {
          liquid: responsegetBalance,
          frozen: delegationsAmount,
          melting: unbondingAmount,
          growth: rewardsAmount,
          commission: commissionAmount,
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

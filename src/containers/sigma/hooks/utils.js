import { Decimal } from '@cosmjs/math';
import BigNumber from 'bignumber.js';
import { CYBER } from '../../../utils/config';
import { fromBech32 } from '../../../utils/utils';
import coinDecimalsConfig from '../../../utils/configToken';

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

export const getBalance = async (client, addressBech32) => {
  try {
    const response = await client.getBalance(addressBech32, DENOM_CYBER);
    if (response !== null) {
      return response;
    }
    return initValueResponseFunc(DENOM_CYBER, 0);
  } catch (error) {
    console.log(`error`, error);
    return initValueResponseFunc(DENOM_CYBER, 0);
  }
};

export const getDelegatorDelegations = async (client, addressBech32) => {
  try {
    const delegationsPromise = await client.delegatorDelegations(addressBech32);
    let delegationsAmount = 0;

    const { delegationResponses } = delegationsPromise;
    if (delegationResponses && Object.keys(delegationResponses).length > 0) {
      delegationResponses.forEach((itemDelegation) => {
        delegationsAmount += parseFloat(itemDelegation.balance.amount);
      });
    }

    return initValueResponseFunc(
      DENOM_CYBER,
      new BigNumber(delegationsAmount).toString()
    );
  } catch (error) {
    console.log('error', error);
    return initValueResponseFunc(DENOM_CYBER, 0);
  }
};

export const getDelegatorUnbondingDelegations = async (
  client,
  addressBech32
) => {
  try {
    const unbondingPromise = await client.delegatorUnbondingDelegations(
      addressBech32
    );
    let unbondingAmount = 0;
    if (
      unbondingPromise.unbondingResponses &&
      unbondingPromise.unbondingResponses.length > 0
    ) {
      const { unbondingResponses } = unbondingPromise;
      unbondingResponses.forEach((unbond, i) => {
        unbond.entries.forEach((entry, j) => {
          unbondingAmount += parseFloat(entry.balance);
        });
      });
    }
    return initValueResponseFunc(
      DENOM_CYBER,
      new BigNumber(unbondingAmount).toString()
    );
  } catch (error) {
    console.log('error', error);
    return initValueResponseFunc(DENOM_CYBER, 0);
  }
};

export const getDelegationTotalRewards = async (
  client,
  addresclientsBech32
) => {
  try {
    const rewardsPropsise = await client.delegationTotalRewards(
      addresclientsBech32
    );
    let rewardsAmount = 0;

    if (rewardsPropsise.total && rewardsPropsise.total.length > 0) {
      const [{ amount }] = rewardsPropsise.total;
      rewardsAmount = parseFloat(
        Decimal.fromAtomics(amount, 18).floor().toString()
      );
    }

    return initValueResponseFunc(
      DENOM_CYBER,
      new BigNumber(rewardsAmount).toString()
    );
  } catch (error) {
    console.log('error', error);
    return initValueResponseFunc(DENOM_CYBER, 0);
  }
};

export const getValidatorCommission = async (client, addresclientsBech32) => {
  try {
    const dataValidatorAddress = fromBech32(
      addresclientsBech32,
      CYBER.BECH32_PREFIX_ACC_ADDR_CYBERVALOPER
    );
    const resultGetDistribution = await client.validatorCommission(
      dataValidatorAddress
    );
    let commissionAmount = 0;
    if (resultGetDistribution.commission.commission.length > 0) {
      const { commission } = resultGetDistribution;
      const [{ amount }] = commission.commission;
      commissionAmount = parseFloat(
        Decimal.fromAtomics(amount, 18).floor().toString()
      );
    }
    return initValueResponseFunc(
      DENOM_CYBER,
      new BigNumber(commissionAmount).toString()
    );
  } catch (error) {
    console.log('error', error);
    return initValueResponseFunc(DENOM_CYBER, 0);
  }
};

export const getBalanceInfo = async (client, bech32) => {
  try {
    let totalAmountObj = { ...initValueMainToken };

    const responseBalance = await getBalance(client, bech32);
    if (responseBalance.amount && parseFloat(responseBalance.amount) > 0) {
      totalAmountObj = {
        ...totalAmountObj,
        liquid: { ...responseBalance },
        total: {
          denom: responseBalance.denom,
          amount: new BigNumber(totalAmountObj.total.amount)
            .plus(responseBalance.amount)
            .toString(),
        },
      };
    }

    const responseDelegations = await getDelegatorDelegations(client, bech32);
    if (responseDelegations.amount > 0) {
      totalAmountObj = {
        ...totalAmountObj,
        frozen: { ...responseDelegations },
        total: {
          ...totalAmountObj.total,
          amount: new BigNumber(totalAmountObj.total.amount)
            .plus(responseDelegations.amount)
            .toString(),
        },
      };
    }

    const responseUnbonding = await getDelegatorUnbondingDelegations(
      client,
      bech32
    );
    if (responseUnbonding.amount > 0) {
      totalAmountObj = {
        ...totalAmountObj,
        melting: { ...responseUnbonding },
        total: {
          ...totalAmountObj.total,
          amount: new BigNumber(totalAmountObj.total.amount)
            .plus(responseUnbonding.amount)
            .toString(),
        },
      };
    }

    const responseRewards = await getDelegationTotalRewards(client, bech32);
    if (responseRewards.amount > 0) {
      totalAmountObj = {
        ...totalAmountObj,
        growth: { ...responseRewards },
        total: {
          ...totalAmountObj.total,
          amount: new BigNumber(totalAmountObj.total.amount)
            .plus(responseRewards.amount)
            .toString(),
        },
      };
    }

    const responseCommission = await getValidatorCommission(client, bech32);
    if (responseCommission.amount > 0) {
      totalAmountObj = {
        ...totalAmountObj,
        commission: { ...responseCommission },
        total: {
          ...totalAmountObj.total,
          amount: new BigNumber(totalAmountObj.total.amount)
            .plus(responseCommission.amount)
            .toString(),
        },
      };
    }

    return totalAmountObj;
  } catch (error) {
    console.log('error', error);
    return initValueMainToken;
  }
};

export const reduceAmount = (amount, denom) => {
  let amountReduce = amount;
  if (Object.prototype.hasOwnProperty.call(coinDecimalsConfig, denom)) {
    const { coinDecimals } = coinDecimalsConfig[denom];
    if (coinDecimals !== undefined) {
      amountReduce = parseFloat(
        Decimal.fromAtomics(
          amount.toString(),
          parseFloat(coinDecimals)
        ).toString()
      );
    }
  }
  return amountReduce;
};

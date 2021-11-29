import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../../context';
import {
  coinDecimals,
  fromBech32,
  convertResources,
} from '../../../utils/utils';
import { CYBER } from '../../../utils/config';
import useGetSlots from '../../mint/useGetSlots';

const initValue = {
  available: 0,
  delegation: 0,
  unbonding: 0,
  rewards: 0,
  total: 0,
};

const initValueTokens = {
  liquid: 0,
  vested: 0,
  total: 0,
};

const initValueToken = {
  hydrogen: { ...initValueTokens },
  milliampere: { ...initValueTokens },
  millivolt: { ...initValueTokens },
};

function useGetBalance(address, updateAddress) {
  const { jsCyber } = useContext(AppContext);
  const [loadingBalanceInfo, setLoadingBalanceInfo] = useState(true);
  const [loadingBalanceToken, setLoadingBalanceToken] = useState(true);
  const [balance, setBalance] = useState(initValue);
  const [balanceToken, setBalanceToken] = useState(initValueToken);
  const { vested, originalVesting } = useGetSlots(address, updateAddress);

  useEffect(() => {
    const getBalance = async () => {
      try {
        if (jsCyber !== null && address !== null) {
          setBalance(initValue);
          setLoadingBalanceInfo(true);
          const availablePromise = await jsCyber.getBalance(address, 'boot');
          setBalance((item) => ({
            ...item,
            available: parseFloat(availablePromise.amount),
            total: item.total + parseFloat(availablePromise.amount),
          }));

          const delegationsPromise = await jsCyber.delegatorDelegations(
            address
          );
          let delegationsAmount = 0;

          const { delegationResponses } = delegationsPromise;
          if (
            delegationResponses &&
            Object.keys(delegationResponses).length > 0
          ) {
            delegationResponses.forEach((itemDelegation) => {
              delegationsAmount += parseFloat(itemDelegation.balance.amount);
            });
          }
          setBalance((item) => ({
            ...item,
            delegation: parseFloat(delegationsAmount),
            total: item.total + parseFloat(delegationsAmount),
          }));

          const unbondingPromise = await jsCyber.delegatorUnbondingDelegations(
            address
          );
          if (
            unbondingPromise.unbondingResponses &&
            unbondingPromise.unbondingResponses.length > 0
          ) {
            const { unbondingResponses } = unbondingPromise;
            unbondingResponses.forEach((unbond, i) => {
              unbond.entries.forEach((entry, j) => {
                setBalance((item) => ({
                  ...item,
                  unbonding: Math.floor(
                    item.unbonding + parseFloat(entry.balance)
                  ),
                  total: Math.floor(item.total + parseFloat(entry.balance)),
                }));
              });
            });
          }
          const rewardsPropsise = await jsCyber.delegationTotalRewards(address);
          if (rewardsPropsise.total && rewardsPropsise.total.length > 0) {
            setBalance((item) => ({
              ...item,
              rewards: Math.floor(
                coinDecimals(parseFloat(rewardsPropsise.total[0].amount))
              ),
              total: Math.floor(
                item.total +
                  coinDecimals(parseFloat(rewardsPropsise.total[0].amount))
              ),
            }));
          }
          const dataValidatorAddress = fromBech32(
            address,
            CYBER.BECH32_PREFIX_ACC_ADDR_CYBERVALOPER
          );
          const resultGetDistribution = await jsCyber.validatorCommission(
            dataValidatorAddress
          );
          if (resultGetDistribution.commission.commission.length > 0) {
            const { commission } = resultGetDistribution;
            setBalance((item) => ({
              ...item,
              commission: Math.floor(
                coinDecimals(parseFloat(commission.commission[0].amount))
              ),
              total: Math.floor(
                item.total +
                  coinDecimals(parseFloat(commission.commission[0].amount))
              ),
            }));
          }
        } else {
          setBalance(initValue);
        }
        setLoadingBalanceInfo(false);
      } catch (e) {
        console.log(e);
        setLoadingBalanceInfo(false);
        return {
          ...initValue,
        };
      }
    };
    getBalance();
  }, [jsCyber, address, updateAddress]);

  useEffect(() => {
    const getBalance = async () => {
      const initValueTokenAmount = {
        hydrogen: {
          ...initValueTokens,
        },
        milliampere: {
          ...initValueTokens,
        },
        millivolt: {
          ...initValueTokens,
        },
      };

      if (jsCyber !== null && address !== null) {
        setBalanceToken(initValueToken);
        setLoadingBalanceToken(true);
        const getAllBalancesPromise = await jsCyber.getAllBalances(address);
        const balancesToken = getCalculationBalance(getAllBalancesPromise);
        if (Object.keys(balancesToken).length > 0) {
          Object.keys(balancesToken).forEach((key) => {
            if (
              Object.hasOwnProperty.call(balancesToken, key) &&
              key !== 'boot'
            ) {
              let elementBalancesToken = balancesToken[key];
              if (key === 'millivolt' || key === 'milliampere') {
                elementBalancesToken = convertResources(elementBalancesToken);
              }
              if (Object.hasOwnProperty.call(initValueTokenAmount, key)) {
                initValueTokenAmount[key].total = elementBalancesToken;
                initValueTokenAmount[key].liquid = elementBalancesToken;
              } else {
                initValueTokenAmount[key] = elementBalancesToken;
              }
              if (
                Object.hasOwnProperty.call(originalVesting, key) &&
                Object.hasOwnProperty.call(vested, key)
              ) {
                const vestedTokens =
                  parseFloat(originalVesting[key]) - parseFloat(vested[key]);
                const liquidAmount = elementBalancesToken - vestedTokens;
                initValueTokenAmount[key].liquid =
                  liquidAmount > 0 ? liquidAmount : 0;
                initValueTokenAmount[key].vested = vestedTokens;
              }
            }
          });
        }
      }
      // console.log(`initValueTokenAmount`, initValueTokenAmount);
      setBalanceToken(initValueTokenAmount);
      setLoadingBalanceToken(false);
    };
    getBalance();
  }, [jsCyber, address, vested, originalVesting]);

  const getCalculationBalance = (data) => {
    const balances = {};
    if (Object.keys(data).length > 0) {
      data.forEach((item) => {
        balances[item.denom] = parseFloat(item.amount);
      });
    }

    return balances;
  };

  const getPools = (data) =>
    Object.keys(data)
      .filter((key) => key.includes('pool'))
      .reduce(
        (obj, key) => ({
          ...obj,
          [key]: data[key],
        }),
        {}
      );

  return { balance, loadingBalanceInfo, balanceToken, loadingBalanceToken };
}

export default useGetBalance;

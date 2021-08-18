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
  available: 0,
  vested: 0,
  total: 0,
};

const initValueToken = {
  hydrogen: { ...initValueTokens },
  mamper: { ...initValueTokens },
  mvolt: { ...initValueTokens },
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

          const delegationsPromise = await jsCyber.getBalance(
            address,
            'hydrogen'
          );
          setBalance((item) => ({
            ...item,
            delegation: parseFloat(delegationsPromise.amount),
            total: item.total + parseFloat(delegationsPromise.amount),
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
          available: 0,
          vested: 0,
          total: 0,
        },
        mamper: {
          available: 0,
          vested: 0,
          total: 0,
        },
        mvolt: {
          available: 0,
          vested: 0,
          total: 0,
        },
      };

      if (jsCyber !== null && address !== null) {
        setBalanceToken(initValueToken);
        setLoadingBalanceToken(true);
        const getAllBalancesPromise = await jsCyber.getAllBalances(address);
        const balancesToken = getCalculationBalance(getAllBalancesPromise);
        if (balancesToken.mamper) {
          initValueTokenAmount.mamper.available = convertResources(
            balancesToken.mamper
          );
          initValueTokenAmount.mamper.total = convertResources(
            balancesToken.mamper
          );
        }
        if (balancesToken.mvolt) {
          initValueTokenAmount.mvolt.available = convertResources(
            balancesToken.mvolt
          );
          initValueTokenAmount.mvolt.total = convertResources(
            balancesToken.mvolt
          );
        }
        if (balancesToken.hydrogen) {
          initValueTokenAmount.hydrogen.available = balancesToken.hydrogen;
          initValueTokenAmount.hydrogen.total = balancesToken.hydrogen;
        }

        if (vested.mamper >= 0 && originalVesting.mamper > 0) {
          const vestedTokens =
            parseFloat(originalVesting.mamper) - parseFloat(vested.mamper);
          if (initValueTokenAmount.mamper.available > 0) {
            initValueTokenAmount.mamper.available -= convertResources(
              vestedTokens
            );
            initValueTokenAmount.mamper.vested = convertResources(vestedTokens);
          }
        }
        if (vested.mvolt >= 0 && originalVesting.mvolt > 0) {
          const vestedTokens =
            parseFloat(originalVesting.mvolt) - parseFloat(vested.mvolt);
          if (initValueTokenAmount.mvolt.available > 0) {
            initValueTokenAmount.mvolt.available -= convertResources(
              vestedTokens
            );
            initValueTokenAmount.mvolt.vested = convertResources(vestedTokens);
          }
        }
        if (vested.hydrogen >= 0 && originalVesting.hydrogen > 0) {
          const vestedTokens =
            parseFloat(originalVesting.hydrogen) - parseFloat(vested.hydrogen);
          if (initValueTokenAmount.hydrogen.available > 0) {
            initValueTokenAmount.hydrogen.available -= vestedTokens;
          }
          initValueTokenAmount.hydrogen.vested = vestedTokens;
        }
      }
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

  return { balance, loadingBalanceInfo, balanceToken, loadingBalanceToken };
}

export default useGetBalance;

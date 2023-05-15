import { useEffect, useState } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { coinDecimals, fromBech32 } from '../../../utils/utils';
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
  [CYBER.DENOM_LIQUID_TOKEN]: { ...initValueTokens },
  milliampere: { ...initValueTokens },
  millivolt: { ...initValueTokens },
};

function useGetBalance(address, updateAddress) {
  const queryClient = useQueryClient();
  const [addressActive, setAddressActive] = useState(null);
  const [loadingBalanceInfo, setLoadingBalanceInfo] = useState(true);
  const [loadingBalanceToken, setLoadingBalanceToken] = useState(true);
  const [balance, setBalance] = useState(initValue);
  const [balanceToken, setBalanceToken] = useState(initValueToken);
  const { vested, originalVesting, loadingAuthAccounts } = useGetSlots(
    addressActive,
    updateAddress
  );

  useEffect(() => {
    if (address !== null) {
      if (address.bech32) {
        setAddressActive(address.bech32);
      } else {
        setAddressActive(address);
      }
    }
  }, [address]);

  useEffect(() => {
    const getBalance = async () => {
      try {
        if (queryClient && addressActive !== null) {
          setBalance(initValue);
          setLoadingBalanceInfo(true);
          const availablePromise = await queryClient.getBalance(
            addressActive,
            CYBER.DENOM_CYBER
          );
          setBalance((item) => ({
            ...item,
            available: parseFloat(availablePromise.amount),
            total: item.total + parseFloat(availablePromise.amount),
          }));

          const delegationsPromise = await queryClient.delegatorDelegations(
            addressActive
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

          const unbondingPromise =
            await queryClient.delegatorUnbondingDelegations(addressActive);
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
          const rewardsPropsise = await queryClient.delegationTotalRewards(
            addressActive
          );
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
            addressActive,
            CYBER.BECH32_PREFIX_ACC_ADDR_CYBERVALOPER
          );
          const resultGetDistribution = await queryClient.validatorCommission(
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
        setBalance(...initValue);
      }
    };
    getBalance();
  }, [queryClient, addressActive, updateAddress]);

  useEffect(() => {
    const getBalance = async () => {
      const initValueTokenAmount = {
        [CYBER.DENOM_LIQUID_TOKEN]: {
          ...initValueTokens,
        },
        milliampere: {
          ...initValueTokens,
        },
        millivolt: {
          ...initValueTokens,
        },
        tocyb: 0,
      };

      if (queryClient && addressActive !== null && !loadingAuthAccounts) {
        setBalanceToken(initValueToken);
        setLoadingBalanceToken(true);
        const getAllBalancesPromise = await queryClient.getAllBalances(
          addressActive
        );
        const balancesToken = getCalculationBalance(getAllBalancesPromise);
        if (Object.keys(balancesToken).length > 0) {
          Object.keys(balancesToken).forEach((key) => {
            if (
              Object.hasOwnProperty.call(balancesToken, key) &&
              key !== CYBER.DENOM_CYBER
            ) {
              const elementBalancesToken = balancesToken[key];

              if (
                Object.hasOwnProperty.call(initValueTokenAmount, key) &&
                Object.hasOwnProperty.call(initValueTokenAmount[key], 'total')
              ) {
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
  }, [
    queryClient,
    addressActive,
    vested,
    originalVesting,
    loadingAuthAccounts,
  ]);

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

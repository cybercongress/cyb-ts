import { useEffect, useState, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AppContext } from '../../../context';
import { CYBER } from '../../../utils/config';
import { reduceBalances } from '../../../utils/utils';
import useGetSlots from '../../mint/useGetSlots';
import { reduceAmount } from './utils';

const { DENOM_CYBER, DENOM_LIQUID_TOKEN } = CYBER;

const initValue = {
  denom: '',
  amount: '0',
};

const initValueTokens = {
  liquid: { ...initValue },
  frozen: { ...initValue },
  total: { ...initValue },
};

const initValueToken = {
  [DENOM_LIQUID_TOKEN]: { ...initValueTokens },
  milliampere: { ...initValueTokens },
  millivolt: { ...initValueTokens },
};

const balanceFetcher = (options, client) => {
  const { address } = options;

  if (client === null || address === null) {
    return null;
  }

  return client.getAllBalances(address);
};

const useQueryGetAllBalances = (options) => {
  const { jsCyber } = useContext(AppContext);
  // const queryClient = useQueryClient();
  const { address } = options;

  const { data } = useQuery(
    ['getAllBalances', address],
    () => balanceFetcher(options, jsCyber),
    {
      enabled: Boolean(jsCyber && address),
      retry: 1,
      refetchOnWindowFocus: false,
      // initialData: () => {
      //   return queryClient
      //     .getQueryData('getAllBalance')
      //     ?.find((d) => d.id === address);
      // },
      // initialDataUpdatedAt: () =>
      //   queryClient.getQueryState('getAllBalance')?.dataUpdatedAt,
    }
  );

  return data;
};

function useBalanceToken(address, updateAddress) {
  const [addressActive, setAddressActive] = useState(null);
  const data = useQueryGetAllBalances({ address: addressActive });
  const [loading, setLoading] = useState(true);

  const { vested, originalVesting, loadingAuthAccounts } = useGetSlots(
    addressActive,
    updateAddress
  );
  const [balanceToken, setBalanceToken] = useState(initValueToken);

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
      setLoading(true);
      const initValueTokenAmount = {
        [DENOM_LIQUID_TOKEN]: {
          ...initValueTokens,
        },
        milliampere: {
          ...initValueTokens,
        },
        millivolt: {
          ...initValueTokens,
        },
        tocyb: { total: { ...initValue } },
      };

      if (data && data !== null && !loadingAuthAccounts) {
        const getAllBalancesPromise = data;

        if (getAllBalancesPromise.length > 0) {
          getAllBalancesPromise.forEach((item) => {
            const { amount, denom } = item;
            if (denom !== DENOM_CYBER) {
              const elementBalancesToken = amount;

              if (
                Object.hasOwnProperty.call(initValueTokenAmount, denom) &&
                Object.hasOwnProperty.call(initValueTokenAmount[denom], 'total')
              ) {
                initValueTokenAmount[denom].total = {
                  denom,
                  amount: parseFloat(elementBalancesToken),
                };
                initValueTokenAmount[denom].liquid = {
                  denom,
                  amount: parseFloat(elementBalancesToken),
                };
              } else {
                initValueTokenAmount[denom] = {
                  total: { denom, amount: parseFloat(elementBalancesToken) },
                };
              }
              if (
                Object.hasOwnProperty.call(originalVesting, denom) &&
                Object.hasOwnProperty.call(vested, denom)
              ) {
                const vestedTokens =
                  parseFloat(originalVesting[denom]) -
                  parseFloat(vested[denom]);
                const liquidAmount = elementBalancesToken - vestedTokens;

                initValueTokenAmount[denom].liquid = {
                  denom,
                  amount: liquidAmount > 0 ? liquidAmount : 0,
                };

                initValueTokenAmount[denom].frozen = {
                  denom,
                  amount: vestedTokens,
                };
              }
            }
          });
        }
      }
      setLoading(false);
      setBalanceToken(initValueTokenAmount);
    };
    getBalance();
  }, [data, address, vested, originalVesting, loadingAuthAccounts]);

  return { balanceToken, loading };
}

export default useBalanceToken;

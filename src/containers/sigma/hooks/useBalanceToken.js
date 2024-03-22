import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from 'src/contexts/queryClient';
import { BASE_DENOM, DENOM_LIQUID } from 'src/constants/config';
import useGetSlots from '../../mint/useGetSlots';

const initValueResponseFunc = (denom = '', amount = 0) => {
  return { denom, amount };
};

const initValueTokens = (denom = '', amount = 0) => {
  return {
    liquid: { ...initValueResponseFunc(denom, amount) },
    frozen: { ...initValueResponseFunc(denom, amount) },
    total: { ...initValueResponseFunc(denom, amount) },
  };
};

const initValueToken = {
  [DENOM_LIQUID]: { ...initValueTokens(DENOM_LIQUID, 0) },
  milliampere: { ...initValueTokens('milliampere', 0) },
  millivolt: { ...initValueTokens('millivolt', 0) },
};

const balanceFetcher = (options, client) => {
  const { address } = options;

  if (!client || address === null) {
    return null;
  }

  return client.getAllBalances(address);
};

const useQueryGetAllBalances = (options) => {
  const queryClient = useQueryClient();
  const { address } = options;

  const { data } = useQuery(
    ['getAllBalances', address],
    () => balanceFetcher(options, queryClient),
    {
      enabled: Boolean(queryClient && address),
      retry: 1,
      refetchOnWindowFocus: false,
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
        [DENOM_LIQUID]: {
          ...initValueTokens(DENOM_LIQUID, 0),
        },
        milliampere: {
          ...initValueTokens('milliampere', 0),
        },
        millivolt: {
          ...initValueTokens('millivolt', 0),
        },
        tocyb: { total: { ...initValueResponseFunc('tocyb', 0) } },
      };

      if (data && data !== null && !loadingAuthAccounts) {
        const getAllBalancesPromise = data;

        if (getAllBalancesPromise.length > 0) {
          getAllBalancesPromise.forEach((item) => {
            const { amount, denom } = item;
            if (denom !== BASE_DENOM) {
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

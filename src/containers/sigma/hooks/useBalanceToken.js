import { useEffect, useState, useContext } from 'react';
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

function useBalanceToken(address, updateAddress) {
  const { jsCyber } = useContext(AppContext);
  const [addressActive, setAddressActive] = useState(null);
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

      if (jsCyber !== null && address !== null && !loadingAuthAccounts) {
        const { bech32 } = address;
        const getAllBalancesPromise = await jsCyber.getAllBalances(bech32);

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
                  amount: elementBalancesToken,
                };
                initValueTokenAmount[denom].liquid = {
                  denom,
                  amount: elementBalancesToken,
                };
              } else {
                initValueTokenAmount[denom] = {
                  total: { denom, amount: elementBalancesToken },
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
  }, [jsCyber, address, vested, originalVesting, loadingAuthAccounts]);

  return { balanceToken, loading };
}

export default useBalanceToken;

import { useEffect, useState } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { DENOM_LIQUID } from 'src/constants/config';
import { reduceBalances } from '../utils/utils';
import { authAccounts } from '../utils/search/utils';

const MILLISECONDS_IN_SECOND = 1000;

const getVestingPeriodsData = (data, startTime) => {
  let length = parseFloat(startTime);
  const vestedAmount = {
    [DENOM_LIQUID]: 0,
    millivolt: 0,
    milliampere: 0,
  };

  if (data.length > 0) {
    data.forEach((item) => {
      let amount = {};
      length += parseFloat(item.length);
      const lengthMs = length * MILLISECONDS_IN_SECOND;
      const d = Date.parse(new Date());
      amount = reduceBalances(item.amount);
      if (lengthMs < d) {
        if (Object.keys(amount).length > 0) {
          // eslint-disable-next-line no-restricted-syntax
          for (const key in amount) {
            if (Object.hasOwnProperty.call(amount, key)) {
              const element = amount[key];
              if (Object.hasOwnProperty.call(vestedAmount, key)) {
                vestedAmount[key] += element;
              }
            }
          }
        }
      }
    });
  }

  return vestedAmount;
};

function useGetBalances(addressActive: string | undefined) {
  const queryClient = useQueryClient();
  const [allBalances, setAllBalances] = useState(null);
  const [vestedAmount, setVestedAmount] = useState(null);
  const [liquidBalances, setLiquidBalances] = useState(null);
  const [update, setUpdate] = useState(0);

  const refresh = () => {
    setUpdate((item) => item + 1);
  };

  useEffect(() => {
    const getAllBalances = async () => {
      if (queryClient && addressActive) {
        const getAllBalancesPromise = await queryClient.getAllBalances(
          addressActive
        );
        const balances = reduceBalances(getAllBalancesPromise);
        setAllBalances(balances);
      }
    };
    getAllBalances();
  }, [addressActive, queryClient, update]);

  useEffect(() => {
    (async () => {
      if (!addressActive) {
        return;
      }

      const vested = {
        [DENOM_LIQUID]: 0,
        millivolt: 0,
        milliampere: 0,
      };

      const getAccount = await authAccounts(addressActive);
      if (
        getAccount.account.vesting_periods &&
        getAccount.account.base_vesting_account.original_vesting
      ) {
        const { vesting_periods: vestingPeriods } = getAccount.account;
        const { original_vesting: originalVestingAmount } =
          getAccount.account.base_vesting_account;
        const { start_time: startTime } = getAccount.account;
        const reduceOriginalVestingAmount = reduceBalances(
          originalVestingAmount
        );
        // eslint-disable-next-line no-restricted-syntax
        for (const key in reduceOriginalVestingAmount) {
          if (Object.hasOwnProperty.call(reduceOriginalVestingAmount, key)) {
            const element = reduceOriginalVestingAmount[key];
            if (Object.hasOwnProperty.call(vested, key)) {
              vested[key] += element;
            }
          }
        }

        const vestedAmountReduce = getVestingPeriodsData(
          vestingPeriods,
          startTime
        );
        // eslint-disable-next-line no-restricted-syntax
        for (const key in vestedAmountReduce) {
          if (Object.hasOwnProperty.call(vestedAmountReduce, key)) {
            const element = vestedAmountReduce[key];
            if (Object.hasOwnProperty.call(vested, key)) {
              vested[key] -= element;
            }
          }
        }
      }
      setVestedAmount(vested);
    })();
  }, [update, addressActive, queryClient]);

  useEffect(() => {
    if (allBalances !== null && vestedAmount !== null) {
      const liquid = { ...allBalances };
      // eslint-disable-next-line no-restricted-syntax
      for (const key in vestedAmount) {
        if (Object.hasOwnProperty.call(vestedAmount, key)) {
          const elementVestedAmount = vestedAmount[key];
          if (Object.hasOwnProperty.call(liquid, key)) {
            const liquidAmount = liquid[key] - elementVestedAmount;
            // if (key === 'millivolt' || key === 'milliampere') {
            //   liquidAmount = liquidAmount;
            // }
            liquid[key] = liquidAmount > 0 ? liquidAmount : 0;
          }
        }
      }
      setLiquidBalances(liquid);
    }
  }, [allBalances, vestedAmount]);

  return { liquidBalances, refresh };
}

export default useGetBalances;

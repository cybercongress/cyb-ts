import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { useAppData } from 'src/contexts/appData';
import { Nullable } from 'src/types';
import useGetBalanceMainToken from './useGetBalanceMainToken';
import useBalanceToken from './useBalanceToken';
import { convertAmount } from '../../../utils/utils';
import { CYBER } from '../../../utils/config';

const usePrevious = (value: any) => {
  const ref = useRef<any>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

function useGetBalanceBostrom(address: Nullable<string>) {
  const { marketData } = useAppData();
  const { traseDenom } = useIbcDenom();
  const { balance: balanceMainToken, loading: loadingMalin } =
    useGetBalanceMainToken(address);
  const { balanceToken, loading: loadingToken } = useBalanceToken(address);
  const [totalAmountInLiquid, setTotalAmountInLiquid] = useState({
    currentCap: 0,
    change: 0,
  });
  const [totalAmountInLiquidOld, setTotalAmountInLiquidOld] = useState({
    currentCap: 0,
    change: 0,
  });
  const [balances, setBalances] = useState({});
  const prevBalanceToken = usePrevious(balanceToken);
  const prevBalanceMainToken = usePrevious(balanceMainToken);

  const getBalanceMarket = useCallback(
    (data) => {
      if (Object.keys(data).length > 0) {
        return Object.keys(data).reduce((obj, key) => {
          let tempCap = new BigNumber(0);
          let price = new BigNumber(0);

          const { total } = data[key];
          if (total.amount > 0) {
            const { amount, denom } = total;
            const [{ coinDecimals }] = traseDenom(denom);
            const amountReduce = convertAmount(amount, coinDecimals);

            if (Object.prototype.hasOwnProperty.call(marketData, denom)) {
              price = new BigNumber(marketData[denom]);
              tempCap = tempCap.plus(
                new BigNumber(amountReduce).multipliedBy(price)
              );
            }
          }
          tempCap = tempCap.dp(0, BigNumber.ROUND_FLOOR).toNumber();
          return {
            ...obj,
            [key]: {
              ...data[key],
              price: {
                denom: CYBER.DENOM_LIQUID_TOKEN,
                amount: price.toNumber(),
              },
              cap: { denom: CYBER.DENOM_LIQUID_TOKEN, amount: tempCap },
            },
          };
        }, {});
      }
      return {};
    },
    [marketData, traseDenom]
  );

  useEffect(() => {
    // solved the problem with using objects as
    //    a useEffect dependency via deep compare
    if (
      address &&
      (!_.isEqual(prevBalanceToken, balanceToken) ||
        !_.isEqual(prevBalanceMainToken, balanceMainToken))
    ) {
      const keyLs = `lastBalances-${address}`;
      const lastBalancesLs = localStorage.getItem(keyLs);

      if (!loadingMalin && !loadingToken) {
        let dataResult = {};
        const mainToken = {
          [CYBER.DENOM_CYBER]: { ...balanceMainToken },
        };
        const dataResultTemp = { ...mainToken, ...balanceToken };
        const tempData = getBalanceMarket(dataResultTemp);
        dataResult = { ...tempData };
        setBalances(dataResult);
        if (Object.keys(dataResult).length > 0) {
          localStorage.setItem(keyLs, JSON.stringify(dataResult));
        }
      } else if (lastBalancesLs) {
        const dataLs = JSON.parse(lastBalancesLs);
        setBalances(dataLs);
      }
    }
  }, [
    loadingMalin,
    loadingToken,
    balanceMainToken,
    balanceToken,
    address,
    prevBalanceToken,
    prevBalanceMainToken,
    getBalanceMarket,
  ]);

  const useGetCapTokens = useMemo(() => {
    let tempCap = new BigNumber(0);
    if (Object.keys(balances).length > 0) {
      Object.keys(balances).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(balances[key], 'cap')) {
          const { cap } = balances[key];
          if (cap.amount > 0) {
            const { amount } = cap;
            tempCap = tempCap.plus(new BigNumber(amount));
          }
        }
      });
      return tempCap.dp(0, BigNumber.ROUND_FLOOR).toNumber();
    }
    return tempCap.toNumber();
  }, [balances]);

  useEffect(() => {
    if (address) {
      const keyLs = `lastCap-${address}`;
      const lastCapLs = localStorage.getItem(keyLs);
      let lastCap = new BigNumber(0);
      if (lastCapLs) {
        lastCap = lastCap.plus(JSON.parse(lastCapLs));
      }

      if (useGetCapTokens > 0) {
        const currentCap = new BigNumber(useGetCapTokens);
        let changeCap = currentCap.minus(lastCap).dp(0, BigNumber.ROUND_FLOOR);

        if (currentCap.comparedTo(changeCap) <= 0) {
          changeCap = new BigNumber(0);
        }

        setTotalAmountInLiquid({
          change: changeCap.toNumber(),
          currentCap: currentCap.toNumber(),
        });

        localStorage.setItem(keyLs, currentCap.toString());
      } else {
        setTotalAmountInLiquidOld({
          change: 0,
          currentCap: lastCap.toNumber(),
        });
      }
    }
  }, [useGetCapTokens, address]);

  return {
    totalAmountInLiquid,
    balanceMainToken,
    balanceToken,
    balances,
    totalAmountInLiquidOld,
  };
}

export default useGetBalanceBostrom;

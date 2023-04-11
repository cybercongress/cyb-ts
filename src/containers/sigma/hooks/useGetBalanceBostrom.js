import { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import BigNumber from 'bignumber.js';
import { AppContext } from '../../../context';
import useGetBalanceMainToken from './useGetBalanceMainToken';
import useBalanceToken from './useBalanceToken';
import { convertAmount } from '../../../utils/utils';
import { CYBER } from '../../../utils/config';
import useIbcDenom from 'src/hooks/useIbcDenom';

function useGetBalanceBostrom(address) {
  const { marketData } = useContext(AppContext);
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

  useEffect(() => {
    if (address !== null) {
      const { bech32 } = address;
      const keyLs = `lastBalances-${bech32}`;
      const lastBalancesLs = localStorage.getItem(keyLs);

      if (!loadingToken && !loadingMalin) {
        let dataResult = {};
        const mainToken = { [CYBER.DENOM_CYBER]: { ...balanceMainToken } };
        const dataResultTemp = { ...mainToken, ...balanceToken };
        const tempData = getBalanceMarket(dataResultTemp);
        dataResult = { ...tempData };
        setBalances(dataResult);
        if (Object.keys(dataResult).length > 0) {
          localStorage.setItem(keyLs, JSON.stringify(dataResult));
        }
      } else if (lastBalancesLs !== null) {
        const dataLs = JSON.parse(lastBalancesLs);
        setBalances(dataLs);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingMalin, loadingToken, balanceMainToken, balanceToken, address]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [marketData]
  );

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
    if (address !== null) {
      const { bech32 } = address;
      const keyLs = `lastCap-${bech32}`;
      const lastCapLs = localStorage.getItem(keyLs);
      let lastCap = new BigNumber(0);
      if (lastCapLs !== null) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useGetCapTokens]);

  return {
    totalAmountInLiquid,
    balanceMainToken,
    balanceToken,
    balances,
    totalAmountInLiquidOld,
  };
}

export default useGetBalanceBostrom;

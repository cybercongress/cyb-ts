import { useEffect, useState, useContext, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { AppContext } from '../../../context';
import useGetBalanceMainToken from './useGetBalanceMainToken';
import useBalanceToken from './useBalanceToken';
import { convertAmount } from '../../../utils/utils';

function useGetBalanceBostrom(address) {
  const { traseDenom, marketData } = useContext(AppContext);
  const { balance: balanceMainToken, loading: loadingMalin } =
    useGetBalanceMainToken(address);
  const { balanceToken, loading: loadingToken } = useBalanceToken(address);
  const [totalAmountInLiquid, setTotalAmountInLiquid] = useState({
    currentCap: 0,
    change: 0,
  });

  const useGetCapMain = useMemo(() => {
    if (balanceMainToken.total.amount > 0) {
      const { amount, denom } = balanceMainToken.total;
      const { coinDecimals } = traseDenom(denom);
      const amountReduce = convertAmount(amount, coinDecimals);

      if (Object.prototype.hasOwnProperty.call(marketData, denom)) {
        const price = new BigNumber(marketData[denom]);
        return new BigNumber(amountReduce)
          .multipliedBy(price)
          .dp(0, BigNumber.ROUND_FLOOR)
          .toNumber();
      }
    }
    return 0;
  }, [balanceMainToken, marketData]);

  const useGetCapTokens = useMemo(() => {
    if (Object.keys(balanceToken).length > 0) {
      let tempCap = new BigNumber(0);
      Object.keys(balanceToken).forEach((key) => {
        const { total } = balanceToken[key];
        if (total.amount > 0) {
          const { amount, denom } = total;
          const { coinDecimals } = traseDenom(denom);
          const amountReduce = convertAmount(amount, coinDecimals);

          if (Object.prototype.hasOwnProperty.call(marketData, denom)) {
            const price = new BigNumber(marketData[denom]);
            tempCap = tempCap.plus(
              new BigNumber(amountReduce).multipliedBy(price)
            );
          }
        }
      });
      return tempCap.dp(0, BigNumber.ROUND_FLOOR).toNumber();
    }
    return 0;
  }, [balanceToken, marketData]);

  useEffect(() => {
    if (loadingToken === false && loadingMalin === false && address !== null) {
      const { bech32 } = address;
      const keyLs = `lastCap-${bech32}`;
      const lastCapLs = localStorage.getItem(keyLs);
      let lastCap = new BigNumber(0);
      if (lastCapLs !== null) {
        lastCap = lastCap.plus(JSON.parse(lastCapLs));
      }
      const currentCap = new BigNumber(useGetCapTokens).plus(useGetCapMain);
      const changeCap = currentCap.minus(lastCap).dp(0, BigNumber.ROUND_FLOOR);

      if (currentCap.comparedTo(changeCap)) {
        setTotalAmountInLiquid({
          change: changeCap.toNumber(),
          currentCap: currentCap.toNumber(),
        });
      } else {
        setTotalAmountInLiquid({
          change: 0,
          currentCap: currentCap.toNumber(),
        });
      }

      localStorage.setItem(keyLs, currentCap.toString());
    }
  }, [loadingToken, loadingMalin, useGetCapMain, useGetCapTokens]);

  return { totalAmountInLiquid, balanceMainToken, balanceToken };
}

export default useGetBalanceBostrom;

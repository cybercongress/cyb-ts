import BigNumber from 'bignumber.js';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context';
import { CYBER } from '../../../utils/config';
import {
  findDenomInTokenList,
  getDenomHash,
  getDisplayAmount,
} from '../../../utils/utils';

function useGetTotalCap() {
  const { marketData, traseDenom, dataTotalSupply } = useContext(AppContext);
  const [capData, setCapData] = useState({
    currentCap: 0,
    change: { amount: 0, time: 0 },
  });

  const [priceData, setPriceData] = useState({
    price: 0,
    change: { amount: 0, time: 0 },
  });

  useEffect(() => {
    if (
      Object.keys(dataTotalSupply).length > 0 &&
      Object.keys(marketData).length > 0
    ) {
      let cap = 0;
      Object.keys(dataTotalSupply).forEach((key) => {
        const amount = dataTotalSupply[key];
        const { coinDecimals } = traseDenom(key);
        const reduceAmount = getDisplayAmount(amount, coinDecimals);
        if (Object.prototype.hasOwnProperty.call(marketData, key)) {
          const poolPrice = new BigNumber(marketData[key]);
          const tempCap = poolPrice
            .multipliedBy(Number(reduceAmount))
            .dp(0, BigNumber.ROUND_FLOOR)
            .toNumber();
          cap += tempCap;
        }
      });

      if (cap > 0) {
        const d = new Date();
        const localStorageDataCap = localStorage.getItem('lastCap-temple');
        if (localStorageDataCap !== null) {
          const oldData = JSON.parse(localStorageDataCap);
          const lastCap = new BigNumber(oldData.cap);
          let change = new BigNumber(0);
          if (new BigNumber(cap).comparedTo(lastCap)) {
            const procent = lastCap.dividedBy(cap);
            change = BigNumber(1)
              .minus(procent)
              .multipliedBy(100)
              .dp(2, BigNumber.ROUND_FLOOR);
          } else {
            const procent = new BigNumber(cap).dividedBy(lastCap);
            change = BigNumber(1)
              .minus(procent)
              .multipliedBy(100)
              .dp(2, BigNumber.ROUND_FLOOR)
              .multipliedBy(-1);
          }
          // const change = new BigNumber(cap).minus(lastCap).toNumber();
          const timeChange = Date.parse(d) - Date.parse(oldData.timestamp);

          if (new BigNumber(cap).comparedTo(lastCap) !== 0 && timeChange > 0) {
            setCapData((item) => ({
              ...item,
              change: { amount: change.toNumber(), time: timeChange },
            }));
          }
        }
        setCapData((item) => ({ ...item, currentCap: cap }));
        localStorage.setItem(
          'lastCap-temple',
          JSON.stringify({ cap, timestamp: d })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketData, dataTotalSupply]);

  useEffect(() => {
    if (Object.keys(marketData).length > 0) {
      const denomInfo = findDenomInTokenList('uatom');
      const path = `transfer/${denomInfo.destChannelId}`;
      const ibcDenomAtom = getDenomHash(path, denomInfo.coinMinimalDenom);
      if (
        Object.prototype.hasOwnProperty.call(marketData, ibcDenomAtom) &&
        Object.prototype.hasOwnProperty.call(marketData, CYBER.DENOM_CYBER)
      ) {
        const priceBoot = new BigNumber(marketData[CYBER.DENOM_CYBER]);
        const priceAtom = new BigNumber(marketData[ibcDenomAtom]);
        const priceBootForAtom = priceAtom
          .dividedBy(priceBoot)
          .dp(0, BigNumber.ROUND_FLOOR)
          .toNumber();

        const localStorageDataPrice = localStorage.getItem(
          'lastPrice-Boot-Atom'
        );

        setPriceData((item) => ({
          ...item,
          price: priceBootForAtom,
        }));
        const d = new Date();

        if (localStorageDataPrice !== null) {
          const oldData = JSON.parse(localStorageDataPrice);
          const timeChange = Date.parse(d) - Date.parse(oldData.timestamp);
          let amountChangeProcent = new BigNumber(0);
          if (
            new BigNumber(priceBootForAtom).comparedTo(oldData.priceBootForAtom)
          ) {
            const procent = new BigNumber(oldData.priceBootForAtom).dividedBy(
              priceBootForAtom
            );
            amountChangeProcent = new BigNumber(1)
              .minus(procent)
              .multipliedBy(100)
              .dp(2, BigNumber.ROUND_FLOOR)
              .multipliedBy(-1);
          }

          if (
            new BigNumber(oldData.priceBootForAtom).comparedTo(priceBootForAtom)
          ) {
            const procent = new BigNumber(priceBootForAtom).dividedBy(
              oldData.priceBootForAtom
            );
            amountChangeProcent = new BigNumber(1)
              .minus(procent)
              .multipliedBy(100)
              .dp(2, BigNumber.ROUND_FLOOR);
          }

          if (timeChange > 0) {
            setPriceData((item) => ({
              ...item,
              change: {
                amount: amountChangeProcent.toNumber(),
                time: timeChange,
              },
            }));
          }
        }

        localStorage.setItem(
          'lastPrice-Boot-Atom',
          JSON.stringify({ priceBootForAtom, timestamp: d })
        );
      }
    }
  }, [marketData]);

  return { capData, priceData };
}

export default useGetTotalCap;

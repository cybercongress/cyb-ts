/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { useEffect, useState, useCallback, useContext } from 'react';
import { AppContext } from '../../../context';
import { checkGift, CONTRACT_ADDRESS_GIFT } from '../utils';

const initValueGiftAmount = {
  details: {},
  amount: 0,
};

function useCheckGift(citizenship, addressActive, updateFunc) {
  const { jsCyber } = useContext(AppContext);
  const [totalGift, setTotalGift] = useState(null);
  const [totalGiftAmount, setTotalGiftAmount] = useState(null);

  useEffect(() => {
    // console.log('useEffect | useCheckGift');
    const createObjGift = async () => {
      if (citizenship !== null && addressActive !== null) {
        setTotalGift(null);
        setTotalGiftAmount(null);
        const { owner } = citizenship;
        const { bech32 } = addressActive;
        if (owner === bech32) {
          // console.log('useEffect | useCheckGift');

          const response = await funcCheckGiftLoop();
          if (Object.keys(response).length > 0) {
            const responseClaim = await checkIsClaim(response);
            if (
              responseClaim !== null &&
              Object.keys(responseClaim).length > 0
            ) {
              setTotalGift(responseClaim);
            } else {
              setTotalGift(null);
            }
          }
        } else {
          setTotalGift(null);
        }
      }
    };
    createObjGift();
  }, [citizenship, addressActive, updateFunc]);

  // useEffect(() => {
  //   if (totalGift !== null) {
  //     checkIsClaim();
  //   }
  // }, [totalGift]);

  useEffect(() => {
    if (totalGift !== null) {
      let amountTotal = 0;
      const detailsTotal = {};
      Object.keys(totalGift).forEach((key) => {
        const { amount, details } = totalGift[key];
        if (amount) {
          amountTotal += amount;
        }
        if (details) {
          Object.keys(details).forEach((keyD) => {
            if (Object.prototype.hasOwnProperty.call(detailsTotal, keyD)) {
              detailsTotal[keyD].gift += details[keyD].gift;
            } else {
              detailsTotal[keyD] = { gift: details[keyD].gift };
            }
          });
        }
      });
      setTotalGiftAmount({ details: detailsTotal, amount: amountTotal });
    } else {
      setTotalGiftAmount(null);
    }
  }, [totalGift]);

  const funcCheckGiftLoop = useCallback(async () => {
    const result = {};
    if (citizenship !== null) {
      const { addresses } = citizenship.extension;
      for (let index = 0; index < addresses.length; index++) {
        const element = addresses[index];
        if (
          totalGift === null ||
          !Object.prototype.hasOwnProperty.call(totalGift, element.address)
        ) {
          const responseGift = await checkGift(element.address);
          console.log('responseGift', responseGift);
          if (responseGift !== null) {
            result[element.address] = {
              ...responseGift,
            };
          }
        }
      }
    }
    return result;
  }, [citizenship, totalGift]);

  const checkIsClaim = useCallback(
    async (dataGift) => {
      if (jsCyber !== null && dataGift !== null) {
        const templGiftData = JSON.parse(JSON.stringify(dataGift));
        for (const key in dataGift) {
          if (Object.hasOwnProperty.call(dataGift, key)) {
            const element = dataGift[key];
            const { address, isClaimed } = element;
            if (isClaimed === undefined || isClaimed === false) {
              // console.log('element.address', address);
              const queryResponseResult = await jsCyber.queryContractSmart(
                CONTRACT_ADDRESS_GIFT,
                {
                  is_claimed: {
                    address,
                  },
                }
              );

              if (
                queryResponseResult &&
                Object.prototype.hasOwnProperty.call(
                  queryResponseResult,
                  'is_claimed'
                )
              ) {
                templGiftData[address].isClaimed =
                  queryResponseResult.is_claimed;
              }
            }
          }
        }
        return templGiftData;
      }
      return null;
    },
    [jsCyber]
  );

  return { totalGift, totalGiftAmount, funcCheckGiftLoop };
}

export default useCheckGift;

/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { useEffect, useState, useCallback, useContext } from 'react';
import { AppContext } from '../../../context';
import { checkGift, getClaimedAmount, getIsClaimed } from '../utils';

function useCheckGift(citizenship, addressActive, updateFunc) {
  const { jsCyber } = useContext(AppContext);
  const [totalGift, setTotalGift] = useState(null);
  const [totalGiftAmount, setTotalGiftAmount] = useState(null);
  const [totalGiftClaimed, setTotalGiftClaimed] = useState(null);
  const [giftData, setGiftData] = useState(null);
  const [loadingGift, setLoadingGift] = useState(true);

  useEffect(() => {
    const createObjGift = async () => {
      if (citizenship !== null && addressActive !== null) {
        setLoadingGift(true);
        setTotalGift(null);
        setTotalGiftAmount(null);
        const { owner } = citizenship;
        const { bech32 } = addressActive;
        if (owner === bech32) {
          const response = await funcCheckGiftLoop();
          if (Object.keys(response).length > 0) {
            const responseClaim = await checkIsClaim(response);
            if (
              responseClaim !== null &&
              Object.keys(responseClaim).length > 0
            ) {
              setTotalGift(responseClaim);
              setLoadingGift(false);
            } else {
              setTotalGift(null);
              setLoadingGift(false);
            }
          } else {
            setLoadingGift(false);
            setTotalGift(null);
          }
        } else {
          setTotalGift(null);
          setLoadingGift(false);
        }
      }
    };
    createObjGift();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [citizenship, addressActive, updateFunc]);

  useEffect(() => {
    if (totalGift !== null) {
      let amountTotal = 0;
      let baseGiftAmountTotal = 0;
      const detailsTotal = {};
      Object.keys(totalGift).forEach((key) => {
        const { amount, details, claim } = totalGift[key];
        if (claim) {
          amountTotal += claim;
          baseGiftAmountTotal += amount;
        } else if (amount) {
          amountTotal += amount;
          baseGiftAmountTotal += amount;
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
      setTotalGiftAmount({
        details: detailsTotal,
        claim: amountTotal,
        amount: baseGiftAmountTotal,
      });
    } else {
      setTotalGiftAmount(null);
    }
  }, [totalGift]);

  useEffect(() => {
    if (totalGift !== null) {
      let amountTotal = 0;
      let baseGiftAmountTotal = 0;
      const detailsTotal = {};
      Object.keys(totalGift).forEach((key) => {
        const { amount, details, claim, isClaimed } = totalGift[key];
        if (isClaimed) {
          if (claim) {
            amountTotal += claim;
            baseGiftAmountTotal += amount;
          } else if (amount) {
            amountTotal += amount;
            baseGiftAmountTotal += amount;
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
        }
      });
      setTotalGiftClaimed({
        details: detailsTotal,
        claim: amountTotal,
        amount: baseGiftAmountTotal,
      });
    } else {
      setTotalGiftClaimed(null);
    }
  }, [totalGift]);

  useEffect(() => {
    if (totalGift !== null) {
      const totalObj = {
        claimed: {
          addresses: {},
          amount: 0,
          claim: 0,
          details: {},
        },
        unClaimed: { addresses: {}, amount: 0, claim: 0, details: {} },
      };
      Object.keys(totalGift).forEach((key) => {
        const { amount, details, claim, isClaimed } = totalGift[key];
        if (isClaimed) {
          totalObj.claimed.addresses[key] = { ...totalGift[key] };
          totalObj.claimed.amount += amount;
          totalObj.claimed.claim += claim;
          const { details: detailsClaim } = totalObj.claimed;
          if (details) {
            Object.keys(details).forEach((keyD) => {
              if (Object.prototype.hasOwnProperty.call(detailsClaim, keyD)) {
                detailsClaim[keyD].gift += details[keyD].gift;
              } else {
                detailsClaim[keyD] = { gift: details[keyD].gift };
              }
            });
          }
        } else {
          totalObj.unClaimed.addresses[key] = { ...totalGift[key] };
          totalObj.unClaimed.amount += amount;
          const { details: detailsUnClaim } = totalObj.unClaimed;
          if (details) {
            Object.keys(details).forEach((keyD) => {
              if (Object.prototype.hasOwnProperty.call(detailsUnClaim, keyD)) {
                detailsUnClaim[keyD].gift += details[keyD].gift;
              } else {
                detailsUnClaim[keyD] = { gift: details[keyD].gift };
              }
            });
          }
        }
      });
      if (
        Object.keys(totalObj.claimed.addresses).length > 0 ||
        Object.keys(totalObj.unClaimed.addresses).length > 0
      ) {
        setGiftData(totalObj);
      }
    }
  }, [totalGift]);

  const funcCheckGiftLoop = useCallback(async () => {
    const result = {};
    if (citizenship !== null) {
      const { addresses } = citizenship.extension;
      if (addresses !== null) {
        for (let index = 0; index < addresses.length; index++) {
          const element = addresses[index];
          if (
            totalGift === null ||
            !Object.prototype.hasOwnProperty.call(totalGift, element.address)
          ) {
            const responseGift = await checkGift(element.address);
            // console.log('responseGift', responseGift);
            if (responseGift !== null) {
              result[element.address] = {
                ...responseGift,
              };
            }
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
              const queryResponseResult = await getIsClaimed(jsCyber, address);

              if (
                queryResponseResult &&
                Object.prototype.hasOwnProperty.call(
                  queryResponseResult,
                  'is_claimed'
                )
              ) {
                templGiftData[address].isClaimed =
                  queryResponseResult.is_claimed;
                if (queryResponseResult.is_claimed) {
                  const responseClaimedAmount = await getClaimedAmount(
                    jsCyber,
                    address
                  );
                  if (
                    responseClaimedAmount !== null &&
                    Object.prototype.hasOwnProperty.call(
                      responseClaimedAmount,
                      'claim'
                    )
                  ) {
                    const { claim, multiplier } = responseClaimedAmount;
                    templGiftData[address].claim = parseFloat(claim);
                    templGiftData[address].multiplier = parseFloat(multiplier);
                  }
                }
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

  return {
    totalGift,
    totalGiftAmount,
    totalGiftClaimed,
    giftData,
    loadingGift,
    funcCheckGiftLoop,
    setLoadingGift,
  };
}

export default useCheckGift;

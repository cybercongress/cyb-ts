/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { useState, useEffect, useContext } from 'react';
import { getReleaseState } from '../utils';
import { AppContext } from '../../../context';

const NS_TO_MS = 1 * 10 ** -6;

function useCheckRelease(totalGift, updateFunc) {
  const { jsCyber } = useContext(AppContext);
  const [loadingRelease, setLoadingRelease] = useState(true);
  const [totalRelease, setTotalRelease] = useState(null);
  const [totalReadyRelease, setTotalReadyRelease] = useState(null);
  const [totalBalanceClaimAmount, setTotalBalanceClaimAmount] = useState(0);
  const [timeNextFirstrelease, setTimeNextFirstrelease] = useState(null);

  useEffect(() => {
    const checkReleaseFunc = async () => {
      if (
        jsCyber !== null &&
        totalGift &&
        totalGift !== null &&
        Object.keys(totalGift).length > 0
      ) {
        setLoadingRelease(true);
        const result = {};
        let balanceClaimAmount = 0;
        const totalReady = [];
        let timeFirstRelease = null;
        for (const key in totalGift) {
          if (Object.hasOwnProperty.call(totalGift, key)) {
            const element = totalGift[key];
            const { address, isClaimed } = element;
            if (isClaimed) {
              const queryResponseResultRelease = await getReleaseState(
                jsCyber,
                address
              );
              console.log('queryResponseResultRelease', queryResponseResultRelease)

              if (
                queryResponseResultRelease !== null &&
                Object.prototype.hasOwnProperty.call(
                  queryResponseResultRelease,
                  'stage_expiration'
                )
              ) {
                const calculationState = calculationStateRelease(
                  queryResponseResultRelease
                );
                const { balanceClaim, isRelease, timeNext } = calculationState;
                if (balanceClaim !== undefined) {
                  balanceClaimAmount += balanceClaim;
                }
                if (isRelease) {
                  totalReady.push({ address, ...calculationState });
                }
                const tempTime = timeNext;
                if (timeFirstRelease === null) {
                  timeFirstRelease = tempTime;
                }
                if (tempTime < timeFirstRelease) {
                  timeFirstRelease = tempTime;
                }
                result[address] = { address, ...calculationState };
              }
            }
          }
        }
        setTimeNextFirstrelease(timeFirstRelease);
        setTotalBalanceClaimAmount(balanceClaimAmount);
        if (Object.keys(result).length > 0) {
          setTotalRelease(result);
        } else {
          setTotalRelease(null);
        }

        if (totalReady.length > 0) {
          setTotalReadyRelease(totalReady);
        } else {
          setTotalReadyRelease(null);
        }
        setLoadingRelease(false);
      }
    };
    checkReleaseFunc();
  }, [totalGift, updateFunc]);

  const calculationStateRelease = (dataQuery) => {
    const { stage_expiration: stageExpiration, balance_claim: balanceClaim } =
      dataQuery;

    const releaseAddObj = {
      isRelease: false,
      timeNext: null,
      balanceClaim: 0,
    };

    if (Object.prototype.hasOwnProperty.call(stageExpiration, 'never')) {
      releaseAddObj.isRelease = true;
      releaseAddObj.timeNext = null;
      releaseAddObj.balanceClaim = parseFloat(balanceClaim);

      if (parseFloat(balanceClaim) === 0) {
        releaseAddObj.isRelease = false;
      }
    }

    if (Object.prototype.hasOwnProperty.call(stageExpiration, 'at_time')) {
      const { at_time: atTime } = stageExpiration;
      const d = new Date();
      const convertAtTime = atTime * NS_TO_MS;
      const time = convertAtTime - Date.parse(d);

      if (balanceClaim) {
        releaseAddObj.balanceClaim = parseFloat(balanceClaim);
      }

      if (time > 0) {
        releaseAddObj.isRelease = false;
        releaseAddObj.timeNext = time;
      } else {
        releaseAddObj.isRelease = true;
        releaseAddObj.timeNext = null;
      }
    }

    return releaseAddObj;
  };

  return {
    totalRelease,
    totalBalanceClaimAmount,
    totalReadyRelease,
    loadingRelease,
    timeNextFirstrelease,
  };
}

export default useCheckRelease;

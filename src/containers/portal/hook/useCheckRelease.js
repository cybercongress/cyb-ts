/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { useState, useEffect, useContext } from 'react';
import BigNumber from 'bignumber.js';
import { CONTRACT_ADDRESS_GIFT, COUNT_STAGES } from '../utils';
import { AppContext } from '../../../context';

const NS_TO_MS = 1 * 10 ** -6;

function useCheckRelease(totalGift, updateFunc) {
  const { jsCyber } = useContext(AppContext);
  const [loadingRelease, setLoadingRelease] = useState(true);
  const [totalRelease, setTotalRelease] = useState(null);
  const [totalReadyRelease, setTotalReadyRelease] = useState(null);
  const [totalReadyAmount, setTotalReadyAmount] = useState(0);
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
        let readyAmount = 0;
        const totalReady = [];
        let timeFirstRelease = null;
        for (const key in totalGift) {
          if (Object.hasOwnProperty.call(totalGift, key)) {
            const element = totalGift[key];
            const { address, isClaimed } = element;
            if (isClaimed) {
              const queryResponseResultRelease =
                await jsCyber.queryContractSmart(CONTRACT_ADDRESS_GIFT, {
                  release_state: {
                    address,
                  },
                });

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
                const { readyRelease, isRelease, timeNext } = calculationState;
                if (isRelease) {
                  readyAmount += readyRelease;
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
        setTotalReadyAmount(readyAmount);
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
    const {
      stage_expiration: stageExpiration,
      balance_claim: balanceClaim,
      stage,
    } = dataQuery;

    const releaseAddObj = {
      isRelease: false,
      timeNext: null,
      readyRelease: 0,
      stageRelease: 0,
    };

    if (stage > 0) {
      const curentProcent = new BigNumber(COUNT_STAGES).minus(stage);
      releaseAddObj.stageRelease = curentProcent
        .dividedBy(COUNT_STAGES)
        .multipliedBy(100)
        .dp(1, BigNumber.ROUND_FLOOR)
        .toNumber();
    } else {
      releaseAddObj.stageRelease = 0;
    }

    if (Object.prototype.hasOwnProperty.call(stageExpiration, 'never')) {
      releaseAddObj.isRelease = true;
      releaseAddObj.timeNext = null;
      releaseAddObj.readyRelease = parseFloat(balanceClaim);
    }

    if (Object.prototype.hasOwnProperty.call(stageExpiration, 'at_time')) {
      const { at_time: atTime } = stageExpiration;
      const d = new Date();
      const convertAtTime = atTime * NS_TO_MS;
      const time = convertAtTime - Date.parse(d);

      if (time > 0) {
        releaseAddObj.isRelease = false;
        releaseAddObj.timeNext = time;
        releaseAddObj.readyRelease = parseFloat(0);
      } else {
        releaseAddObj.isRelease = true;
        releaseAddObj.timeNext = null;
        releaseAddObj.readyRelease = parseFloat(balanceClaim);
      }
    }

    return releaseAddObj;
  };

  return {
    totalRelease,
    totalReadyAmount,
    totalReadyRelease,
    loadingRelease,
    timeNextFirstrelease,
  };
}

export default useCheckRelease;

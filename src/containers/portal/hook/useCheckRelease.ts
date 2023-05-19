/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { useState, useEffect } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { getReleaseState } from '../utils';
import { Nullable } from 'src/types';

type TotalRelease = {
  stage: number;
  balanceClaim: number;
  address: string;
};

type ArrayTotalRelease = {
  [key: string]: TotalRelease;
};

function useCheckRelease(totalGift, loadingGift, updateFunc, currentStage) {
  const queryClient = useQueryClient();
  const [loadingRelease, setLoadingRelease] = useState(true);
  const [totalRelease, setTotalRelease] =
    useState<Nullable<ArrayTotalRelease>>(null);
  const [totalReadyRelease, setTotalReadyRelease] =
    useState<Nullable<TotalRelease[]>>(null);
  const [totalBalanceClaimAmount, setTotalBalanceClaimAmount] = useState(0);

  useEffect(() => {
    const checkReleaseFunc = async () => {
      if (!loadingGift && totalGift !== undefined && totalGift === null) {
        initState();
      } else if (
        queryClient &&
        totalGift !== undefined &&
        totalGift !== null &&
        Object.keys(totalGift).length > 0
      ) {
        setLoadingRelease(true);
        const result: ArrayTotalRelease = {};
        let balanceClaimAmount = 0;
        const totalReady: TotalRelease[] = [];
        for (const key in totalGift) {
          if (Object.hasOwnProperty.call(totalGift, key)) {
            const element: { address: string; isClaimed: boolean } = totalGift[key];
            const { address, isClaimed } = element;
            if (isClaimed) {
              const queryResponseResultRelease = await getReleaseState(
                queryClient,
                address
              );

              if (queryResponseResultRelease) {
                const calculationState = calculationStateRelease(
                  queryResponseResultRelease
                );
                const { balanceClaim, stage } = calculationState;
                if (balanceClaim !== undefined) {
                  balanceClaimAmount += balanceClaim;
                }
                if (stage < currentStage) {
                  totalReady.push({ address, ...calculationState });
                }
                result[address] = { address, ...calculationState };
              }
            }
          }
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalGift, loadingGift, updateFunc]);

  const initState = () => {
    setLoadingRelease(false);
    setTotalRelease(null);
    setTotalBalanceClaimAmount(0);
  };

  const calculationStateRelease = (dataQuery) => {
    const { stage, balance_claim: balanceClaim } = dataQuery;

    const releaseAddObj = {
      balanceClaim: 0,
      stage: 0,
    };

    if (balanceClaim) {
      releaseAddObj.balanceClaim = parseFloat(balanceClaim);
    }

    if (stage) {
      releaseAddObj.stage = parseFloat(stage);
    }

    return releaseAddObj;
  };

  return {
    totalRelease,
    totalBalanceClaimAmount,
    totalReadyRelease,
    loadingRelease,
  };
}

export default useCheckRelease;

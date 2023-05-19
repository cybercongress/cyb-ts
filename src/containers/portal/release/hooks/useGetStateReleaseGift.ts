import { useEffect, useState } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import BigNumber from 'bignumber.js';
import { getConfigGift, getStateGift, AMOUNT_ALL_STAGE } from '../../utils';

const initStateBonus = {
  current: 0,
};

function useGetStateReleaseGift() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [currentBonus, setCurrentBonus] = useState(initStateBonus);
  const [citizensTargetClaim, setCitizensTargetClaim] = useState(0);
  const [citizensClaim, setCitizensClaim] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const cheeckStateRelease = async () => {
      setLoading(true);
      if (queryClient) {
        try {
          const queryResponseResultConfig = await getConfigGift(queryClient);
          const queryResponseResultState = await getStateGift(queryClient);

          const validResponse =
            queryResponseResultState !== null &&
            queryResponseResultConfig !== null;

          if (validResponse) {
            const { target_claim: targetClaim } = queryResponseResultConfig;
            const { claims, coefficient } = queryResponseResultState;
            if (coefficient) {
              setCurrentBonus({
                current: parseFloat(coefficient),
              });
            }
            if (targetClaim && claims) {
              setCitizensClaim(claims);
              setCitizensTargetClaim(targetClaim);
              const currentStageTemp = new BigNumber(claims)
                .dividedBy(targetClaim)
                .multipliedBy(100)
                .dp(0, BigNumber.ROUND_FLOOR)
                .toNumber();
              setCurrentStage(
                currentStageTemp > AMOUNT_ALL_STAGE
                  ? AMOUNT_ALL_STAGE
                  : currentStageTemp
              );
              const curentProgress = Math.floor(
                (parseFloat(claims) / parseFloat(targetClaim)) * 100
              );
              setProgress(curentProgress);
            }
            setLoading(false);
          }
        } catch (error) {
          console.log('error', error);
        }
      }
    };
    cheeckStateRelease();
  }, [queryClient]);

  return {
    loading,
    currentBonus,
    citizensTargetClaim,
    citizensClaim,
    currentStage,
    progress,
  };
}

export default useGetStateReleaseGift;

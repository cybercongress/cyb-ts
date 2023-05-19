import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';
import { useDevice } from 'src/contexts/device';
import useSetActiveAddress from '../../../hooks/useSetActiveAddress';
import {
  useGetActivePassport,
  NEW_RELEASE,
  AMOUNT_ALL_STAGE,
} from '../utils';
import {
  CurrentGift,
  MainContainer,
  MoonAnimation,
  Stars,
} from '../components';
import PasportCitizenship from '../pasport';
import ActionBarRelease from './ActionBarRelease';
import useCheckRelease from '../hook/useCheckRelease';
import useCheckGift from '../hook/useCheckGift';
import { PATTERN_CYBER } from '../../../utils/config';
import STEP_INFO from './utils';
import Info from './Info';

import portalAmbient from '../../../sounds/portalAmbient112.mp3';
import ReleaseStatus from '../components/ReleaseStatus';
import { RootState } from 'src/redux/store';
import usePingTxs from './hooks/usePingTxs';
import useGetStateReleaseGift from './hooks/useGetStateReleaseGift';
import { Nullable } from 'src/types';
import { CurrentRelease, ReadyRelease } from './type';

const portalAmbientObg = new Audio(portalAmbient);

const playPortalAmbient = () => {
  portalAmbientObg.loop = true;
  portalAmbientObg.play();
};

const stopPortalAmbient = () => {
  portalAmbientObg.loop = false;
  portalAmbientObg.pause();
  portalAmbientObg.currentTime = 0;
};

const {
  STATE_READY_TO_RELEASE,
  STATE_NEXT_UNFREEZE,
  STATE_PROVE_ADDRESS,
  STATE_INIT_NULL_ACTIVE,
} = STEP_INFO;

function Release() {
  const { isMobile: mobile } = useDevice();
  const { defaultAccount } = useSelector((store: RootState) => store.pocket);
  const { txHash, updateFunc, updateTxHash } = usePingTxs();
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const { citizenship, loading: loadingCitizenship } =
    useGetActivePassport(defaultAccount);
  const { totalGift, totalGiftClaimed, giftData, loadingGift } = useCheckGift(
    citizenship,
    addressActive
  );
  const {
    loading,
    currentBonus,
    citizensTargetClaim,
    citizensClaim,
    currentStage,
    progress,
  } = useGetStateReleaseGift();
  const {
    totalRelease,
    totalReadyRelease,
    totalBalanceClaimAmount,
    loadingRelease,
  } = useCheckRelease(totalGift, loadingGift, updateFunc, currentStage);

  const [selectedAddress, setSelectedAddress] =
    useState<Nullable<string>>(null);
  const [isRelease, setIsRelease] = useState(false);
  const [currentRelease, setCurrentRelease] =
    useState<Nullable<CurrentRelease[]>>(null);
  const [readyRelease, setReadyRelease] =
    useState<Nullable<ReadyRelease>>(null);
  const [stateInfo, setStateInfo] = useState(0);

  useEffect(() => {
    playPortalAmbient();

    return () => {
      stopPortalAmbient();
    };
  }, []);

  useEffect(() => {
    if (!loadingCitizenship && !loadingRelease) {
      if (currentRelease !== null) {
        if (isRelease) {
          setStateInfo(STATE_READY_TO_RELEASE);
        } else {
          setStateInfo(STATE_NEXT_UNFREEZE);
        }
      } else {
        setStateInfo(STATE_PROVE_ADDRESS);
      }
    }
  }, [
    loadingCitizenship,
    loadingRelease,
    isRelease,
    citizenship,
    currentRelease,
  ]);

  const initState = () => {
    setReadyRelease(null);
    setIsRelease(false);
  };

  useEffect(() => {
    if (selectedAddress && totalRelease && !loadingRelease) {
      initState();
      if (Object.prototype.hasOwnProperty.call(totalRelease, selectedAddress)) {
        const { balanceClaim: readyReleaseAddrr, stage } =
          totalRelease[selectedAddress];
        setCurrentRelease([totalRelease[selectedAddress]]);
        setIsRelease(stage < currentStage);
        setReadyRelease({
          address: selectedAddress,
          amount: readyReleaseAddrr,
        });
      } else if (selectedAddress && selectedAddress.match(PATTERN_CYBER)) {
        if (totalReadyRelease) {
          setCurrentRelease(totalReadyRelease);
          setIsRelease(true);
          setReadyRelease({
            address: selectedAddress,
            amount: totalBalanceClaimAmount,
          });
        } else {
          setCurrentRelease([]);
          setIsRelease(false);
          setReadyRelease({
            address: selectedAddress,
            amount: totalBalanceClaimAmount,
          });
        }
      } else {
        setCurrentRelease(null);
      }
    } else {
      setCurrentRelease(null);
    }
  }, [
    selectedAddress,
    totalRelease,
    totalBalanceClaimAmount,
    totalReadyRelease,
    loadingRelease,
    currentStage,
  ]);

  const useSelectedGiftData = useMemo(() => {
    try {
      if (selectedAddress) {
        if (selectedAddress.match(PATTERN_CYBER) && totalGiftClaimed) {
          return { address: selectedAddress, ...totalGiftClaimed };
        }

        if (
          totalGift !== null &&
          totalGift[selectedAddress] &&
          totalGift[selectedAddress].isClaimed
        ) {
          return totalGift[selectedAddress];
        }
      }

      return null;
    } catch (error) {
      console.log('error', error);
      return null;
    }
  }, [selectedAddress, totalGift, totalGiftClaimed]);

  const useReleasedStage = useMemo(() => {
    const statusRelease = {
      gift: 0,
      availableRelease: 0,
      released: 0,
      leftRelease: 0,
    };

    if (useSelectedGiftData && readyRelease && !loading) {
      const { amount, address } = readyRelease;
      const { claim, address: addressGift } = useSelectedGiftData;
      if (claim && address === addressGift) {
        const released = new BigNumber(claim).minus(amount).toNumber();
        const currentStageProcent = new BigNumber(currentStage).dividedBy(100);
        const availableRelease = new BigNumber(claim)
          .multipliedBy(currentStageProcent)
          .minus(released)
          .dp(0, BigNumber.ROUND_FLOOR)
          .toNumber();
        statusRelease.gift = claim;
        statusRelease.leftRelease = amount;
        statusRelease.released = released;
        statusRelease.availableRelease =
          availableRelease > 0 ? availableRelease : 0;
      }
    }

    return statusRelease;
  }, [readyRelease, useSelectedGiftData, currentStage]);

  const useNextRelease = useMemo(() => {
    if (currentStage < AMOUNT_ALL_STAGE && citizensClaim) {
      const nextTarget = new BigNumber(1)
        .plus(currentStage)
        .multipliedBy(NEW_RELEASE);
      return new BigNumber(nextTarget).minus(citizensClaim).toNumber();
    }

    return 0;
  }, [currentStage, citizensClaim]);

  const useBeforeActivation = useMemo(() => {
    if (citizensClaim > 0 && citizensTargetClaim > 0) {
      const left = citizensTargetClaim - citizensClaim;
      if (left > 0) {
        return left;
      }
      return citizensClaim;
    }
    return '';
  }, [citizensTargetClaim, citizensClaim]);

  const useUnClaimedGiftData = useMemo(() => {
    if (
      giftData !== null &&
      citizenship !== null &&
      Object.keys(giftData.unClaimed.addresses).length > 0
    ) {
      if (currentBonus?.current) {
        giftData.unClaimed.claim = Math.floor(
          giftData.unClaimed.amount * currentBonus.current
        );
        return { ...giftData.unClaimed, address: citizenship.owner };
      }
    }
    return null;
  }, [giftData, currentBonus, citizenship]);

  if (loadingCitizenship || loading) {
    return <div>...</div>;
  }

  let content;

  if (stateInfo !== STATE_INIT_NULL_ACTIVE) {
    content = (
      <>
        <PasportCitizenship
          txHash={txHash}
          citizenship={citizenship}
          updateFunc={setSelectedAddress}
          initStateCard={false}
          totalGift={totalGift}
        />

        {useUnClaimedGiftData !== null && (
          <CurrentGift
            title="Unclaimed"
            valueTextResult="unclaimed"
            initStateCard={false}
            selectedAddress={selectedAddress}
            currentGift={useUnClaimedGiftData}
          />
        )}

        <ReleaseStatus
          data={useReleasedStage}
          progress={progress}
          amountGiftValue={useReleasedStage.gift}
          nextRelease={useNextRelease}
        />
      </>
    );
  }

  return (
    <>
      <MainContainer>
        <Stars />
        {!mobile && <MoonAnimation />}
        <Info
          useReleasedStage={useReleasedStage}
          stepCurrent={stateInfo}
          nextRelease={useNextRelease}
        />
        {content}
      </MainContainer>

      <ActionBarRelease
        txHash={txHash}
        addressActive={addressActive}
        updateTxHash={updateTxHash}
        isRelease={isRelease}
        selectedAddress={selectedAddress}
        currentRelease={currentRelease}
        totalGift={totalGift}
        totalRelease={totalRelease}
        loadingRelease={loadingRelease}
      />
    </>
  );
}

export default Release;

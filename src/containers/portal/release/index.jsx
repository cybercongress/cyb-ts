import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
import { AppContext } from '../../../context';
import useSetActiveAddress from '../../../hooks/useSetActiveAddress';
import {
  useGetActivePassport,
  getConfigGift,
  getStateGift,
  BOOT_ICON,
} from '../utils';
import {
  CurrentGift,
  ProgressCard,
  NextUnfreeze,
  Released,
  MainContainer,
  UnclaimedGift,
} from '../components';
import PasportCitizenship from '../pasport';
import ActionBarRelease from './ActionBarRelease';
import useCheckRelease from '../hook/useCheckRelease';
import useCheckGift from '../hook/useCheckGift';
import { PATTERN_CYBER } from '../../../utils/config';
import { formatNumber } from '../../../utils/search/utils';
import { STEP_INFO } from './utils';
import Info from './Info';

const {
  STATE_BEFORE_ACTIVATION,
  STATE_READY_TO_RELEASE,
  STATE_NEXT_UNFREEZE,
  STATE_PROVE_ADDRESS,
  STATE_INIT_NULL_ACTIVE,
  STATE_INIT_NULL_BEFORE,
} = STEP_INFO;

const NS_TO_MS = 1 * 10 ** -6;

const initStateBonus = {
  current: 0,
};

function Release({ defaultAccount }) {
  const { jsCyber } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [updateFunc, setUpdateFunc] = useState(0);

  const { addressActive } = useSetActiveAddress(defaultAccount);
  const { citizenship, loading: loadingCitizenship } =
    useGetActivePassport(defaultAccount);
  const {
    totalGift,
    totalGiftClaimed,
    giftData,
    totalGiftAmount,
    loadingGift,
  } = useCheckGift(citizenship, addressActive);
  const {
    totalRelease,
    totalReadyRelease,
    totalBalanceClaimAmount,
    loadingRelease,
    timeNextFirstrelease,
  } = useCheckRelease(totalGift, loadingGift, updateFunc);

  const [txHash, setTxHash] = useState(null);
  const [currentBonus, setCurrentBonus] = useState(initStateBonus);
  const [activeReleases, setActiveReleases] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isRelease, setIsRelease] = useState(null);
  const [currentRelease, setCurrentRelease] = useState(null);
  const [progress, setProgress] = useState(0);
  const [citizensTargetClaim, setCitizensTargetClaim] = useState(0);
  const [citizensClaim, setCitizensClaim] = useState(0);
  const [timeNext, setTimeNext] = useState(null);
  const [readyRelease, setReadyRelease] = useState(null);
  const [stateInfo, setStateInfo] = useState(null);

  useEffect(() => {
    if (!loadingCitizenship) {
      if (!activeReleases) {
        if (citizenship === null) {
          setStateInfo(STATE_INIT_NULL_BEFORE);
        } else {
          setStateInfo(STATE_BEFORE_ACTIVATION);
        }
      } else if (citizenship === null) {
        setStateInfo(STATE_INIT_NULL_ACTIVE);
      } else if (!loadingRelease) {
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
    }

    // if (!loadingRelease) {
    //   if (!activeReleases) {
    //     setStateInfo(STATE_BEFORE_ACTIVATION);
    //   } else if (currentRelease !== null) {
    //     if (isRelease) {
    //       setStateInfo(STATE_READY_TO_RELEASE);
    //     } else {
    //       setStateInfo(STATE_NEXT_UNFREEZE);
    //     }
    //   } else {
    //     setStateInfo(STATE_PROVE_ADDRESS);
    //   }
    // }
  }, [
    loadingCitizenship,
    activeReleases,
    loadingRelease,
    isRelease,
    citizenship,
    currentRelease,
  ]);

  useEffect(() => {
    if (txHash !== null && txHash.status !== 'pending') {
      setTimeout(() => setTxHash(null), 35000);
    }
  }, [txHash]);

  useEffect(() => {
    const confirmTx = async () => {
      if (jsCyber !== null && txHash !== null && txHash.status === 'pending') {
        const response = await jsCyber.getTx(txHash.txHash);
        console.log('response :>> ', response);
        if (response && response !== null) {
          if (response.code === 0) {
            setTxHash((item) => ({
              ...item,
              status: 'confirmed',
            }));
            setUpdateFunc((item) => item + 1);
            return;
          }
          if (response.code) {
            setTxHash((item) => ({
              ...item,
              status: 'error',
              rawLog: response.rawLog.toString(),
            }));
            // setErrorMessage(response.rawLog);
            return;
          }
        }
        setTimeout(confirmTx, 1500);
      }
    };
    confirmTx();
  }, [jsCyber, txHash]);

  useEffect(() => {
    const cheeckStateRelease = async () => {
      setLoading(true);
      if (jsCyber !== null) {
        try {
          const queryResponseResultConfig = await getConfigGift(jsCyber);
          const queryResponseResultState = await getStateGift(jsCyber);

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
              if (parseFloat(targetClaim) > parseFloat(claims)) {
                setActiveReleases(false);
                setProgress(
                  Math.floor(
                    (parseFloat(claims) / parseFloat(targetClaim)) * 100
                  )
                );
              } else {
                setActiveReleases(true);
                setProgress(Math.floor(100));
              }
            }
            setLoading(false);
          }
        } catch (error) {
          console.log('error', error);
        }
      }
    };
    cheeckStateRelease();
  }, [jsCyber]);

  const initState = () => {
    setTimeNext(null);
    setReadyRelease(null);
    setIsRelease(null);
  };

  useEffect(() => {
    if (selectedAddress !== null && totalRelease !== null && !loadingRelease) {
      initState();
      if (Object.prototype.hasOwnProperty.call(totalRelease, selectedAddress)) {
        const {
          balanceClaim: readyReleaseAddrr,
          timeNext: timeNextAddrr,
          isRelease: isReleaseAddrr,
        } = totalRelease[selectedAddress];
        setCurrentRelease([totalRelease[selectedAddress]]);
        setIsRelease(isReleaseAddrr);
        setTimeNext(timeNextAddrr);
        setReadyRelease({
          address: selectedAddress,
          amount: parseFloat(readyReleaseAddrr),
        });
      } else if (
        selectedAddress !== null &&
        selectedAddress.match(PATTERN_CYBER)
      ) {
        if (totalReadyRelease !== null) {
          setCurrentRelease(totalReadyRelease);
          setIsRelease(true);
          setTimeNext(null);
          setReadyRelease({
            address: selectedAddress,
            amount: parseFloat(totalBalanceClaimAmount),
          });
        } else {
          setCurrentRelease([]);
          setIsRelease(false);
          setReadyRelease({
            address: selectedAddress,
            amount: parseFloat(totalBalanceClaimAmount),
          });
          setTimeNext(timeNextFirstrelease);
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
    timeNextFirstrelease,
    loadingRelease,
  ]);

  const updateTxHash = (data) => {
    setTxHash(data);
  };

  const useSelectedGiftData = useMemo(() => {
    try {
      if (selectedAddress !== null) {
        if (selectedAddress.match(PATTERN_CYBER) && totalGiftClaimed !== null) {
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
      progress: 0,
      gift: 0,
      leftRelease: 0,
    };

    if (useSelectedGiftData !== null && readyRelease !== null) {
      const { amount, address } = readyRelease;
      const { claim, address: addressGift } = useSelectedGiftData;
      if (claim && address === addressGift) {
        statusRelease.gift = claim;
        statusRelease.leftRelease = formatNumber(amount);
        const progressRelease = new BigNumber(amount).dividedBy(claim);
        const curentProgressRelease = new BigNumber(1)
          .minus(progressRelease)
          .multipliedBy(100)
          .dp(1, BigNumber.ROUND_FLOOR)
          .toNumber();
        statusRelease.progress = curentProgressRelease;
      }
    }

    return statusRelease;
  }, [readyRelease, useSelectedGiftData]);

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

  const useUnClaimedGiftAmount = useMemo(() => {
    if (totalGiftClaimed !== null && totalGiftAmount !== null) {
      if (totalGiftAmount.claim === totalGiftClaimed.claim) {
        return false;
      }

      if (currentBonus?.current) {
        const unclaimedGift = totalGiftAmount.amount - totalGiftClaimed.amount;
        const unclaimedGiftByBonus = Math.floor(
          unclaimedGift * currentBonus.current
        );
        return formatNumber(parseFloat(unclaimedGiftByBonus));
      }

      return false;
    }
    return false;
  }, [totalGiftAmount, totalGiftClaimed, currentBonus]);

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

  if (loadingCitizenship) {
    return <div>...</div>;
  }

  if (loading) {
    return <div>...</div>;
  }

  let content;

  // console.log('currentRelease', currentRelease);

  const validNextUnfreeze =
    (timeNext === null && readyRelease !== null) ||
    (timeNext !== null && readyRelease === null);

  if (!activeReleases && stateInfo === STATE_INIT_NULL_BEFORE) {
    content = (
      <ProgressCard
        titleValue={`${useBeforeActivation} addresses`}
        headerText="before activation"
        footerText="addresses registered"
        progress={progress}
      />
    );
  }

  if (activeReleases && stateInfo === STATE_INIT_NULL_ACTIVE) {
    content = (
      <ProgressCard
        titleValue={`${useBeforeActivation} addresses`}
        headerText="activated"
        footerText="addresses registered"
        progress={progress}
        styleContainerTrack={{ padding: '0px 25px 0px 15px' }}
        status="green"
      />
    );
  }

  if (!activeReleases && stateInfo !== STATE_INIT_NULL_BEFORE) {
    content = (
      <>
        <ProgressCard
          titleValue={`${useBeforeActivation} addresses`}
          headerText="before activation"
          footerText="addresses registered"
          progress={progress}
        />
      </>
    );
  }

  if (activeReleases && stateInfo !== STATE_INIT_NULL_ACTIVE) {
    content = (
      <>
        <NextUnfreeze timeNext={timeNext} readyRelease={readyRelease} />

        <PasportCitizenship
          txHash={txHash}
          citizenship={citizenship}
          updateFunc={setSelectedAddress}
          initStateCard={false}
          totalGift={totalGift}
        />

        {useSelectedGiftData !== null && (
          <CurrentGift
            title="Claimed"
            valueTextResult="claimed"
            initStateCard={false}
            selectedAddress={selectedAddress}
            currentGift={useSelectedGiftData}
          />
        )}

        {/* {useUnClaimedGiftAmount !== false && (
          <UnclaimedGift unClaimedGiftAmount={useUnClaimedGiftAmount} />
        )} */}

        {useUnClaimedGiftData !== null && (
          <CurrentGift
            title="Unclaimed"
            valueTextResult="unclaimed"
            initStateCard={false}
            selectedAddress={selectedAddress}
            currentGift={useUnClaimedGiftData}
          />
        )}

        <ProgressCard
          titleValue={`${useReleasedStage.leftRelease} ${BOOT_ICON}`}
          headerText="left to release"
          footerText="total gift released"
          progress={useReleasedStage.progress}
          styleContainerTrack={
            useReleasedStage.progress === 0 ? { padding: '0px 25px' } : {}
          }
        />
      </>
    );
  }

  return (
    <>
      <MainContainer>
        <Info
          useReleasedStage={useReleasedStage}
          stepCurrent={stateInfo}
          citizensTargetClaim={citizensTargetClaim}
        />
        {content}
      </MainContainer>

      <ActionBarRelease
        stateInfo={stateInfo}
        addressActive={addressActive}
        activeReleases={activeReleases}
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

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(Release);

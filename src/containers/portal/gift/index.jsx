import { useEffect, useState, useContext, useMemo } from 'react';
import { connect } from 'react-redux';
import useIpfs from 'src/hooks/useIpfs';
import { AppContext } from '../../../context';
import useSetActiveAddress from '../../../hooks/useSetActiveAddress';
import {
  useGetActivePassport,
  getStateGift,
  getConfigGift,
  parseRowLog,
} from '../utils';
import PasportCitizenship from '../pasport';
import ActionBarPortalGift from './ActionBarPortalGift';
import {
  CurrentGift,
  MainContainer,
  AboutGift,
  Stars,
  MoonAnimation,
} from '../components';
import useCheckGift from '../hook/useCheckGift';
import { PATTERN_CYBER } from '../../../utils/config';
import Carousel from './carousel1/Carousel';
import STEP_INFO from './utils';
import Info from './Info';
import portalConfirmed from '../../../sounds/portalConfirmed112.mp3';
import portalAmbient from '../../../sounds/portalAmbient112.mp3';

const portalAmbientObg = new Audio(portalAmbient);
const portalConfirmedObg = new Audio(portalConfirmed);

const playPortalConfirmed = () => {
  portalConfirmedObg.play();
};

const playPortalAmbient = () => {
  portalAmbientObg.loop = true;
  portalAmbientObg.play();
};

const stopPortalAmbient = () => {
  portalAmbientObg.loop = false;
  portalAmbientObg.pause();
  portalAmbientObg.currentTime = 0;
};

const STEP_GIFT_INFO = 1;
const STEP_PROVE_ADD = 2;
const STEP_CLAIME = 3;

const initStateBonus = {
  up: 0,
  down: 0,
  current: 0,
};

const itemsStep = [
  {
    title: 'gift',
    step: STEP_GIFT_INFO,
  },
  {
    title: 'prove address',
    step: STEP_PROVE_ADD,
  },
  {
    title: ' claim',
    step: STEP_CLAIME,
  },
];

function PortalGift({ defaultAccount, mobile }) {
  const { node } = useIpfs();
  const { jsCyber } = useContext(AppContext);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [updateFunc, setUpdateFunc] = useState(0);
  const [currentBonus, setCurrentBonus] = useState(initStateBonus);
  const [txHash, setTxHash] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { citizenship, loading, setLoading } = useGetActivePassport(
    defaultAccount,
    updateFunc
  );
  const [currentGift, setCurrentGift] = useState(null);
  const [isClaimed, setIsClaimed] = useState(null);
  const { totalGift, totalGiftClaimed, loadingGift, giftData, setLoadingGift } =
    useCheckGift(citizenship, addressActive, updateFunc);
  const [appStep, setStepApp] = useState(STEP_INFO.STATE_INIT);
  const [amountClaims, setAmountCaims] = useState(0);

  useEffect(() => {
    playPortalAmbient();

    return () => {
      stopPortalAmbient();
    };
  }, []);

  useEffect(() => {
    if (txHash !== null && txHash.status !== 'pending') {
      if (
        appStep === STEP_INFO.STATE_PROVE_IN_PROCESS &&
        txHash.status === 'confirmed' &&
        !loading &&
        citizenship !== null
      ) {
        setStepApp(STEP_INFO.STATE_CLAIME);
      }

      if (
        appStep === STEP_INFO.STATE_PROVE_IN_PROCESS &&
        txHash.status === 'error'
      ) {
        setStepApp(STEP_INFO.STATE_PROVE);
      }

      if (
        appStep === STEP_INFO.STATE_CLAIM_IN_PROCESS &&
        txHash.status === 'confirmed'
      ) {
        setStepApp(STEP_INFO.STATE_RELEASE);
      }

      if (
        appStep === STEP_INFO.STATE_CLAIM_IN_PROCESS &&
        txHash.status === 'error'
      ) {
        setStepApp(STEP_INFO.STATE_CLAIME);
      }
      setTimeout(() => setTxHash(null), 35000);
    }
  }, [txHash, appStep, loading, citizenship]);

  useEffect(() => {
    const confirmTx = async () => {
      if (jsCyber !== null && txHash !== null && txHash.status === 'pending') {
        const response = await jsCyber.getTx(txHash.txHash);
        console.log('response :>> ', response);
        if (response && response !== null) {
          if (response.code === 0) {
            setUpdateFunc((item) => item + 1);
            setTxHash((item) => ({
              ...item,
              status: 'confirmed',
            }));
            try {
              playPortalConfirmed();
            } catch (error) {
              console.log('error', error);
            }

            return;
          }
          if (response.code) {
            setTxHash((item) => ({
              ...item,
              status: 'error',
              rawLog: parseRowLog(response.rawLog.toString()),
            }));
            return;
          }
        }
        setTimeout(confirmTx, 1500);
      }
    };
    confirmTx();
  }, [jsCyber, txHash]);

  useEffect(() => {
    if (
      appStep === STEP_INFO.STATE_INIT &&
      selectedAddress === null &&
      citizenship !== null &&
      citizenship.owner
    ) {
      setSelectedAddress(citizenship.owner);
    }
  }, [selectedAddress, appStep, citizenship]);

  useEffect(() => {
    if (Math.floor(appStep) === STEP_INFO.STATE_INIT) {
      if (!loading) {
        if (citizenship === null) {
          setStepApp(STEP_INFO.STATE_INIT_NULL);
        } else if (!loadingGift) {
          if (isClaimed !== null && !isClaimed) {
            setStepApp(STEP_INFO.STATE_INIT_CLAIM);
          } else {
            setStepApp(STEP_INFO.STATE_INIT_PROVE);
          }
        }
      }
    }

    if (appStep === STEP_INFO.STATE_PROVE) {
      setStepApp(STEP_INFO.STATE_PROVE_CONNECT);
    }

    if (Math.floor(appStep) === STEP_INFO.STATE_CLAIME) {
      if (!loadingGift) {
        if (citizenship === null) {
          setStepApp(STEP_INFO.STATE_CLAIME_TO_PROVE);
        } else if (totalGift === null && selectedAddress.match(PATTERN_CYBER)) {
          setStepApp(STEP_INFO.STATE_GIFT_NULL_ALL);
        } else if (isClaimed === null) {
          setStepApp(STEP_INFO.STATE_CLAIME_TO_PROVE);
        } else if (!isClaimed) {
          setStepApp(STEP_INFO.STATE_CLAIME);
        } else if (isClaimed) {
          setStepApp(STEP_INFO.STATE_RELEASE);
        }
      }
    }
  }, [
    appStep,
    citizenship,
    isClaimed,
    totalGift,
    loadingGift,
    selectedAddress,
    loading,
  ]);

  useEffect(() => {
    const cheeckStateFunc = async () => {
      if (jsCyber !== null) {
        const queryResponseResultConfig = await getConfigGift(jsCyber);
        const queryResponseResultState = await getStateGift(jsCyber);

        if (
          queryResponseResultConfig !== null &&
          queryResponseResultState !== null
        ) {
          const { coefficient_down: down, coefficient_up: up } =
            queryResponseResultConfig;
          const { coefficient, claims } = queryResponseResultState;
          if ((down && up && coefficient, claims)) {
            setCurrentBonus({
              down: parseFloat(down),
              up: parseFloat(up),
              current: parseFloat(coefficient),
            });
            setAmountCaims(claims);
          }
        }
      }
    };
    cheeckStateFunc();
  }, [jsCyber]);

  useEffect(() => {
    if (!loadingGift) {
      if (totalGift !== null) {
        const tempGift = [];
        Object.keys(totalGift).forEach((key) => {
          if (!totalGift[key].isClaimed) {
            tempGift.push({ ...totalGift[key] });
          }
        });

        if (Object.keys(tempGift).length > 0) {
          setCurrentGift(tempGift);
        }
      } else {
        setCurrentGift(null);
      }
    }
  }, [loadingGift, totalGift, selectedAddress]);

  useEffect(() => {
    if (selectedAddress !== null && totalGift !== null) {
      if (Object.prototype.hasOwnProperty.call(totalGift, selectedAddress)) {
        if (
          Object.prototype.hasOwnProperty.call(
            totalGift[selectedAddress],
            'isClaimed'
          )
        ) {
          const { isClaimed: isClaimedAddress } = totalGift[selectedAddress];
          setIsClaimed(isClaimedAddress);
        }
      } else if (
        selectedAddress !== null &&
        selectedAddress.match(PATTERN_CYBER) &&
        totalGift !== null
      ) {
        const tempGift = [];
        Object.keys(totalGift).forEach((key) => {
          if (!totalGift[key].isClaimed) {
            tempGift.push({ ...totalGift[key] });
          }
        });

        if (Object.keys(tempGift).length > 0) {
          setIsClaimed(false);
        }

        if (Object.keys(tempGift).length === 0) {
          setIsClaimed(true);
        }
      } else {
        setIsClaimed(null);
      }
    } else {
      setIsClaimed(null);
    }
  }, [selectedAddress, loadingGift, totalGift]);

  const updateTxHash = (data) => {
    setTxHash(data);
  };

  const useSelectedGiftData = useMemo(() => {
    try {
      if (selectedAddress !== null) {
        if (selectedAddress.match(PATTERN_CYBER) && totalGiftClaimed !== null) {
          const { amount } = totalGiftClaimed;
          if (amount && amount > 0) {
            return { address: selectedAddress, ...totalGiftClaimed };
          }
        }

        if (
          totalGift !== null &&
          totalGift[selectedAddress] &&
          totalGift[selectedAddress].isClaimed
        ) {
          return totalGift[selectedAddress];
        }

        if (
          totalGift !== null &&
          Object.prototype.hasOwnProperty.call(totalGift, selectedAddress)
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

  const useDisableNext = useMemo(() => {
    if (citizenship !== null) {
      return false;
    }
    return true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, citizenship]);

  const useSetActiveItem = useMemo(() => {
    if (
      txHash !== null &&
      appStep === STEP_INFO.STATE_PROVE_IN_PROCESS &&
      txHash.status === 'confirmed' &&
      !loading &&
      citizenship !== null
    ) {
      const { addresses } = citizenship.extension;
      if (addresses && addresses !== null) {
        const lastIndex = Object.keys(addresses).length - 1;
        return lastIndex + 1;
      }
    }
    return undefined;
  }, [loading, appStep, txHash, citizenship]);

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

  let content;

  if (Math.floor(appStep) === STEP_GIFT_INFO) {
    content = (
      <AboutGift addressesClaimed={amountClaims} coefficient={currentBonus} />
    );
  }

  if (Math.floor(appStep) !== STEP_GIFT_INFO) {
    content = (
      <>
        <PasportCitizenship
          txHash={txHash}
          citizenship={citizenship}
          updateFunc={setSelectedAddress}
          setActiveItem={useSetActiveItem}
          totalGift={totalGift}
        />

        {useUnClaimedGiftData !== null &&
          selectedAddress !== null &&
          selectedAddress.match(PATTERN_CYBER) && (
            <CurrentGift
              title="Unclaimed"
              valueTextResult="unclaimed"
              initStateCard={false}
              selectedAddress={selectedAddress}
              currentGift={useUnClaimedGiftData}
            />
          )}

        {useSelectedGiftData !== null && (
          <CurrentGift
            title="Claimed"
            valueTextResult="claimed"
            selectedAddress={selectedAddress}
            currentGift={useSelectedGiftData}
            currentBonus={currentBonus}
          />
        )}
      </>
    );
  }

  return (
    <>
      <MainContainer>
        <Stars />
        {!mobile && <MoonAnimation />}
        {appStep !== null && (
          <Info
            stepCurrent={appStep}
            selectedAddress={selectedAddress}
            amountClaims={amountClaims}
          />
        )}
        <Carousel
          slides={itemsStep}
          activeStep={Math.floor(appStep)}
          setStep={setStepApp}
          disableNext={useDisableNext}
        />
        {content}
      </MainContainer>
      <ActionBarPortalGift
        addressActive={addressActive}
        citizenship={citizenship}
        updateTxHash={updateTxHash}
        isClaimed={isClaimed}
        selectedAddress={selectedAddress}
        currentGift={currentGift}
        activeStep={appStep}
        setStepApp={setStepApp}
        setLoading={setLoading}
        setLoadingGift={setLoadingGift}
        loadingGift={loadingGift}
        node={node}
      />
    </>
  );
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
    mobile: store.settings.mobile,
  };
};

export default connect(mapStateToProps)(PortalGift);

import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import { connect } from 'react-redux';
import { AppContext } from '../../../context';
import useSetActiveAddress from '../../../hooks/useSetActiveAddress';
import {
  useGetActivePassport,
  CONTRACT_ADDRESS_GIFT,
  getStateGift,
  getConfigGift,
} from '../utils';
import PasportCitizenship from '../pasport';
import ActionBarPortalGift from './ActionBarPortalGift';
import {
  CurrentGift,
  MainContainer,
  ScrollableTabs,
  AboutGift,
} from '../components';
import useCheckGift from '../hook/useCheckGift';
import { PATTERN_CYBER } from '../../../utils/config';
import TabsList from './tabsList';
import Carousel from './carousel1/Carousel';
import { STEP_INFO } from './utils';
import Info from './Info';
// import useCheckStatusTx from '../../../hooks/useCheckTxs';

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

function PortalGift({ defaultAccount, node }) {
  const { keplr, jsCyber } = useContext(AppContext);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [updateFunc, setUpdateFunc] = useState(0);
  const [currentBonus, setCurrentBonus] = useState(initStateBonus);
  const [txHash, setTxHash] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { citizenship, loading, setLoading } = useGetActivePassport(
    addressActive,
    updateFunc
  );
  const [currentGift, setCurrentGift] = useState(null);
  const [currentGiftAll, setCurrentGiftALl] = useState(null);
  const [isClaimed, setIsClaimed] = useState(null);
  const [isRelease, setIsRelease] = useState(null);
  const { totalGift, totalGiftAmount, loadingGift, setLoadingGift } =
    useCheckGift(citizenship, addressActive, updateFunc);
  const [appStep, setStepApp] = useState(STEP_INFO.STATE_INIT);

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
        if (citizenship !== null) {
          setStepApp(STEP_INFO.STATE_INIT_PROVE);
        } else {
          setStepApp(STEP_INFO.STATE_INIT_NULL);
        }
      }
    }

    // if (appStep === STEP_INFO.STATE_PROVE) {
    //   setStepApp(STEP_INFO.STATE_PROVE_CONNECT);
    // }

    if (Math.floor(appStep) === STEP_INFO.STATE_CLAIME) {
      if (!loadingGift) {
        if (citizenship === null) {
          setStepApp(STEP_INFO.STATE_CLAIME_TO_PROVE);
        } else if (totalGift === null) {
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
    // if (appStep === STEP_GIFT_INFO && !loading) {
    //   if (citizenship === null) {
    //     setStepApp(STEP_INFO.STATE_GIFT_NULL);
    //   } else if (totalGift === null) {
    //     setStepApp(STEP_INFO.STATE_INIT_PROVE);
    //   } else if (!isClaimed) {
    //     setStepApp(STEP_INFO.STATE_INIT_CLAIM);
    //   } else if (isClaimed) {
    //     setStepApp(STEP_INFO.STATE_INIT_RELEASE);
    //   } else {
    //     setStepApp(null);
    //   }
    // }
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
          const { coefficient } = queryResponseResultState;
          if (down && up && coefficient) {
            setCurrentBonus({
              down: parseFloat(down),
              up: parseFloat(up),
              current: parseFloat(coefficient),
            });
          }
        }
      }
    };
    cheeckStateFunc();
  }, [jsCyber]);

  useEffect(() => {
    if (!loadingGift) {
      if (selectedAddress !== null && totalGift !== null) {
        const tempGift = [];
        Object.keys(totalGift).forEach((key) => {
          if (!totalGift[key].isClaimed) {
            tempGift.push({ ...totalGift[key] });
          }
        });

        if (Object.keys(tempGift).length > 0) {
          setIsClaimed(false);
          setCurrentGift(tempGift);
        }

        if (Object.keys(tempGift).length === 0) {
          setIsClaimed(true);
        }
      } else {
        setCurrentGift(null);
        setIsClaimed(null);
      }
    }
  }, [selectedAddress, totalGift]);

  const updateTxHash = (data) => {
    setTxHash(data);
  };

  const useSelectedGiftData = useMemo(() => {
    if (selectedAddress !== null) {
      if (selectedAddress.match(PATTERN_CYBER) && totalGiftAmount !== null) {
        return { address: selectedAddress, ...totalGiftAmount };
      }

      if (
        totalGift !== null &&
        Object.prototype.hasOwnProperty.call(totalGift, selectedAddress)
      ) {
        return totalGift[selectedAddress];
      }
    }

    return null;
  }, [selectedAddress, totalGift, totalGiftAmount]);

  const useDisableNext = useMemo(() => {
    if (!loading) {
      if (citizenship !== null) {
        return false;
      }
      return true;
    }
  }, [loading, citizenship]);

  const useStateOpenPassport = useMemo(() => {
    if (Math.floor(appStep) === STEP_CLAIME) {
      return true;
    }
    return false;
  }, [appStep]);

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
  }, [loading, appStep, txHash, citizenship]);

  // console.log('useSetActiveItem', useSetActiveItem)

  // console.log('citizenship', citizenship);
  // console.log('selectedAddress', selectedAddress);
  // console.log('currentGift', currentGift);
  let content;

  if (Math.floor(appStep) === STEP_GIFT_INFO) {
    content = <AboutGift coefficient={currentBonus} />;
  }

  if (Math.floor(appStep) !== STEP_GIFT_INFO) {
    const { addresses } = citizenship.extension;
    content = (
      <>
        <PasportCitizenship
          stateOpen={useStateOpenPassport}
          txHash={txHash}
          citizenship={citizenship}
          updateFunc={setSelectedAddress}
          initStateCard={false}
          setActiveItem={useSetActiveItem}
        />

        {addresses !== null && (
          <CurrentGift
            selectedAddress={selectedAddress}
            currentBonus={currentBonus}
            currentGift={useSelectedGiftData}
          />
        )}
      </>
    );
  }

  return (
    <>
      <MainContainer>
        {/* <ScrollableTabs items={items} active={active} setStep={setActive} /> */}
        {/* <button onClick={() => checkIsClaim()}>test</button> */}
        {appStep !== null && (
          <Info stepCurrent={appStep} selectedAddress={selectedAddress} />
        )}
        <Carousel
          slides={itemsStep}
          activeStep={Math.floor(appStep)}
          setStep={setStepApp}
          disableNext={useDisableNext}
        />
        {/* <TabsList active={active} setStep={setActive} /> */}
        {content}
        {/* {currentGift !== null && (

            )} */}
      </MainContainer>
      <ActionBarPortalGift
        // updateFunc={() => setUpdateFunc((item) => item + 1)}
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
      />
    </>
  );
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
    node: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps)(PortalGift);

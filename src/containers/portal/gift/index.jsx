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
import { STEP_INFO } from './utils';
import Info from './Info';

const STEP_GIFT_INFO = 0;
const STEP_PROVE_ADD = 1;
const STEP_CLAIME = 2;

const initStateBonus = {
  up: 0,
  down: 0,
  current: 0,
};

function PortalGift({ defaultAccount, node }) {
  const { keplr, jsCyber } = useContext(AppContext);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [updateFunc, setUpdateFunc] = useState(0);
  const [currentBonus, setCurrentBonus] = useState(initStateBonus);
  const [txHash, setTxHash] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { citizenship, loading } = useGetActivePassport(
    addressActive,
    updateFunc
  );
  const [currentGift, setCurrentGift] = useState(null);
  const [isClaimed, setIsClaimed] = useState(null);
  const [isRelease, setIsRelease] = useState(null);
  const { totalGift, totalGiftAmount, loadingGift } = useCheckGift(
    citizenship,
    addressActive,
    updateFunc
  );
  const [active, setActive] = useState(STEP_GIFT_INFO);
  const [infoStep, setInfoStep] = useState(null);

  // console.log('generalGift | PortalGift', totalGift);
  // console.log('totalGiftAmount', totalGiftAmount);

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
    if (
      active === STEP_GIFT_INFO &&
      selectedAddress === null &&
      citizenship !== null &&
      citizenship.owner
    ) {
      setSelectedAddress(citizenship.owner);
    }
  }, [selectedAddress, active, citizenship]);

  useEffect(() => {
    if (active === STEP_GIFT_INFO && !loading) {
      if (citizenship === null) {
        setInfoStep(STEP_INFO.STATE_GIFT_NULL);
      } else if (totalGift === null) {
        setInfoStep(STEP_INFO.STATE_INIT_PROVE);
      } else if (!isClaimed) {
        setInfoStep(STEP_INFO.STATE_INIT_CLAIM);
      } else if (isClaimed) {
        setInfoStep(STEP_INFO.STATE_INIT_RELEASE);
      } else {
        setInfoStep(null);
      }
    }

    if (active === STEP_PROVE_ADD) {
      setInfoStep(STEP_INFO.STATE_PROVE);
    }

    if (active === STEP_CLAIME && !loadingGift) {
      if (
        (isClaimed === null || totalGift === null) &&
        selectedAddress !== null &&
        selectedAddress.match(PATTERN_CYBER)
      ) {
        setInfoStep(STEP_INFO.STATE_GIFT_NULL_ALL);
      } else if (isClaimed === null || totalGift === null) {
        setInfoStep(STEP_INFO.STATE_GIFT_NULL);
      } else if (
        isClaimed === false &&
        selectedAddress !== null &&
        selectedAddress.match(PATTERN_CYBER)
      ) {
        setInfoStep(STEP_INFO.STATE_CLAIME_ALL);
      } else if (isClaimed === false) {
        setInfoStep(STEP_INFO.STATE_GIFT_CLAIME);
      } else if (isClaimed === true) {
        setInfoStep(STEP_INFO.STATE_RELEASE);
      } else {
        setInfoStep(null);
      }
    }
  }, [
    active,
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
    if (selectedAddress !== null && totalGift !== null) {
      if (Object.prototype.hasOwnProperty.call(totalGift, selectedAddress)) {
        setCurrentGift([totalGift[selectedAddress]]);
        if (
          Object.prototype.hasOwnProperty.call(
            totalGift[selectedAddress],
            'isClaimed'
          )
        ) {
          const { isClaimed: isClaimedAddress } = totalGift[selectedAddress];
          setIsClaimed(isClaimedAddress);
          if (isClaimedAddress) {
            setIsRelease(true);
          }
          // checkClaim();
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
          setCurrentGift(tempGift);
        }

        if (Object.keys(tempGift).length === 0) {
          setIsClaimed(true);
        }
      } else {
        setCurrentGift(null);
        setIsClaimed(null);
      }
    } else {
      setCurrentGift(null);
      setIsClaimed(null);
    }
  }, [selectedAddress, totalGift]);

  const updateTxHash = (data) => {
    setTxHash(data);
  };

  const useSelectedGiftData = useMemo(() => {
    if (selectedAddress !== null) {
      if (selectedAddress.match(PATTERN_CYBER) && totalGiftAmount !== null) {
        return totalGiftAmount;
      }

      if (currentGift !== null) {
        return currentGift[0];
      }
    }

    return null;
  }, [selectedAddress, currentGift, totalGiftAmount]);

  // console.log('citizenship', citizenship);
  // console.log('selectedAddress', selectedAddress);
  // console.log('currentGift', currentGift);
  let content;

  if (loading) {
    return '...';
  }

  if (citizenship === null) {
    return (
      <MainContainer>
        <PasportCitizenship txHash={txHash} citizenship={null} />
      </MainContainer>
    );
  }

  if (active === STEP_GIFT_INFO) {
    content = <AboutGift coefficient={currentBonus} />;
  }

  if (active !== STEP_GIFT_INFO) {
    content = (
      <>
        <PasportCitizenship
          txHash={txHash}
          citizenship={citizenship}
          updateFunc={setSelectedAddress}
        />

        <CurrentGift
          currentBonus={currentBonus}
          currentGift={useSelectedGiftData}
        />
      </>
    );
  }

  return (
    <>
      <MainContainer>
        {/* <ScrollableTabs items={items} active={active} setStep={setActive} /> */}
        {/* <button onClick={() => checkIsClaim()}>test</button> */}
        {infoStep !== null && (
          <Info stepCurrent={infoStep} selectedAddress={selectedAddress} />
        )}
        <TabsList active={active} setStep={setActive} />
        {content}
        {/* {currentGift !== null && (

            )} */}
      </MainContainer>
      <ActionBarPortalGift
        // updateFunc={() => setUpdateFunc((item) => item + 1)}
        citizenship={citizenship}
        updateTxHash={updateTxHash}
        isClaimed={isClaimed}
        selectedAddress={selectedAddress}
        currentGift={currentGift}
        activeStep={active}
        setInfoStep={setInfoStep}
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

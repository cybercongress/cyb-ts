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
  const { totalGift, totalGiftAmount, checkIsClaim } = useCheckGift(
    citizenship,
    addressActive,
    updateFunc
  );
  const [active, setActive] = useState(STEP_GIFT_INFO);

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

  const checkClaim = useCallback(async () => {
    if (selectedAddress !== null && jsCyber !== null) {
      const queryResponseResult = await jsCyber.queryContractSmart(
        CONTRACT_ADDRESS_GIFT,
        {
          is_claimed: {
            address: selectedAddress,
          },
        }
      );
      if (
        queryResponseResult &&
        Object.prototype.hasOwnProperty.call(queryResponseResult, 'is_claimed')
      ) {
        console.log(
          'queryResponseResult.is_claimed',
          queryResponseResult.is_claimed
        );
        setIsClaimed(queryResponseResult.is_claimed);
        if (queryResponseResult.is_claimed) {
          setIsRelease(true);
        }
      }
    } else {
      setIsClaimed(null);
    }
  }, [selectedAddress, jsCyber]);

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

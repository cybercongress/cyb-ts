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
import { useGetActivePassport, getConfigGift, getStateGift } from '../utils';
import {
  CurrentGift,
  BeforeActivation,
  NextUnfreeze,
  Released,
} from '../components';
import PasportCitizenship from '../pasport';
import ActionBarRelease from './ActionBarRelease';
import useCheckRelease from '../hook/useCheckRelease';
import useCheckGift from '../hook/useCheckGift';
import { PATTERN_CYBER } from '../../../utils/config';

const NS_TO_MS = 1 * 10 ** -6;

function Release({ defaultAccount }) {
  const { jsCyber } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [updateFunc, setUpdateFunc] = useState(0);

  const { addressActive } = useSetActiveAddress(defaultAccount);
  const { citizenship } = useGetActivePassport(addressActive);
  const { totalGift, totalGiftAmount } = useCheckGift(
    citizenship,
    addressActive
  );
  const {
    totalRelease,
    totalReadyRelease,
    totalBalanceClaimAmount,
    loadingRelease,
    timeNextFirstrelease,
  } = useCheckRelease(totalGift, updateFunc);

  const [txHash, setTxHash] = useState(null);
  const [activeReleases, setActiveReleases] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isRelease, setIsRelease] = useState(null);
  const [currentRelease, setCurrentRelease] = useState(null);
  const [progress, setProgress] = useState(0);
  const [citizens, setCitizens] = useState(0);
  const [timeNext, setTimeNext] = useState(null);
  const [readyRelease, setReadyRelease] = useState(0);
  const [released, setReleased] = useState(0);

  // console.log(
  //   'totalRelease, totalReadyRelease, totalReadyAmount,',
  //   totalRelease,
  //   totalReadyRelease,
  //   totalReadyAmount
  // );

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
            const { claims } = queryResponseResultState;
            if (targetClaim && claims) {
              if (parseFloat(targetClaim) > parseFloat(claims)) {
                setActiveReleases(false);
                setProgress(
                  Math.floor(
                    (parseFloat(claims) / parseFloat(targetClaim)) * 100
                  )
                );
              } else {
                setActiveReleases(true);
              }
            }
            setCitizens(targetClaim);
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
    setReadyRelease(0);
    setIsRelease(null);
  };

  useEffect(() => {
    if (selectedAddress !== null && totalRelease !== null) {
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
        setReadyRelease(parseFloat(readyReleaseAddrr));
      } else if (
        selectedAddress !== null &&
        selectedAddress.match(PATTERN_CYBER)
      ) {
        if (totalReadyRelease !== null) {
          setCurrentRelease(totalReadyRelease);
          setIsRelease(true);
          setTimeNext(null);
          setReadyRelease(parseFloat(totalBalanceClaimAmount));
        } else {
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
  ]);

  const updateTxHash = (data) => {
    setTxHash(data);
  };

  const useSelectedGiftData = useMemo(() => {
    try {
      if (selectedAddress !== null) {
        if (selectedAddress.match(PATTERN_CYBER) && totalGiftAmount !== null) {
          return { address: selectedAddress, ...totalGiftAmount };
        }

        if (totalGift !== null && totalGift[selectedAddress]) {
          return totalGift[selectedAddress];
        }
      }

      return null;
    } catch (error) {
      console.log('error', error);
      return null;
    }
  }, [selectedAddress, totalGift, totalGiftAmount]);

  if (loading) {
    return <div>...</div>;
  }

  let content;

  // console.log('currentRelease', currentRelease);

  const useReleasedStage = useMemo(() => {}, [useSelectedGiftData, selectedAddress]);

  if (!activeReleases) {
    content = (
      <>
        <PasportCitizenship
          txHash={txHash}
          citizenship={citizenship}
          updateFunc={setSelectedAddress}
        />
        <CurrentGift stateOpen={false} currentGift={useSelectedGiftData} />
        <BeforeActivation citizens={citizens} progress={progress} />
      </>
    );
  }

  if (activeReleases) {
    content = (
      <>
        <PasportCitizenship
          txHash={txHash}
          citizenship={citizenship}
          updateFunc={setSelectedAddress}
        />

        <CurrentGift stateOpen={false} currentGift={useSelectedGiftData} />

        <NextUnfreeze timeNext={timeNext} readyRelease={readyRelease} />

        {isRelease !== null && <Released released={released} />}
      </>
    );
  }

  return (
    <>
      <main
        style={{ minHeight: 'calc(100vh - 162px)', overflow: 'hidden' }}
        className="block-body"
      >
        <div
          style={{
            width: '60%',
            margin: '0px auto',
            display: 'grid',
            gap: '20px',
          }}
        >
          {content}
        </div>
      </main>
      <ActionBarRelease
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

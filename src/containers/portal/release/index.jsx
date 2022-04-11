import React, { useEffect, useState, useContext, useCallback } from 'react';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
import { AppContext } from '../../../context';
import useSetActiveAddress from '../../../hooks/useSetActiveAddress';
import {
  useGetActivePassport,
  CONTRACT_ADDRESS_GIFT,
  COUNT_STAGES,
} from '../utils';
import {
  CurrentGift,
  BeforeActivation,
  NextUnfreeze,
  Released,
} from '../components';
import PasportCitizenship from '../pasport';
import ActionBarRelease from './ActionBarRelease';
import testDataJson from '../gift/test.json';

const NS_TO_MS = 1 * 10 ** -6;

function Release({ defaultAccount }) {
  const { keplr, jsCyber } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [txHash, setTxHash] = useState(null);
  const [updateFunc, setUpdateFunc] = useState(0);
  const [activeReleases, setActiveReleases] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { citizenship } = useGetActivePassport(addressActive, updateFunc);
  const [isRelease, setIsRelease] = useState(null);
  const [isClaimed, setIsClaimed] = useState(null);
  const [currentGift, setCurrentGift] = useState(null);
  const [progress, setProgress] = useState(0);
  const [citizens, setCitizens] = useState(0);
  const [timeNext, setTimeNext] = useState(null);
  const [readyRelease, setReadyRelease] = useState(0);
  const [released, setReleased] = useState(0);

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
          const queryResponseResult = await jsCyber.queryContractSmart(
            CONTRACT_ADDRESS_GIFT,
            {
              config: {},
            }
          );

          const { target_claim: targetClaim, claims } = queryResponseResult;
          if (targetClaim && claims) {
            if (parseFloat(targetClaim) > parseFloat(claims)) {
              setActiveReleases(false);
              setProgress(
                Math.floor((parseFloat(claims) / parseFloat(targetClaim)) * 100)
              );
            } else {
              setActiveReleases(true);
            }
          }
          setCitizens(targetClaim);
          setLoading(false);
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
    setIsClaimed(null);
  };

  useEffect(() => {
    if (selectedAddress !== null) {
      initState();
      if (Object.prototype.hasOwnProperty.call(testDataJson, selectedAddress)) {
        setCurrentGift(testDataJson[selectedAddress]);
        checkClaim();
      } else {
        setCurrentGift(null);
        setIsClaimed(null);
      }
    } else {
      setCurrentGift(null);
      setIsClaimed(null);
    }
  }, [selectedAddress, updateFunc]);

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
          useCheckRelease();
        }
      }
    } else {
      setIsClaimed(null);
    }
  }, [selectedAddress, jsCyber]);

  const useCheckRelease = useCallback(async () => {
    try {
      if (selectedAddress !== null && jsCyber !== null) {
        const queryResponseResultRelease = await jsCyber.queryContractSmart(
          CONTRACT_ADDRESS_GIFT,
          {
            release_state: {
              address: selectedAddress,
            },
          }
        );
        console.log('queryResponseResultRelease', queryResponseResultRelease);
        if (
          queryResponseResultRelease !== null &&
          Object.prototype.hasOwnProperty.call(
            queryResponseResultRelease,
            'stage_expiration'
          )
        ) {
          const {
            stage_expiration: stageExpiration,
            balance_claim: balanceClaim,
            stage,
          } = queryResponseResultRelease;

          if (stage > 0) {
            const curentProcent = new BigNumber(COUNT_STAGES).minus(stage);

            setReleased(
              curentProcent
                .dividedBy(COUNT_STAGES)
                .multipliedBy(100)
                .dp(1, BigNumber.ROUND_FLOOR)
                .toNumber()
            );
          } else {
            setReleased(0);
          }

          if (Object.prototype.hasOwnProperty.call(stageExpiration, 'never')) {
            setIsRelease(true);
            setTimeNext(null);
            setReadyRelease(parseFloat(balanceClaim));
          }

          if (
            Object.prototype.hasOwnProperty.call(stageExpiration, 'at_time')
          ) {
            const { at_time: atTime } = stageExpiration;
            const d = new Date();
            const convertAtTime = atTime * NS_TO_MS;
            const time = convertAtTime - Date.parse(d);

            if (time > 0) {
              setTimeNext(time);
              setIsRelease(false);
              setReadyRelease(0);
            } else {
              setIsRelease(true);
              setTimeNext(null);
              setReadyRelease(parseFloat(balanceClaim));
            }
          }
        }
      }
    } catch (error) {
      console.log('error', error);
      setIsRelease(null);
    }
  }, [selectedAddress, jsCyber]);

  const updateTxHash = (data) => {
    setTxHash(data);
  };

  if (loading) {
    return <div>...</div>;
  }

  console.log('progress', progress);
  let content;

  if (!activeReleases) {
    content = (
      <>
        <PasportCitizenship
          txHash={txHash}
          citizenship={citizenship}
          updateFunc={setSelectedAddress}
        />
        <CurrentGift stateOpen={false} currentGift={currentGift} />
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

        <CurrentGift stateOpen={false} currentGift={currentGift} />

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
        isClaimed={isClaimed}
        currentGift={currentGift}
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

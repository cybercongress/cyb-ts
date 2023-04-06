/* eslint-disable jsx-a11y/control-has-associated-label */
import { useMemo, useContext, useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GasPrice } from '@cosmjs/launchpad';
import txs from '../../../utils/txs';
import { AppContext } from '../../../context';
import { CONTRACT_ADDRESS_GIFT, GIFT_ICON } from '../utils';
import { Dots, BtnGrd } from '../../../components';
import { ActionBarSteps } from '../components';
import { PATTERN_CYBER, CYBER } from '../../../utils/config';
import { trimString } from '../../../utils/utils';
import STEP_INFO from './utils';

const { STATE_INIT_NULL_ACTIVE, STATE_INIT_NULL_BEFORE } = STEP_INFO;

const gasPrice = GasPrice.fromString('0.001boot');

const releaseMsg = (giftAddress) => {
  return {
    release: {
      gift_address: giftAddress,
    },
  };
};

const STEP_INIT = 0;
const STEP_CHECK_ACC = 1;
const STATE_CHANGE_ACCOUNT = 1.1;
const STEP_RELEASE = 2;

function ActionBarRelease({
  stateInfo,
  updateTxHash,
  selectedAddress,
  activeReleases,
  isRelease,
  currentRelease,
  totalGift,
  totalRelease,
  loadingRelease,
  addressActive,
}) {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEP_INIT);
  const { keplr } = useContext(AppContext);

  const getRelease = useCallback(async () => {
    try {
      if (keplr !== null && currentRelease !== null) {
        const msgs = [];
        if (currentRelease.length > 0) {
          currentRelease.forEach((item) => {
            const { address } = item;
            const msgObject = releaseMsg(address);
            msgs.push(msgObject);
          });
        }

        const [{ address: addressKeplr }] = await keplr.signer.getAccounts();

        if (msgs.length > 0) {
          const gasLimits = 400000 * msgs.length;
          const executeResponseResult = await keplr.executeArray(
            addressKeplr,
            CONTRACT_ADDRESS_GIFT,
            msgs,
            txs.calculateFee(gasLimits, gasPrice),
            CYBER.MEMO_KEPLR
          );

          console.log('executeResponseResult', executeResponseResult);
          if (executeResponseResult.code === 0) {
            updateTxHash({
              status: 'pending',
              txHash: executeResponseResult.transactionHash,
            });
          }

          if (executeResponseResult.code) {
            updateTxHash({
              txHash: executeResponseResult?.transactionHash,
              status: 'error',
              rawLog: executeResponseResult?.rawLog.toString(),
            });
          }
        }
        setStep(STEP_INIT);
      }
    } catch (error) {
      console.log('error', error);
      setStep(STEP_INIT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keplr, currentRelease]);

  useEffect(() => {
    const checkAddress = async () => {
      if (step === STEP_CHECK_ACC || step === STATE_CHANGE_ACCOUNT) {
        if (keplr !== null && addressActive !== null) {
          const [{ address }] = await keplr.signer.getAccounts();
          const { bech32 } = addressActive;
          if (address === bech32) {
            setStep(STEP_RELEASE);
            getRelease();
          } else {
            setStep(STATE_CHANGE_ACCOUNT);
          }
        }
      }
    };
    checkAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, keplr, addressActive]);

  const useAddressOwner = useMemo(() => {
    if (addressActive !== null) {
      const { name, bech32 } = addressActive;
      if (name !== undefined && name !== null) {
        return (
          <>
            account
            <span style={{ color: '#36d6ae', padding: '0 5px' }}>{name}</span>
          </>
        );
      }
      return (
        <>
          address
          <span style={{ color: '#36d6ae', padding: '0 5px' }}>
            {trimString(bech32, 10, 4)}
          </span>
        </>
      );
    }
    return '';
  }, [addressActive]);

  const isValidClaime = useMemo(() => {
    if (
      selectedAddress !== null &&
      selectedAddress.match(PATTERN_CYBER) &&
      totalGift !== null &&
      totalRelease === null
    ) {
      return true;
    }

    const validFields =
      selectedAddress !== null &&
      totalGift !== null &&
      totalRelease !== null &&
      !selectedAddress.match(PATTERN_CYBER);

    if (
      validFields &&
      Object.prototype.hasOwnProperty.call(totalGift, selectedAddress) &&
      !Object.prototype.hasOwnProperty.call(totalRelease, selectedAddress)
    ) {
      return true;
    }

    return false;
  }, [selectedAddress, totalGift, totalRelease]);

  const isValidProve = useMemo(() => {
    if (
      selectedAddress !== null &&
      selectedAddress.match(PATTERN_CYBER) &&
      totalGift === null
    ) {
      return true;
    }

    if (
      selectedAddress !== null &&
      totalGift !== null &&
      !selectedAddress.match(PATTERN_CYBER) &&
      !Object.prototype.hasOwnProperty.call(totalGift, selectedAddress)
    ) {
      return true;
    }

    return false;
  }, [selectedAddress, totalGift]);

  const useSelectCyber = useMemo(() => {
    return (
      selectedAddress &&
      selectedAddress !== null &&
      selectedAddress.match(PATTERN_CYBER)
    );
  }, [selectedAddress]);

  if (
    stateInfo === STATE_INIT_NULL_ACTIVE ||
    stateInfo === STATE_INIT_NULL_BEFORE
  ) {
    return (
      <ActionBarSteps>
        <BtnGrd
          onClick={() => navigate('citizenship')}
          text="get citizenship"
        />
      </ActionBarSteps>
    );
  }

  if (step === STATE_CHANGE_ACCOUNT) {
    return (
      <ActionBarSteps onClickBack={() => setStep(STEP_INIT)}>
        choose {useAddressOwner} in keplr
      </ActionBarSteps>
    );
  }

  if (activeReleases && loadingRelease) {
    return (
      <ActionBarSteps>
        <BtnGrd disabled text={<Dots />} />
      </ActionBarSteps>
    );
  }

  if (activeReleases && isValidProve) {
    return (
      <ActionBarSteps>
        <BtnGrd onClick={() => navigate('gift')} text="go to prove address" />
      </ActionBarSteps>
    );
  }

  if (activeReleases && isValidClaime) {
    return (
      <ActionBarSteps>
        <BtnGrd onClick={() => navigate('gift')} text="go to claim" />
      </ActionBarSteps>
    );
  }

  if (activeReleases && totalRelease !== null) {
    return (
      <ActionBarSteps>
        <BtnGrd
          disabled={isRelease === false || isRelease === null}
          onClick={() => setStep(STEP_CHECK_ACC)}
          text={
            useSelectCyber ? `release all ${GIFT_ICON}` : `release ${GIFT_ICON}`
          }
          pending={step === STEP_RELEASE || step === STEP_CHECK_ACC}
        />
      </ActionBarSteps>
    );
  }

  return null;
}

export default ActionBarRelease;

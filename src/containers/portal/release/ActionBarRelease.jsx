/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useMemo, useContext, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { calculateFee } from '@cosmjs/stargate';
import { GasPrice } from '@cosmjs/launchpad';

import { AppContext } from '../../../context';
import { CONTRACT_ADDRESS_GIFT, GIFT_ICON } from '../utils';
import { Dots } from '../../../components';
import { ActionBarSteps, BtnGrd } from '../components';
import { PATTERN_CYBER, CYBER } from '../../../utils/config';

const gasPrice = GasPrice.fromString('0.001boot');

export const getKeplr = async () => {
  if (window.keplr) {
    return window.keplr;
  }

  if (document.readyState === 'complete') {
    return window.keplr;
  }

  return new Promise((resolve) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === 'complete') {
        resolve(window.keplr);
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};

const releaseMsg = (giftAddress) => {
  return {
    release: {
      gift_address: giftAddress,
    },
  };
};

function ActionBarRelease({
  updateTxHash,
  selectedAddress,
  activeReleases,
  isRelease,
  currentRelease,
  totalGift,
  totalRelease,
  loadingRelease,
}) {
  const history = useHistory();
  const { keplr } = useContext(AppContext);
  const [pendingRelease, setPendingRelease] = useState(false);

  const useRelease = useCallback(async () => {
    try {
      if (keplr !== null && currentRelease !== null) {
        setPendingRelease(true);
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
            calculateFee(gasLimits, gasPrice),
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
        setPendingRelease(false);
      }
    } catch (error) {
      console.log('error', error);
    }
  }, [keplr, currentRelease]);

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
        <BtnGrd
          onClick={() => history.push('portalGift')}
          text="go to prove address"
        />
      </ActionBarSteps>
    );
  }

  if (activeReleases && isValidClaime) {
    return (
      <ActionBarSteps>
        <BtnGrd onClick={() => history.push('portalGift')} text="claimed" />
      </ActionBarSteps>
    );
  }

  if (activeReleases && totalRelease !== null) {
    return (
      <ActionBarSteps>
        <BtnGrd
          disabled={isRelease === false || isRelease === null}
          onClick={() => useRelease()}
          text={
            useSelectCyber ? `release all ${GIFT_ICON}` : `release ${GIFT_ICON}`
          }
          pending={pendingRelease}
        />
      </ActionBarSteps>
    );
  }

  return null;
}

export default ActionBarRelease;

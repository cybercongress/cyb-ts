/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useContext, useCallback } from 'react';
import {
  ActionBar as ActionBarContainer,
  Button,
} from '@cybercongress/gravity';
import { useHistory } from 'react-router-dom';
import { calculateFee } from '@cosmjs/stargate';
import { GasPrice } from '@cosmjs/launchpad';

import { AppContext } from '../../../context';
import { CONTRACT_ADDRESS_GIFT, GIFT_ICON } from '../utils';

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
  isClaimed,
  currentGift,
}) {
  const history = useHistory();
  const { keplr, jsCyber } = useContext(AppContext);

  // useEffect(() => {
  //   const NS_TO_S = 1 * 10 ** -6;

  //   const timeTest = 1648642766728729204 * NS_TO_S;

  //   const d = new Date();
  //   console.log('Date.parse(d)', Date.parse(d));
  //   const time = timeTest - Date.parse(d);

  //   console.log('data', timeSince(time));
  //   console.log('1648637426714169237', 1648642766728729204 * NS_TO_S);
  //   console.log(
  //     'data timeSince',
  //     dateFormat(
  //       new Date(1648642766728729204 * NS_TO_S),
  //       'dd/mm/yyyy, hh:MM:ss tt'
  //     )
  //   );
  // }, []);

  const useRelease = useCallback(async () => {
    try {
      if (keplr !== null && selectedAddress !== null) {
        const msgObject = releaseMsg(selectedAddress);

        const [{ address: addressKeplr }] = await keplr.signer.getAccounts();

        const executeResponseResult = await keplr.execute(
          addressKeplr,
          CONTRACT_ADDRESS_GIFT,
          msgObject,
          calculateFee(400000, gasPrice),
          'cyber'
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
    } catch (error) {
      console.log('error', error);
    }
  }, [keplr, selectedAddress]);

  if (activeReleases && currentGift === null) {
    return (
      <ActionBarContainer>
        <Button onClick={() => history.push('portalGift')}>
          prove address
        </Button>
      </ActionBarContainer>
    );
  }

  if (activeReleases && isClaimed === false) {
    return (
      <ActionBarContainer>
        <Button onClick={() => history.push('portalGift')}>claimed</Button>
      </ActionBarContainer>
    );
  }

  if (activeReleases && isClaimed === true) {
    return (
      <ActionBarContainer>
        <Button disabled={isRelease === false} onClick={() => useRelease()}>
          release {GIFT_ICON}
        </Button>
      </ActionBarContainer>
    );
  }

  return null;
}

export default ActionBarRelease;

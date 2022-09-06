import React, { useEffect, useState, useContext } from 'react';
import {
  ActionBar as ActionBarContainer,
  Button,
} from '@cybercongress/gravity';
import { coin } from '@cosmjs/launchpad';
import { Link } from 'react-router-dom';
import {
  Dots,
  ActionBarContentText,
  TransactionSubmitted,
  Confirmed,
  TransactionError,
  Account,
} from '../../components';
import { AppContext, AppContextSigner } from '../../context';
import { CYBER, LEDGER, DEFAULT_GAS_LIMITS } from '../../utils/config';
import { getTxs } from '../../utils/search/utils';
import { trimString } from '../../utils/utils';
import Msgs from '../../utils/msgs';

const {
  STAGE_INIT,
  STAGE_ERROR,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
} = LEDGER;

const VESTING_TIME_HOURS = 3601;
const BASE_VESTING_TIME = 86401;

const checkTxs = (response, updateState) => {
  console.log('response', response);
  const { setStage, setTxHash, setErrorMessage } = updateState;
  if (response.code === 0) {
    const hash = response.transactionHash;
    console.log('hash :>> ', hash);
    setStage(STAGE_SUBMITTED);
    setTxHash(hash);
  } else {
    setStage(STAGE_ERROR);
    setTxHash(null);
    setErrorMessage(response.rawLog.toString());
  }
};

function ActionBar({
  value,
  selected,
  valueDays,
  resourceToken,
  updateFnc,
  addressActive,
}) {
  const { keplr, jsCyber } = useContext(AppContext);
  const {
    cyberSigner,
    updateValueTxs,
    updateValueIsVisible,
    updateCallbackSigner,
    updateStageSigner,
  } = useContext(AppContextSigner);
  const [stage, setStage] = useState(STAGE_INIT);
  const [txHash, setTxHash] = useState(null);
  const [txHeight, setTxHeight] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const confirmTx = async () => {
      if (jsCyber !== null && txHash !== null) {
        setStage(STAGE_CONFIRMING);
        const response = await getTxs(txHash);
        console.log('response :>> ', response);
        if (response && response !== null) {
          if (response.logs) {
            setStage(STAGE_CONFIRMED);
            setTxHeight(response.height);
            if (updateFnc) {
              updateFnc();
            }
            return;
          }
          if (response.code) {
            setStage(STAGE_ERROR);
            setTxHeight(response.height);
            setErrorMessage(response.raw_log);
            return;
          }
        }
        setTimeout(confirmTx, 1500);
      }
    };
    confirmTx();
  }, [jsCyber, txHash]);

  const investmint = async () => {
    if (keplr !== null && addressActive !== null) {
      const [{ address }] = await keplr.signer.getAccounts();
      const fee = {
        amount: [],
        gas: DEFAULT_GAS_LIMITS.toString(),
      };
      if (addressActive.bech32 === address) {
        const response = await keplr.investmint(
          address,
          coin(parseFloat(value), 'hydrogen'),
          selected,
          parseFloat(BASE_VESTING_TIME * valueDays),
          fee
        );
        console.log(`response`, response);
        checkTxs(response, { setTxHash, setErrorMessage, setStage });
      } else {
        setErrorMessage(
          <span>
            Add address <Account margin="0 5px" address={address} /> to your
            pocket or make active{' '}
          </span>
        );
        setStage(STAGE_ERROR);
      }
    }
  };

  const updateCallbackFnc = (response) => {
    checkTxs(response, { setTxHash, setErrorMessage, setStage });
  };

  const investmintCyberCigner = async () => {
    if (cyberSigner !== null) {
      const dataMsgs = new Msgs();
      const [{ address }] = await cyberSigner.signer.getAccounts();
      const msgs = await dataMsgs.investmint(
        address,
        coin(parseFloat(value), 'hydrogen'),
        selected,
        parseFloat(BASE_VESTING_TIME * valueDays)
      );
      console.log('msgs', msgs)
      updateValueTxs([msgs]);
      updateCallbackSigner(updateCallbackFnc);
    }
  };

  const chooseSigner = () => {
    if (addressActive !== null) {
      if (addressActive.keys === 'keplr') {
        investmint();
      }

      if (addressActive.keys === 'cyberSigner') {
        investmintCyberCigner();
      }
    }
  };

  const cleatState = () => {
    setStage(STAGE_INIT);
    setTxHash(null);
    setTxHeight(null);
    setErrorMessage(null);
  };

  if (addressActive === null) {
    return (
      <ActionBarContainer>
        <ActionBarContentText>
          Start by adding a address to
          <Link style={{ marginLeft: 5 }} to="/">
            your pocket
          </Link>
          .
        </ActionBarContentText>
      </ActionBarContainer>
    );
  }

  if (jsCyber === null) {
    return (
      <ActionBarContainer>
        <Dots big />
      </ActionBarContainer>
    );
  }

  if (stage === STAGE_INIT) {
    return (
      <ActionBarContainer>
        <Button disabled={resourceToken === 0} onClick={chooseSigner}>
          Investmint
        </Button>
      </ActionBarContainer>
    );
  }

  if (stage === STAGE_SUBMITTED) {
    return (
      <ActionBarContainer>
        <ActionBarContentText>
          check the transaction <Dots big />
        </ActionBarContentText>
      </ActionBarContainer>
    );
  }

  if (stage === STAGE_CONFIRMING) {
    return <TransactionSubmitted />;
  }

  if (stage === STAGE_CONFIRMED) {
    return (
      <Confirmed
        txHash={txHash}
        txHeight={txHeight}
        onClickBtnCloce={() => cleatState()}
      />
    );
  }

  if (stage === STAGE_ERROR && errorMessage !== null) {
    return (
      <TransactionError
        errorMessage={errorMessage}
        onClickBtn={() => cleatState()}
      />
    );
  }

  return null;
}

export default ActionBar;

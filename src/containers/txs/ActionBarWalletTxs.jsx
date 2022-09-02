import React, { useContext, useEffect, useCallback, useState } from 'react';
import {
  ActionBar as ActionBarContainer,
  Button,
} from '@cybercongress/gravity';
import { AppContext, AppContextSigner } from '../../context';
import { DEFAULT_GAS_LIMITS, CYBER } from '../../utils/config';
import {
  Dots,
  ActionBarContentText,
  TransactionSubmitted,
  Confirmed,
  TransactionError,
} from '../../components';

const STAGE_INIT = 0;
const STAGE_APPROVE = 1;
const STAGE_CONFIRMING = 2;
const STAGE_CONFIRMED = 3;
const STAGE_ERROR = 11;

const fee = {
  amount: [],
  gas: DEFAULT_GAS_LIMITS.toString(),
};

function ActionBarWalletTxs({
  msgsData,
  addressActive,
  updateFnc,
  txsMsgData,
}) {
  const { keplr, jsCyber } = useContext(AppContext);
  const { cyberSigner, updateValueTxs, updateCallbackSigner } =
    useContext(AppContextSigner);

  const [stage, setStage] = useState(STAGE_INIT);
  const [txHash, setTxHash] = useState(null);
  const [txHeight, setTxHeight] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const confirmTx = async () => {
      if (jsCyber !== null && txHash !== null) {
        setStage(STAGE_CONFIRMING);
        const response = await jsCyber.getTx(txHash);

        console.log('response :>> ', response);
        if (response && response !== null) {
          if (response.code === 0) {
            setStage(STAGE_CONFIRMED);
            setTxHeight(response.height);

            if (updateFnc) {
              updateFnc(response.hash);
            }
            return;
          }
          if (response.code) {
            setStage(STAGE_ERROR);
            setTxHeight(response.height);
            setErrorMessage(response.rawLog);
            return;
          }
        }
        setTimeout(confirmTx, 1500);
      }
    };
    confirmTx();
  }, [jsCyber, txHash]);

  const cleatState = () => {
    setStage(STAGE_INIT);
    setTxHash(null);
    setTxHeight(null);
    setErrorMessage(null);
  };

  const updateCallbackFnc = (result) => {
    try {
      if (result.code === 0) {
        updateCallbackSigner(null);
        setTxHash(result.transactionHash);
      } else {
        setTxHash(null);
        setErrorMessage(result.rawLog.toString());
        setStage(STAGE_ERROR);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const sendTxSigner = useCallback(async () => {
    if (cyberSigner !== null) {
      updateCallbackSigner(updateCallbackFnc);
      updateValueTxs(msgsData);
      setStage(STAGE_APPROVE);
    }
  }, [cyberSigner, msgsData]);

  const sendTxKeplr = useCallback(async () => {
    try {
      if (keplr !== null) {
        setStage(STAGE_APPROVE);
        const [{ address }] = await keplr.signer.getAccounts();
        const result = await keplr.signAndBroadcast(
          address,
          msgsData,
          fee,
          CYBER.MEMO_KEPLR
        );

        if (result.code === 0) {
          setTxHash(result.transactionHash);
        } else {
          setTxHash(null);
          setErrorMessage(result.rawLog.toString());
          setStage(STAGE_ERROR);
        }
      }
    } catch (error) {
      console.log('error', error);
      setStage(STAGE_INIT);
    }
  }, [keplr, msgsData]);

  const onClickSign = useCallback(() => {
    if (addressActive !== null) {
      if (addressActive.keys === 'keplr') {
        sendTxKeplr();
      }

      if (addressActive.keys === 'cyberSigner') {
        sendTxSigner();
      }
    }
  }, [addressActive, msgsData, keplr]);

  if (txsMsgData !== null) {
    return null;
  }

  if (msgsData.length === 0 || addressActive === null) {
    return (
      <ActionBarContainer>
        <ActionBarContentText>
          <Dots />
        </ActionBarContentText>
      </ActionBarContainer>
    );
  }

  if (stage === STAGE_INIT) {
    return (
      <ActionBarContainer>
        <Button
          disabled={msgsData.length === 0 || addressActive === null}
          onClick={onClickSign}
        >
          sign message
        </Button>
      </ActionBarContainer>
    );
  }

  if (stage === STAGE_APPROVE) {
    return (
      <ActionBarContainer>
        <ActionBarContentText>
          <Dots />
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

export default ActionBarWalletTxs;

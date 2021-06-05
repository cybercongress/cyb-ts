import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Signer from './index';
import { AppContextSigner } from '../../context';
import {
  StateSign,
  StateBroadcast,
  StateConfirmed,
  StateInitAccount,
  StateCreateNew,
  StateRestore,
} from './component/ui';

const STAGE_INIT = 0;
const STAGE_SIGN = 1;
const STAGE_CONFIRMING = 2;
const STAGE_CONFIRMED = 3;
const STAGE_INIT_ACC = 1.1;
const STAGE_CREATE_NEW_ACCOUNT = 1.2;
const STAGE_RESTORE_PHARSE = 1.3;

function AppSign() {
  const {
    tx,
    isVisible,
    cyberSigner,
    updateValueIsVisible,
    updateValueTxs,
    updateCyberSigner,
  } = useContext(AppContextSigner);
  const location = useLocation();
  const [stage, setStage] = useState(STAGE_INIT);
  const [msgData, setMsgData] = useState(null);
  const [txHash, setTxHash] = useState(null);

  useEffect(() => {
    rejectStage();
  }, [location.pathname]);

  useEffect(() => {
    const getSigner = async () => {
      const signerObj = new Signer();
      const signerCyber = await signerObj.initSigner();
      const pk = Buffer.from(signerCyber.pubkey).toString('hex');
      console.log(`pk`, pk);
      console.log(`signerCyber`, signerCyber);
      updateCyberSigner(signerCyber);
    };
    getSigner();
  }, []);

  useEffect(() => {
    if (tx !== null) {
      setMsgData(tx);
      setStage(STAGE_SIGN);
      updateValueIsVisible(true);
    }
  }, [tx]);

  useEffect(() => {
    if (txHash !== null) {
      setStage(STAGE_CONFIRMED);
    }
  }, [txHash]);

  const signTx = async () => {
    console.log(`signer`, cyberSigner);
    console.log(`msgData`, msgData);
    if (cyberSigner !== null && msgData !== null) {
      const signerObj = new Signer();
      setStage(STAGE_CONFIRMING);
      const response = await signerObj.sendTxs(cyberSigner, msgData);
      console.log(`response Txs`, response);
      setTxHash(response.transactionHash);
      updateValueTxs(null);
      setMsgData(null);
    }
  };

  const cleaneStage = () => {
    setStage(STAGE_INIT);
    setTxHash(null);
    updateValueIsVisible(false);
  };

  const rejectStage = () => {
    setStage(STAGE_INIT);
    setMsgData(null);
    setTxHash(null);
    updateValueTxs(null);
    updateValueIsVisible(false);
  };

  if (isVisible && stage === STAGE_SIGN) {
    return (
      <StateSign
        msgData={msgData}
        onClickReject={rejectStage}
        onClick={signTx}
      />
    );
  }

  if (isVisible && stage === STAGE_CONFIRMING) {
    return <StateBroadcast />;
  }

  if (isVisible && stage === STAGE_CONFIRMED) {
    return <StateConfirmed txHash={txHash} onClick={rejectStage} />;
  }

  if (isVisible && stage === STAGE_INIT_ACC) {
    return <StateInitAccount />;
  }

  if (isVisible && stage === STAGE_CREATE_NEW_ACCOUNT) {
    return <StateCreateNew />;
  }

  if (isVisible && stage === STAGE_RESTORE_PHARSE) {
    return <StateRestore />;
  }

  return null;
}

export default AppSign;

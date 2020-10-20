import React, { useState, useEffect } from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { Pane, ActionBar, Button } from '@cybercongress/gravity';
import { CosmosDelegateTool } from '../../utils/ledger';
import {
  JsonTransaction,
  TransactionSubmitted,
  Confirmed,
  SendLedger,
  ConnectLadger,
  TransactionError,
  CheckAddressInfo,
} from '../../components';
import { LEDGER, PATTERN_CYBER } from '../../utils/config';
import { getBalanceWallet, statusNode, getTxs } from '../../utils/search/utils';
import { deletPubkey } from './utils';

const imgLedger = require('../../image/ledger.svg');

const {
  STAGE_INIT,
  STAGE_LEDGER_INIT,
  HDPATH,
  LEDGER_OK,
  STAGE_READY,
  STAGE_WAIT,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
  STAGE_ERROR,
  MEMO,
} = LEDGER;

const LEDGER_TX_ACOUNT_INFO = 2.1;

let ledgerApp = null;

function ActionBarLedger({ selectAccount, updateAddress, defaultAccounts }) {
  const [stage, setStage] = useState(STAGE_INIT);
  const [toSend, setToSend] = useState('');
  const [toSendAddres, setToSendAddres] = useState('');
  const [connectLedger, setConnectLedger] = useState(null);
  const [txHeight, setTxHeight] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [addressLedger, setAddressLedger] = useState(null);
  const [addressInfo, setAddressInfo] = useState(null);
  const [disabledGenerate, setDisabledGenerate] = useState(true);
  const [addressToValid, setAddressToValid] = useState(null);
  const [amountSendInputValid, setAmountSendInputValid] = useState(null);

  useEffect(() => {
    if (toSendAddres.match(PATTERN_CYBER) && parseFloat(toSend) > 0) {
      setDisabledGenerate(false);
    } else {
      setDisabledGenerate(true);
    }
  }, [toSendAddres, toSend]);

  useEffect(() => {
    if (parseFloat(toSend) === 0) {
      setAmountSendInputValid('Invalid amount');
    } else {
      setAmountSendInputValid(null);
    }
  }, [toSend]);

  useEffect(() => {
    if (toSendAddres !== '') {
      if (!toSendAddres.match(PATTERN_CYBER)) {
        setAddressToValid('Invalid bech32 address');
      } else {
        setAddressToValid(null);
      }
    }
  }, [toSendAddres]);

  useEffect(() => {
    if (stage === STAGE_LEDGER_INIT) {
      if (addressLedger !== null && selectAccount && selectAccount !== null) {
        const selectAddress = selectAccount.cyber.bech32;
        if (addressLedger.bech32 === selectAddress) {
          getAddressInfo();
        } else {
          setErrorMessage(
            'different address. Add this ledger address to pocket'
          );
          setStage(STAGE_ERROR);
        }
      }
    }
  }, [addressLedger]);

  useEffect(() => {
    const confirmTx = async () => {
      console.log('txHash :>> ', txHash);
      if (txHash && txHash !== null) {
        const response = await getTxs(txHash);
        console.log('response :>> ', response);
        if (response && response !== null) {
          if (response.logs) {
            setStage(STAGE_CONFIRMED);
            setTxHeight(response.height);
            if (updateAddress) {
              updateAddress();
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
  }, [txHash]);

  const getLedgerAddress = async () => {
    const transport = await TransportWebUSB.create(120 * 1000);
    ledgerApp = new CosmosDelegateTool(transport);

    const connect = await ledgerApp.connect();
    if (connect.return_code === LEDGER_OK) {
      setConnectLedger(true);
      const address = await ledgerApp.retrieveAddressCyber(HDPATH);
      setAddressLedger(address);
    } else {
      setConnectLedger(false);
    }
  };

  const getAddressInfo = async () => {
    let addressInfoTemp = {};
    setStage(LEDGER_TX_ACOUNT_INFO);
    const responseBalanceWallet = await getBalanceWallet(addressLedger.bech32);
    if (responseBalanceWallet !== null) {
      addressInfoTemp = responseBalanceWallet.account;
    }
    const responsStatusNode = await statusNode();
    if (responsStatusNode !== null) {
      addressInfoTemp.chainId = responsStatusNode.node_info.network;
    }
    setAddressInfo(addressInfoTemp);
    setStage(STAGE_READY);
  };

  const onClickInitLedger = async () => {
    setStage(STAGE_LEDGER_INIT);
    getLedgerAddress();
  };

  const generateTx = async () => {
    const txContext = {
      accountNumber: addressInfo.account_number,
      chainId: addressInfo.chainId,
      sequence: addressInfo.sequence,
      bech32: addressLedger.bech32,
      pk: addressLedger.pk,
      path: addressLedger.path,
    };
    console.log('addressInfo :>> ', addressInfo);
    const { denom } = addressInfo.coins[0];

    const tx = await ledgerApp.txCreateSendCyber(
      txContext,
      toSendAddres,
      toSend,
      MEMO,
      denom
    );
    signTx(tx, txContext);
  };

  const signTx = async (tx, txContext) => {
    setStage(STAGE_WAIT);
    const sing = await ledgerApp.sign(tx, txContext);
    if (sing.return_code === LEDGER.LEDGER_OK) {
      const applySignature = await ledgerApp.applySignature(
        sing,
        tx,
        txContext
      );
      if (applySignature !== null) {
        setStage(STAGE_SUBMITTED);
        injectTx(applySignature);
      }
    } else {
      setStage(STAGE_ERROR);
      setErrorMessage(sing.error_message);
    }
  };

  const injectTx = async (txBody) => {
    const txSubmit = await ledgerApp.txSubmitCyber(txBody);
    const data = txSubmit;
    console.log('data', data);
    if (data.error) {
      setStage(STAGE_ERROR);
      setErrorMessage(data.error);
    } else {
      setStage(STAGE_SUBMITTED);
      setTxHash(data.data.txhash);
    }
  };

  const cleatState = () => {
    setStage(STAGE_INIT);
    setToSend('');
    setToSendAddres('');
    setConnectLedger(null);
    setTxHeight(null);
    setTxHash(null);
    setErrorMessage(null);
    setAddressLedger(null);
    setAddressInfo(null);
    setDisabledGenerate(true);
    setAddressToValid(null);
    setAmountSendInputValid(null);
    ledgerApp = null;
  };

  const changeDefaultAccounts = async () => {
    if (selectAccount !== null && selectAccount.cyber) {
      localStorage.setItem(
        'pocket',
        JSON.stringify({ [selectAccount.cyber.bech32]: selectAccount })
      );
    }
    if (updateAddress) {
      updateAddress();
    }
  };

  if (stage === STAGE_INIT) {
    return (
      <ActionBar>
        <Pane>
          <Button
            marginX={10}
            onClick={() => deletPubkey(selectAccount, updateAddress)}
          >
            Drop key
          </Button>
          <Button marginX={10} onClick={() => onClickInitLedger()}>
            Send EUL{' '}
            <img
              style={{
                width: 20,
                height: 20,
                marginLeft: '5px',
                paddingTop: '2px',
              }}
              src={imgLedger}
              alt="ledger"
            />
          </Button>
          {!defaultAccounts && (
            <Button marginX={10} onClick={() => changeDefaultAccounts()}>
              Default Accounts
            </Button>
          )}
        </Pane>
      </ActionBar>
    );
  }
  if (stage === STAGE_LEDGER_INIT) {
    return (
      <ConnectLadger
        onClickConnect={() => getLedgerAddress()}
        connectLedger={connectLedger}
      />
    );
  }

  if (stage === LEDGER_TX_ACOUNT_INFO) {
    return <CheckAddressInfo />;
  }
  if (stage === STAGE_READY) {
    return (
      <SendLedger
        onClickBtn={() => generateTx()}
        onChangeInputAmount={(e) => setToSend(e.target.value)}
        valueInputAmount={toSend}
        valueInputAddressTo={toSendAddres}
        onChangeInputAddressTo={(e) => setToSendAddres(e.target.value)}
        disabledBtn={disabledGenerate}
        addressToValid={addressToValid}
        amountSendInputValid={amountSendInputValid}
      />
    );
  }

  if (stage === STAGE_WAIT) {
    return <JsonTransaction />;
  }

  if (stage === STAGE_SUBMITTED) {
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

export default ActionBarLedger;

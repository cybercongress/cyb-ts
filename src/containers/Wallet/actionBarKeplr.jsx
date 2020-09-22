import React, { useEffect, useState } from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { Link } from 'react-router-dom';
import { Pane, Text, ActionBar, Button, Input } from '@cybercongress/gravity';
import { CosmosDelegateTool } from '../../utils/ledger';
import {
  ConnectLadger,
  Dots,
  ActionBarContentText,
  TransactionSubmitted,
  Confirmed,
  TransactionError,
} from '../../components';
import {
  LEDGER,
  CYBER,
  PATTERN_COSMOS,
  PATTERN_CYBER,
  POCKET,
} from '../../utils/config';
import { getTxs } from '../../utils/search/utils';
import { deletPubkey } from './utils';

const { GaiaApi } = require('@chainapsis/cosmosjs/gaia/api');
const { AccAddress } = require('@chainapsis/cosmosjs/common/address');
const { Coin } = require('@chainapsis/cosmosjs/common/coin');
const { MsgSend } = require('@chainapsis/cosmosjs/x/bank');
const {
  defaultBech32Config,
} = require('@chainapsis/cosmosjs/core/bech32Config');

const {
  STAGE_INIT,
  STAGE_ERROR,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
} = LEDGER;

const STAGE_SEND = 1.1;

function ActionBarKeplr({ keplr, accountKeplr, updateAddress, selectCard }) {
  const [stage, setStage] = useState(STAGE_INIT);
  const [amountSend, setAmountSend] = useState('');
  const [recipient, setRecipient] = useState('');
  const [recipientInputValid, setRecipientInputValid] = useState(null);
  const [amountSendInputValid, setAmountSendInputValid] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [txHeight, setTxHeight] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [disabledGenerate, setDisabledGenerate] = useState(true);

  const generateTxSend = async () => {
    const amount = parseFloat(amountSend);
    setStage(STAGE_SUBMITTED);
    await keplr.enable();

    const sender = AccAddress.fromBech32(
      (await keplr.getKeys())[0].bech32Address,
      'cyber'
    );
    const msg = new MsgSend(sender, AccAddress.fromBech32(recipient, 'cyber'), [
      new Coin('eul', amount),
    ]);

    const result = await keplr.sendMsgs(
      [msg],
      {
        gas: 100000,
        memo: '',
        fee: new Coin('eul', 200),
      },
      'async'
    );
    console.log('result: ', result);
    const hash = result.hash.toString('hex').toUpperCase();
    console.log('hash :>> ', hash);
    setTxHash(hash);
  };

  const cleatState = () => {
    setStage(STAGE_INIT);
    setRecipientInputValid(null);
    setAmountSendInputValid(null);
    setRecipient('');
    setAmountSend('');
    setErrorMessage(null);
    setTxHeight(null);
    setTxHash(null);
  };

  useEffect(() => {
    const confirmTx = async () => {
      console.log('txHash :>> ', txHash);
      if (txHash && txHash !== null) {
        setStage(STAGE_CONFIRMING);
        const response = await getTxs(txHash);
        console.log('response :>> ', response);
        if (response && response !== null) {
          if (response.logs) {
            setStage(STAGE_CONFIRMED);
            setTxHeight(response.height);
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

  useEffect(() => {
    if (parseFloat(amountSend) === 0) {
      setAmountSendInputValid('Invalid amount');
    } else {
      setAmountSendInputValid(null);
    }
  }, [amountSend]);

  useEffect(() => {
    if (recipient !== '') {
      if (!recipient.match(PATTERN_CYBER)) {
        setRecipientInputValid('Invalid bech32 address');
      } else {
        setRecipientInputValid(null);
      }
    }
  }, [recipient]);

  useEffect(() => {
    if (recipient.match(PATTERN_CYBER) && parseFloat(amountSend) > 0) {
      setDisabledGenerate(false);
    } else {
      setDisabledGenerate(true);
    }
  }, [recipient, amountSend]);

  if (selectCard === '' && stage === STAGE_INIT) {
    return (
      <ActionBar>
        <Pane>
          <Link
            style={{ paddingTop: 10, paddingBottom: 10, display: 'block' }}
            className="btn"
            to="/gol"
          >
            Play Game of Links
          </Link>
        </Pane>
      </ActionBar>
    );
  }

  if (selectCard === 'pubkey' && stage === STAGE_INIT) {
    return (
      <ActionBar>
        <Pane>
          <Button marginX={10} onClick={() => deletPubkey(updateAddress)}>
            Drop key
          </Button>
          <Button marginX={10} onClick={() => setStage(STAGE_SEND)}>
            Send EUL{' '}
          </Button>
        </Pane>
      </ActionBar>
    );
  }

  if (selectCard === 'gol' && stage === STAGE_INIT) {
    return (
      <ActionBar>
        <Pane>
          <Link
            style={{ paddingTop: 10, paddingBottom: 10, display: 'block' }}
            className="btn"
            to="/gol"
          >
            Play Game of Links
          </Link>
        </Pane>
      </ActionBar>
    );
  }

  if (selectCard === 'pubkey' && stage === STAGE_SEND) {
    return (
      <ActionBar>
        <Pane display="flex" className="contentItem">
          <ActionBarContentText>
            <Input
              value={recipient}
              height={42}
              marginRight={10}
              width="300px"
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="cyber address To"
              isInvalid={recipientInputValid !== null}
              message={recipientInputValid}
            />

            <Input
              value={amountSend}
              height={42}
              width="24%"
              onChange={(e) => setAmountSend(e.target.value)}
              placeholder="EUL"
              isInvalid={amountSendInputValid !== null}
              message={amountSendInputValid}
            />
          </ActionBarContentText>

          <button
            type="button"
            className="btn-disabled"
            disabled={disabledGenerate}
            onClick={() => generateTxSend()}
          >
            Generate Tx
          </button>
        </Pane>
      </ActionBar>
    );
  }
  if (stage === STAGE_SUBMITTED) {
    return (
      <ActionBar>
        <ActionBarContentText>
          check the transaction <Dots big />
        </ActionBarContentText>
      </ActionBar>
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

export default ActionBarKeplr;

import React, { useEffect, useState } from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { Link } from 'react-router-dom';
import { Pane, Text, ActionBar, Button, Input } from '@cybercongress/gravity';
import { CosmosDelegateTool } from '../../utils/ledger';
import { ConnectLadger, Dots, ActionBarContentText } from '../../components';
import {
  LEDGER,
  CYBER,
  PATTERN_COSMOS,
  PATTERN_CYBER,
  POCKET,
} from '../../utils/config';
import { fromBech32 } from '../../utils/utils';
import { deletPubkey } from './utils';

const { GaiaApi } = require('@chainapsis/cosmosjs/gaia/api');
const { AccAddress } = require('@chainapsis/cosmosjs/common/address');
const { Coin } = require('@chainapsis/cosmosjs/common/coin');
const { MsgSend } = require('@chainapsis/cosmosjs/x/bank');
const {
  defaultBech32Config,
} = require('@chainapsis/cosmosjs/core/bech32Config');

const imgLedger = require('../../image/ledger.svg');

const { DIVISOR_CYBER_G } = CYBER;

const {
  STAGE_INIT,
  STAGE_LEDGER_INIT,
  HDPATH,
  LEDGER_OK,
  STAGE_ERROR,
} = LEDGER;

const STAGE_SEND = 1.1;
const STAGE_ADD_ADDRESS_USER = 2.1;
const STAGE_ADD_ADDRESS_OK = 2.2;
const LEDGER_TX_ACOUNT_INFO = 2.5;

const generateTxSend = () => {
  let recipient = 'cyber1hq8d6pu2l6wkrwu9jxcqjcu55g8l43zxlm7p6t';
  let amount = '10';

  try {
    // Parse bech32 address and validate it.
    recipient = AccAddress.fromBech32(recipient, 'cyber');
  } catch {
    alert('Invalid bech32 address');
    return false;
  }

  amount = parseFloat(amount);
  if (isNaN(amount)) {
    alert('Invalid amount');
    return false;
  }

  (async () => {
    // See above.
    const cosmosJS = new GaiaApi(
      {
        chainId: 'euler-6',
        walletProvider: window.cosmosJSWalletProvider,
        rpc: 'https://api.cyber.cybernode.ai',
        rest: 'https://titan.cybernode.ai/lcd',
      },
      {
        bech32Config: defaultBech32Config('cyber'),
      }
    );

    // See above.
    await cosmosJS.enable();

    // Get the user's key.
    // And, parse bech32 address and validate it.
    const sender = AccAddress.fromBech32(
      (await cosmosJS.getKeys())[0].bech32Address,
      'cyber'
    );
    console.log('recipient :>> ', recipient);
    console.log('sender', sender);
    console.log('new Coin("eul", amount)', amount, new Coin('eul', amount));
    // Make send message for bank module.
    const msg = new MsgSend(sender, recipient, [new Coin('eul', amount)]);

    console.log('msg: ', msg);
    // Request sending messages.
    // Fee will be set by the Keplr extension.
    // The gas adjustment has not been implemented yet, so please set the gas manually.
    const result = await cosmosJS.sendMsgs(
      [msg],
      {
        gas: 100000,
        memo: '',
        fee: new Coin('eul', 200),
      },
      'async'
    );

    console.log('result: ', result);

    if (result.code !== undefined && result.code !== 0) {
      alert('Failed to send tx: ' + result.log);
    }

    alert('Succeed to send tx');
  })();

  return false;
};

function ActionBarKeplr({ keplr, accountKeplr, updateAddress, selectCard }) {
  const [stage, setStage] = useState(STAGE_INIT);
  const [amountSend, setAmountSend] = useState('');
  const [recipient, setRecipient] = useState('');
  const [recipientInputValid, setRecipientInputValid] = useState(false);
  const [amountSendInputValid, setAmountSendInputValid] = useState(false);

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
          <Button marginX={10} onClick={deletPubkey}>
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
              isInvalid={recipientInputValid}
              message="Invalid addressTo"
            />

            <Input
              value={amountSend}
              height={42}
              width="24%"
              onChange={(e) => setAmountSend(e.target.value)}
              placeholder="EUL"
              isInvalid={amountSendInputValid}
              message="Invalid amount"
            />
          </ActionBarContentText>

          <button
            type="button"
            className="btn-disabled"
            // disabled={recipient.length === 0 || amountSend.length === 0}
            onClick={generateTxSend}
          >
            Generate Tx
          </button>
        </Pane>
      </ActionBar>
    );
  }

  return null;
}

export default ActionBarKeplr;

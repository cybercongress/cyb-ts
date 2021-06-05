import React, { useState, useEffect, useContext } from 'react';
import { coins } from '@cosmjs/launchpad';
import { AppContext, AppContextSigner } from '../../context';
import { CYBER } from '../../utils/config';

import Signer from '../signer';

function TestKeplr() {
  const { keplr } = useContext(AppContext);
  const { cyberSigner, updateValueTxs, updateValueIsVisible } = useContext(
    AppContextSigner
  );

  const [hashTx, setHashTx] = useState('');

  console.log('keplr', keplr);
  //   cybervaloper15zs0cjct43xs4z4sesxcrynar5mxm82ftahux2;

  const signerTest = async () => {
    const signer = new Signer();
    const addT = await signer.generationAccount();
    console.log(`addT`, addT);
  };

  const changeValue = () => {
    updateValueIsVisible(true);
  };

  const sendTxSigner = async () => {
    if (cyberSigner !== null) {
      const [{ address }] = await cyberSigner.getAccounts();
      const msgs = [];
      msgs.push({
        type: 'cosmos-sdk/MsgSend',
        value: {
          amount: coins(10, 'eul'),
          from_address: address,
          to_address: 'cyber1ak2zkkde8zaq3fv8dh8d5hclhm80e9q587wmnz',
        },
      });

      updateValueTxs(msgs);
    }
  };

  return (
    <main className="block-body">
      <button
        className="btn"
        style={{ maxWidth: 200, marginTop: 50 }}
        onClick={sendTxSigner}
        type="button"
      >
        sendTxSigner
      </button>

      <button
        className="btn"
        style={{ maxWidth: 200, marginTop: 50 }}
        onClick={changeValue}
        type="button"
      >
        inViseble
      </button>
      <button
        className="btn"
        style={{ maxWidth: 200, marginTop: 50 }}
        onClick={signerTest}
        type="button"
      >
        signerTest
      </button>
      <span>{hashTx}</span>
    </main>
  );
}

export default TestKeplr;

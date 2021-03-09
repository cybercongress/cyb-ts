import React, { useState, useEffect, useContext } from 'react';
import { coins } from '@cosmjs/launchpad';
import { AppContext } from '../../context';
import { CYBER } from '../../utils/config';

function TestKeplr() {
  const { keplr } = useContext(AppContext);
  const [hashTx, setHashTx] = useState('');

  console.log('keplr', keplr);
    //   cybervaloper15zs0cjct43xs4z4sesxcrynar5mxm82ftahux2;

  const sendTx = async () => {
    if (keplr !== null) {
      const chainId = CYBER.CHAIN_ID;
      await window.keplr.enable(chainId);
      const { address } = await keplr.getAccount();
      const msgs = [];
      msgs.push({
        type: 'cosmos-sdk/MsgSend',
        value: {
          amount: coins(10, 'eul'),
          from_address: address,
          to_address: address,
        },
      });

      const fee = {
        amount: coins(0, 'uatom'),
        gas: '100000',
      };
      if (Object.keys(msgs).length > 0) {
        console.log('msgs', msgs);
        const result = await keplr.signAndBroadcast(
          msgs,
          fee,
          CYBER.MEMO_KEPLR
        );
        console.log('result: ', result);
        const hash = result.transactionHash;
        console.log('hash :>> ', hash);
      }
    }
  };

  const delegateTx = async () => {
    if (keplr !== null) {
      const chainId = CYBER.CHAIN_ID;
      await window.keplr.enable(chainId);
      const { address } = await keplr.getAccount();
      const msgs = [];
      msgs.push({
        type: 'cosmos-sdk/MsgDelegate',
        value: {
          amount: {
            amount: '10',
            denom: 'eul',
          },
          delegator_address: address,
          validator_address:
            'cybervaloper15zs0cjct43xs4z4sesxcrynar5mxm82ftahux2',
        },
      });

      const fee = {
        amount: coins(0, 'uatom'),
        gas: '100000',
      };
      if (Object.keys(msgs).length > 0) {
        console.log('msgs', msgs);
        const result = await keplr.signAndBroadcast(
          msgs,
          fee,
          CYBER.MEMO_KEPLR
        );
        console.log('result: ', result);
        const hash = result.transactionHash;
        console.log('hash :>> ', hash);
      }
    }
  };

  return (
    <main className="block-body">
      <button
        className="btn"
        style={{ maxWidth: 200, marginTop: 50 }}
        onClick={sendTx}
        type="button"
      >
        send
      </button>
      <button
        className="btn"
        style={{ maxWidth: 200, marginTop: 50 }}
        onClick={delegateTx}
        type="button"
      >
        delegate
      </button>
      <span>{hashTx}</span>
    </main>
  );
}

export default TestKeplr;

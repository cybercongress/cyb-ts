import React, { useState, useEffect, useContext } from 'react';
import { coins } from '@cosmjs/launchpad';
import { SigningCyberClient, SigningCyberClientOptions } from 'js-cyber';
import { AppContext } from '../../context';
import { CYBER } from '../../utils/config';

const configKeplr = () => {
  return {
    // Chain-id of the Cosmos SDK chain.
    chainId: CYBER.CHAIN_ID,
    // The name of the chain to be displayed to the user.
    chainName: CYBER.CHAIN_ID,
    // RPC endpoint of the chain.
    rpc: 'https://rpc.bostromdev.cybernode.ai',
    rest: 'https://lcd.bostromdev.cybernode.ai',
    stakeCurrency: {
      coinDenom: 'NICK',
      coinMinimalDenom: 'nick',
      coinDecimals: 0,
    },
    bip44: {
      // You can only set the coin type of BIP44.
      // 'Purpose' is fixed to 44.
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: 'cyber',
      bech32PrefixAccPub: 'cyberpub',
      bech32PrefixValAddr: 'cybervaloper',
      bech32PrefixValPub: 'cybervaloperpub',
      bech32PrefixConsAddr: 'cybervalcons',
      bech32PrefixConsPub: 'cybervalconspub',
    },
    currencies: [
      {
        // Coin denomination to be displayed to the user.
        coinDenom: 'NICK',
        // Actual denom (i.e. uatom, uscrt) used by the blockchain.
        coinMinimalDenom: 'nick',
        // # of decimal points to convert minimal denomination to user-facing denomination.
        coinDecimals: 0,
      },
    ],
    // List of coin/tokens used as a fee token in this chain.
    feeCurrencies: [
      {
        // Coin denomination to be displayed to the user.
        coinDenom: 'NICK',
        // Actual denom (i.e. uatom, uscrt) used by the blockchain.
        coinMinimalDenom: 'nick',
        // # of decimal points to convert minimal denomination to user-facing denomination.
        coinDecimals: 0,
      },
    ],
    coinType: 118,
    gasPriceStep: {
      low: 0,
      average: 0,
      high: 0,
    },
  };
};

function TestKeplr() {
  const [hashTx, setHashTx] = useState('');
  const [from, setFrom] = useState(
    'QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe3'
  );
  const [to, setTo] = useState(
    'QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe1'
  );

  const link = async () => {
    if (window.keplr || window.getOfflineSigner) {
      if (window.keplr.experimentalSuggestChain) {
        await window.keplr.experimentalSuggestChain(configKeplr());
        await window.keplr.enable(CYBER.CHAIN_ID);

        const signer = window.getOfflineSigner(CYBER.CHAIN_ID);
        console.log(`signer`, signer);
        const accounts = await signer.getAccounts();
        console.log(`accounts`, accounts);

        const client = await SigningCyberClient.connectWithSigner(
          'https://rpc.bostromdev.cybernode.ai',
          signer
        );
        console.log(`client`, client);
        const response = await client.cyberlink(accounts[0].address, from, to);
        console.log(`response`, response);
        setHashTx(response);
      }
    }
  };

  return (
    <main className="block-body">
      <div>from</div>
      <input
        value={from}
        style={{ width: 550, marginBottom: 20 }}
        onChange={(e) => setFrom(e.target.value)}
      />
      <div>to</div>
      <input
        value={to}
        style={{ width: 550 }}
        onChange={(e) => setTo(e.target.value)}
      />
      <button
        className="btn"
        style={{ maxWidth: 200, marginTop: 50 }}
        onClick={link}
        type="button"
      >
        link
      </button>
      <span>{hashTx}</span>
    </main>
  );
}

export default TestKeplr;

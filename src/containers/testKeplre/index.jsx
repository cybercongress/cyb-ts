import React, { useState, useEffect, useContext } from 'react';
import { coin, coins } from '@cosmjs/launchpad';
import { SigningCyberClient, SigningCyberClientOptions } from '@cybercongress/cyber-js';
import { Tablist, Pane } from '@cybercongress/gravity';
import { AppContext } from '../../context';
import { CYBER, DEFAULT_GAS_LIMITS, COSMOS } from '../../utils/config';
import { trimString, formatNumber } from '../../utils/utils';
import { Btn } from './ui';
import Convert from './convert';

const { SigningStargateClient } = require('@cosmjs/stargate');

function TestKeplr() {
  const [hashTx, setHashTx] = useState('');
  const [addressEnergyRoute, setAddressEnergyRoute] = useState(
    'cyber1njj4p35u8pggm7nypg3y66rypgvk2atjcy7ngp'
  );
  const [validatorAddress, setValidatorAddress] = useState(
    'cybervaloper1frk9k38pvp70vheezhdfd4nvqnlsm9dw4txuxm'
  );
  const [alias, setAlias] = useState('');
  const [aliasRouteAlias, setAliasRouteAlias] = useState('');
  const [amount, setAmount] = useState(0);
  const [amountStake, setAmountStake] = useState(0);
  const [time, setTime] = useState(100);
  const [select, setSelect] = useState('volt');
  const [selected, setSelected] = useState('txs');
  const [amountSend, setAmountSend] = useState('');
  const [allBalances, setAllBalances] = useState({});
  const [addressTo, setAddressTo] = useState(
    'cyber1njj4p35u8pggm7nypg3y66rypgvk2atjcy7ngp'
  );
  const [from, setFrom] = useState(
    'QmRX8qYgeZoYM3M5zzQaWEpVFdpin6FvVXvp6RPQK3oufV'
  );
  const [to, setTo] = useState(
    'QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe2'
  );
  const [bandwidthPrice, setBandwidthPrice] = useState(0);
  const [accountBandwidth, setAccountBandwidth] = useState({});
  const [sourceRoutes, setSourceRoutes] = useState([]);
  const [destinationRoutes, setDestinationRoutes] = useState([]);
  const [destinationRoutedEnergy, setDestinationRoutedEnergy] = useState([]);
  const [sourceRoutedEnergy, setSourceRoutedEnergy] = useState([]);
  const [destination, setDestination] = useState(
    'cyber1njj4p35u8pggm7nypg3y66rypgvk2atjcy7ngp'
  );

  // const link = async () => {
  //   if (keplr !== null) {
  //     console.log(`client`, keplr);
  //     const firstAddress = (await keplr.signer.getAccounts())[0].address;

  //     const response = await keplr.cyberlink(firstAddress, from, to);
  //     console.log(`response`, response);
  //     setHashTx(response.transactionHash);
  //   }
  // };

  const send = async () => {
    // await window.keplr.enable(COSMOS.CHAIN_ID);
    // const offlineSigner = await window.getOfflineSignerAuto(COSMOS.CHAIN_ID);
    // console.log(`offlineSigner`, offlineSigner)
    // const [{ address }] = await offlineSigner.getAccounts();

    // console.log(`accounts`, address);

    // const fee = {
    //   amount: [],
    //   gas: DEFAULT_GAS_LIMITS.toString(),
    // };

    // const client = await SigningStargateClient.connectWithSigner(
    //   'https://rpc.cosmoshub-4.cybernode.ai',
    //   offlineSigner
    // );
    // console.log(`cosmJS`, client);

    // const result = await client.sendTokens(
    //   address,
    //   'cosmos16macu2qtc0jmqc7txvf0wkz84cycsx72ywrucl',
    //   coins(10000, 'uatom'),
    //   fee
    // );

    // console.log(`result`, result);
    // if (keplr !== null) {
    //   try {
    //     const firstAddress = (await keplr.signer.getAccounts())[0].address;
    //     const response = await keplr.sendTokens(
    //       firstAddress,
    //       addressTo,
    //       coins(parseFloat(amountSend), select)
    //     );
    //     console.log(`response`, response);
    //     setHashTx(response.transactionHash);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
  };

  return (
    <main className="block-body">
      <Pane marginTop={30} marginBottom={50} display="grid">
        {/* <Txs /> */}
        {selected === 'txs' && (
          <>
            {/* <div style={{ margin: '50px 0', border: '1px solid #fff' }} />
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
            </button> */}
            <div style={{ margin: '50px 0', border: '1px solid #fff' }} />
            <span
              style={{
                position: 'fixed',
                right: '10%',
                fontSize: '20px',
                color: '#3fb990',
              }}
            >
              {trimString(hashTx, 8, 8)}
            </span>
            <div style={{ margin: '50px 0', border: '1px solid #fff' }} />
            amount
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '150px 100px 100px 100px',
                marginBottom: 5,
                gridGap: '2px',
              }}
            >
              <input
                value={amountSend}
                style={{ width: 100, height: 42, textAlign: 'end' }}
                onChange={(e) => setAmountSend(e.target.value)}
              />
              <Btn
                text="nick"
                checkedSwitch={select === 'nick'}
                onSelect={() => setSelect('nick')}
              />
              <Btn
                text="volt"
                checkedSwitch={select === 'volt'}
                onSelect={() => setSelect('volt')}
              />
              <Btn
                text="amper"
                checkedSwitch={select === 'amper'}
                onSelect={() => setSelect('amper')}
              />
            </div>
            addressTo
            <input
              value={addressTo}
              style={{
                width: 450,
                marginBottom: 30,
                height: 42,
                textAlign: 'end',
              }}
              onChange={(e) => setAddressTo(e.target.value)}
            />
            <button
              className="btn"
              style={{ maxWidth: 250, marginTop: 50 }}
              onClick={send}
              type="button"
            >
              send
            </button>
          </>
        )}
      </Pane>
    </main>
  );
}

export default TestKeplr;

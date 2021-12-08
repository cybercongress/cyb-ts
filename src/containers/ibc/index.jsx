import React, { useContext, useEffect, useState } from 'react';
import { coin, coins, GasPrice, parseCoins } from '@cosmjs/launchpad';
import { SigningCyberClient } from '@cybercongress/cyber-js';
import { Pane, Button, Input } from '@cybercongress/gravity';
import Long from 'long';
import { CYBER, DEFAULT_GAS_LIMITS, LEDGER } from '../../utils/config';
import { AppContext } from '../../context';
import { getTxs } from '../../utils/search/utils';
import { configKeplr } from './configKepler';
import useSetupIbc from './useSetupIbc';
import { config, STEPS } from './utils';
import { IbcTxs, Relayer } from './components';

const {
  STAGE_INIT,
  STAGE_ERROR,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
} = LEDGER;

const fee = {
  amount: [],
  gas: DEFAULT_GAS_LIMITS.toString(),
};

const init = async (option) => {
  let signer = null;
  console.log(`window.keplr `, window.keplr);
  console.log(`window.getOfflineSignerAuto`, window.getOfflineSignerAuto);
  if (window.keplr || window.getOfflineSignerAuto) {
    if (window.keplr.experimentalSuggestChain) {
      await window.keplr.experimentalSuggestChain(configKeplr(option));
      await window.keplr.enable(option.chainId);
      const offlineSigner = await window.getOfflineSignerAuto(option.chainId);
      signer = offlineSigner;
      console.log(`offlineSigner`, offlineSigner);
      // setSigner(offlineSigner);
    }
  }
  return signer;
};

function Ibc() {
  // const { keplr, jsCyber } = useContext(AppContext);
  const [step, setStep] = useState(STEPS.ENTER_CHAIN_A);
  const [configChains, setConfigChains] = useState(config);
  const { signerA, relayerLog, channels } = useSetupIbc(
    step,
    configChains,
    setStep
  );
  const [cyberClient, setCyberClient] = useState(null);
  const [stage, setStage] = useState(STAGE_INIT);
  const [txHash, setTxHash] = useState(null);
  const [txHeight, setTxHeight] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [amount, setAmount] = useState('');
  const [sourceChannel, setSourceChannel] = useState('channel-1');
  const [recipientAddress, setRecipientAddress] = useState(
    'bostrom180tz4ahtyfhwnqwkpdqj3jelyxff4wlx2ymsv3'
  );

  // console.log(`relayerLog`, relayerLog)

  useEffect(() => {
    const createClient = async () => {
      const signerChainA = await init(configChains.chainA);
      const options = { prefix: CYBER.BECH32_PREFIX_ACC_ADDR_CYBER };
      const client = await SigningCyberClient.connectWithSigner(
        configChains.chainA.rpcEndpoint,
        signerChainA,
        options
      );
      setCyberClient(client);
    };
    createClient();
  }, [signerA, configChains.chainA]);

  const sendIBCtransaction = async () => {
    const [{ address }] = await cyberClient.signer.getAccounts();

    const transferAmount = parseCoins(amount)[0];
    const sourcePort = 'transfer';
    const timeoutTimestamp = Long.fromString(
      `${new Date().getTime() + 60000}000000`
    );
    // const timeoutHeight = undefined;
    const msg = {
      typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
      value: {
        sourcePort,
        sourceChannel,
        sender: address,
        receiver: recipientAddress,
        timeoutTimestamp,
        token: transferAmount,
      },
    };

    // const response = await keplr.sendIbcTokens(
    //   address,
    //   recipientAddress,
    //   transferAmount,
    //   sourcePort,
    //   sourceChannel,
    //   timeoutHeight,
    //   timeoutTimestamp,
    //   fee
    // );

    try {
      const response = await cyberClient.signAndBroadcast(
        address,
        [msg],
        fee,
        ''
      );
      console.log(`response`, response);
    } catch (e) {
      console.error(`Caught error: `, e);
    }
  };

  const onChangeConfigChains = (id, key, value) => {
    setConfigChains((item) => ({
      ...item,
      [`chain${id}`]: {
        ...item[`chain${id}`],
        [key]: value,
      },
    }));
  };

  const stateIbcTxs = {
    amount,
    setAmount,
    sourceChannel,
    setSourceChannel,
    recipientAddress,
    setRecipientAddress,
    cyberClient,
    sendIBCtransaction,
  };

  const stateRelayer = {
    configChains,
    onChangeConfigChains,
    setStep,
    relayerLog,
  };

  return (
    <main
      className="block-body"
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
    >
      <div>
        <IbcTxs state={stateIbcTxs} />
        <br />
        <hr />
        <br />
        <div>
          {channels !== null && (
            <>
              src
              {channels.src && <div>{JSON.stringify(channels.src)}</div>}
              <br />
              dest
              {channels.dest && <div>{JSON.stringify(channels.dest)}</div>}
            </>
          )}
        </div>
      </div>
      <Relayer step={step} state={stateRelayer} />
    </main>
  );
}

export default Ibc;

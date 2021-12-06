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

function Ibc() {
  // const { keplr, jsCyber } = useContext(AppContext);
  const [step, setStep] = useState(STEPS.ENTER_CHAIN_A);
  const [configChains, setConfigChains] = useState(config);
  const { signerA } = useSetupIbc(step);
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

  useEffect(() => {
    const createClient = async () => {
      if (signerA !== null) {
        const options = { prefix: CYBER.BECH32_PREFIX_ACC_ADDR_CYBER };
        const client = await SigningCyberClient.connectWithSigner(
          configChains.chainA.rpcEndpoint,
          signerA,
          options
        );
        setCyberClient(client);
      }
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
    setConfigChains,
  };

  return (
    <main className="block-body">
      <IbcTxs state={stateIbcTxs} />
      <Relayer step={step} state={stateRelayer} />
    </main>
  );
}

export default Ibc;

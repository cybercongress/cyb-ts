import { useEffect, useState } from 'react';
import { parseCoins } from '@cosmjs/launchpad';
import { SigningCyberClient } from '@cybercongress/cyber-js';
import Long from 'long';
import { DEFAULT_GAS_LIMITS } from '../../utils/config';
import { configKeplr } from './configKepler';
import useSetupIbc, { getKeplr } from './useSetupIbc';
import { config, STEPS } from './utils';
import { IbcTxs, Relayer } from './components';

const fee = {
  amount: [],
  gas: DEFAULT_GAS_LIMITS.toString(),
};

const channelsIbcValue = {
  src: {
    portId: 'transfer',
    cannelId: 'channel-1',
    connectionId: 'connection-1',
  },
  dest: {
    portId: 'transfer',
    cannelId: 'channel-1',
    connectionId: 'connection-1',
  },
};

const init = async (keplr, option) => {
  let signer = null;
  console.log(`window.keplr `, keplr);
  console.log(`window.getOfflineSignerAuto`, window.getOfflineSignerAuto);
  if (keplr || window.getOfflineSignerAuto) {
    if (keplr.experimentalSuggestChain) {
      await keplr.experimentalSuggestChain(configKeplr(option));
      await keplr.enable(option.chainId);
      const offlineSigner = await window.getOfflineSignerAuto(option.chainId);
      signer = offlineSigner;
      console.log(`offlineSigner`, offlineSigner);
      // setSigner(offlineSigner);
    }
  }
  return signer;
};

const setupClient = async (keplr, option) => {
  const signer = await init(keplr, option);
  const options = { prefix: option.addrPrefix };
  const client = await SigningCyberClient.connectWithSigner(
    option.rpcEndpoint,
    signer,
    options
  );

  return client;
};

function Ibc() {
  // const { keplr, jsCyber } = useContext(AppContext);
  const [step, setStep] = useState(STEPS.ENTER_CHAIN_A);
  const [configChains, setConfigChains] = useState(config);
  const [valueChannelsRelayer, setValueChannelsRelayer] =
    useState(channelsIbcValue);
  const { relayerLog, channels } = useSetupIbc(
    step,
    configChains,
    setStep,
    valueChannelsRelayer
  );
  const [cyberClientA, setCyberClientA] = useState(null);
  const [cyberClientB, setCyberClientB] = useState(null);
  const [amountA, setAmountA] = useState('');
  const [sourceChannelA, setSourceChannelA] = useState('channel-1');
  const [recipientAddressA, setRecipientAddressA] = useState(
    'bostrom180tz4ahtyfhwnqwkpdqj3jelyxff4wlx2ymsv3'
  );
  const [amountB, setAmountB] = useState('');
  const [sourceChannelB, setSourceChannelB] = useState('channel-1');
  const [recipientAddressB, setRecipientAddressB] = useState(
    'bostrom180tz4ahtyfhwnqwkpdqj3jelyxff4wlx2ymsv3'
  );
  // console.log(`relayerLog`, relayerLog)

  useEffect(() => {
    const createClient = async () => {
      const keplr = await getKeplr();

      const clientA = await setupClient(keplr, configChains.chainA);
      setCyberClientA(clientA);

      const clientB = await setupClient(keplr, configChains.chainB);
      setCyberClientB(clientB);
    };
    createClient();
  }, [configChains]);

  const sendIBCtransaction = async (
    cyberClient,
    amount,
    recipientAddress,
    sourceChannel
  ) => {
    const [{ address }] = await cyberClient.signer.getAccounts();

    const transferAmount = parseCoins(amount)[0];
    const sourcePort = 'transfer';
    const timeoutTimestamp = Long.fromString(
      `${new Date().getTime() + 60000}000000`
    );

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

  const onChangeValueChannelsRelayer = (id, key, value) => {
    setValueChannelsRelayer((item) => ({
      ...item,
      [id]: {
        ...item[id],
        [key]: value,
      },
    }));
  };

  const onClickSendIBCtransaction = (id) => {
    if (id === 'A') {
      sendIBCtransaction(
        cyberClientA,
        amountA,
        recipientAddressA,
        sourceChannelA
      );
    } else {
      sendIBCtransaction(
        cyberClientB,
        amountB,
        recipientAddressB,
        sourceChannelB
      );
    }
  };

  const stateRelayer = {
    configChains,
    onChangeConfigChains,
    setStep,
    relayerLog,
    valueChannelsRelayer,
    onChangeValueChannelsRelayer,
  };

  return (
    <main
      className="block-body"
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
    >
      <div>
        chainA
        <IbcTxs
          id="A"
          onChangeAmount={setAmountA}
          setSourceChannel={setSourceChannelA}
          setRecipientAddress={setRecipientAddressA}
          amount={amountA}
          sourceChannel={sourceChannelA}
          recipientAddress={recipientAddressA}
          onClickSend={onClickSendIBCtransaction}
          disabledSend={cyberClientA === null}
        />
        <br />
        <hr />
        <br />
        chainB
        <IbcTxs
          id="B"
          onChangeAmount={setAmountB}
          setSourceChannel={setSourceChannelB}
          setRecipientAddress={setRecipientAddressB}
          amount={amountB}
          sourceChannel={sourceChannelB}
          recipientAddress={recipientAddressB}
          onClickSend={onClickSendIBCtransaction}
          disabledSend={cyberClientB === null}
        />
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

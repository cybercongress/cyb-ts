import { useEffect, useState } from 'react';
import { IbcClient, Link } from '@confio/relayer/build';
import { GasPrice } from '@cosmjs/launchpad';
import { config } from './utils';
import { configKeplr } from './configKepler';

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

const logger = (setRelayerLog) => {
  return {
    log: (msg) => {
      setRelayerLog((item) => [...item, `LOG:  ${msg}`]);
    },
    info: (msg) => {
      setRelayerLog((item) => [...item, `INFO:  ${msg}`]);
    },
    error: (msg) => {
      setRelayerLog((item) => [...item, `ERROR:  ${msg}`]);
    },
    warn: (msg) => {
      setRelayerLog((item) => [...item, `WARN:  ${msg}`]);
    },
    verbose: (msg) => {
      setRelayerLog((item) => [...item, `VERBOSE:  ${msg}`]);
    },
    debug: (msg) => {
      setRelayerLog((item) => [...item, `DEBUG:  ${msg}`]);
    },
  };
};

const getKeplr = async () => {
  if (window.keplr) {
    return window.keplr;
  }

  if (document.readyState === 'complete') {
    return window.keplr;
  }

  return new Promise((resolve) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === 'complete') {
        resolve(window.keplr);
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};

function useSetupIbc() {
  const [signerA, setSignerA] = useState(null);
  const [signerB, setSignerB] = useState(null);
  const [clientA, setClientA] = useState(null);
  const [clientB, setClientB] = useState(null);
  const [link, setLink] = useState(null);
  const [channels, setChannels] = useState(null);
  const [relayerLog, setRelayerLog] = useState([]);

  useEffect(() => {
    const getKeplrClient = async () => {
      const keplr = await getKeplr();
      if (keplr) {
        initSigner();
      }
    };
    getKeplrClient();
  }, []);

  useEffect(() => {
    window.addEventListener('keplr_keystorechange', () => {
      initSigner();
    });
  }, []);

  const initSigner = async () => {
    const signerChainA = await init(config.chainA);
    // console.warn(`signerChainA`, signerChainA);
    setSignerA(signerChainA);
    const signerChainB = await init(config.chainB);
    setSignerB(signerChainB);
  };

  const setupRelayer = async () => {
    if (signerA !== null && signerB !== null) {
      // get addresses
      const accountA = (await signerA.getAccounts())[0].address;
      const accountB = (await signerB.getAccounts())[0].address;

      // Create IBC Client for chain A
      const clientIbcA = await IbcClient.connectWithSigner(
        config.chainA.rpcEndpoint,
        signerA,
        accountA,
        {
          prefix: config.chainA.addrPrefix,
          logger: logger(),
          gasPrice: GasPrice.fromString(config.chainA.gasPrice),
        }
      );
      console.group('IBC Client for chain A');
      console.log(clientIbcA);
      console.groupEnd('IBC Client for chain A');
      // Create IBC Client for chain B
      const clientIbcB = await IbcClient.connectWithSigner(
        config.chainB.endpoint,
        signerB,
        accountB.address,
        {
          prefix: config.chainB.addrPrefix,
          logger: logger(),
          gasPrice: GasPrice.fromString(config.chainB.gasPrice),
        }
      );
      console.group('IBC Client for chain B');
      console.log(clientIbcB);
      console.groupEnd('IBC Client for chain B');

      // Create new connectiosn for the 2 clients
      const linkIbc = await Link.createWithNewConnections(
        clientIbcA,
        clientIbcB,
        logger()
      );

      console.group('IBC Link Details');
      console.log(linkIbc);
      console.groupEnd('IBC Link Details');
      // Create a channel for the connections
      const channelsIbc = await linkIbc.createChannel(
        'A',
        'transfer',
        'transfer',
        1,
        'ics20-1'
      );
      setChannels(channelsIbc);
      console.group('IBC Channel Details');
      console.log(channelsIbc);
      console.groupEnd('IBC Channel Details');
    }
  };

  return { signerA, signerB, link, channels, relayerLog };
}

export default useSetupIbc;

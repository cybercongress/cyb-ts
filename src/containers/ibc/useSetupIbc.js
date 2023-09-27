/* eslint-disable no-await-in-loop */
import { useEffect, useState } from 'react';
import { IbcClient, Link } from '@confio/relayer/build';
import { GasPrice } from '@cosmjs/launchpad';
import { stringToPath } from '@cosmjs/crypto';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { config, STEPS } from './utils';

import { configKeplr } from './configKepler';
import { getKeplr } from 'src/utils/keplrUtils';

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

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const setupClientIbc = async (signer, option, logger) => {
  const account = (await signer.getAccounts())[0].address;

  // Create IBC Client for chain A
  const clientIbc = await IbcClient.connectWithSigner(
    option.rpcEndpoint,
    signer,
    account,
    {
      prefix: option.addrPrefix,
      logger,
      gasPrice: GasPrice.fromString(option.gasPrice),
    }
  );

  return clientIbc;
};

let nextRelay = {};

function useSetupIbc(step, configChains, setStep, valueChannelsRelayer) {
  const [running, setRunning] = useState(false);
  const [signerA, setSignerA] = useState(null);
  const [signerB, setSignerB] = useState(null);
  const [link, setLink] = useState(null);
  const [channels, setChannels] = useState(null);
  const [relayerLog, setRelayerLog] = useState([]);

  useEffect(() => {
    if (step === STEPS.INIT_STATE) {
      setRunning(false);
    }

    if (
      step === STEPS.SETUP_RELAYER ||
      step === STEPS.RUN_RELAYER_WITH_EXISTING
    ) {
      setupRelayer();
    }

    if (step === STEPS.RUN_RELAYER) {
      setRunning(true);
    }

    if (step === STEPS.STOP_RELAYER) {
      setRunning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    const getKeplrClient = async () => {
      if (step === STEPS.SETUP_SIGNERS) {
        const keplr = await getKeplr();
        if (keplr) {
          initSigner();
        }
      }
    };
    getKeplrClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    window.addEventListener('keplr_keystorechange', () => {
      initSigner();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const relayerLoop = async (
      options = { poll: 5000, maxAgeDest: 300, maxAgeSrc: 300 }
    ) => {
      if (link !== null) {
        while (running) {
          try {
            const nextRelayTemp = await link.checkAndRelayPacketsAndAcks(
              { nextRelay },
              2,
              6
            );
            nextRelay = nextRelayTemp;
            console.group('Next Relay:');
            console.log(nextRelay);
            console.groupEnd('Next Relay:');
            await link.updateClientIfStale('A', options.maxAgeDest);
            await link.updateClientIfStale('B', options.maxAgeSrc);
          } catch (e) {
            console.error(`Caught error: `, e);
          }
          await sleep(options.poll);
        }
      }
    };
    relayerLoop();
  }, [link, running]);

  const initSigner = async () => {
    const signerChainA = await init(configChains.chainA);
    // const signerChainA = await DirectSecp256k1HdWallet.fromMnemonic(
    //   config.chainA.mnemonic,
    //   {
    //     hdPaths: [stringToPath("m/44'/118'/0'/0/0")],
    //     prefix: config.chainA.addrPrefix,
    //   }
    // );
    console.log(`signerChainA`, signerChainA);
    // console.warn(`signerChainA`, signerChainA);
    setSignerA(signerChainA);
    const signerChainB = await init(configChains.chainB);
    // const signerChainB = await DirectSecp256k1HdWallet.fromMnemonic(
    //   config.chainB.mnemonic,
    //   {
    //     hdPaths: [stringToPath("m/44'/118'/0'/0/0")],
    //     prefix: config.chainB.addrPrefix,
    //   }
    // );
    console.log(`signerChainB`, signerChainB);
    setSignerB(signerChainB);
    setStep(STEPS.INIT_RELAYER);
  };

  const setupRelayer = async () => {
    if (signerA !== null && signerB !== null) {
      // Create IBC Client for chain A
      const clientIbcA = await setupClientIbc(
        signerA,
        configChains.chainA,
        logger()
      );
      console.group('IBC Client for chain A');
      console.log(clientIbcA);
      console.groupEnd('IBC Client for chain A');
      // Create IBC Client for chain B
      const clientIbcB = await setupClientIbc(
        signerB,
        configChains.chainB,
        logger()
      );

      console.group('IBC Client for chain B');
      console.log(clientIbcB);
      console.groupEnd('IBC Client for chain B');

      let linkIbc = null;

      if (step === STEPS.SETUP_RELAYER) {
        // Create new connectiosn for the 2 clients
        linkIbc = await Link.createWithNewConnections(
          clientIbcA,
          clientIbcB,
          logger()
        );
      }

      if (step === STEPS.RUN_RELAYER_WITH_EXISTING) {
        linkIbc = await Link.createWithExistingConnections(
          clientIbcA,
          clientIbcB,
          valueChannelsRelayer.src.connectionId,
          valueChannelsRelayer.dest.connectionId,
          logger()
        );
      }

      console.group('IBC Link Details');
      console.log(linkIbc);
      console.groupEnd('IBC Link Details');
      setLink(linkIbc);

      let channelsIbc;
      // Create a new channel for the connections
      if (step === STEPS.SETUP_RELAYER) {
        channelsIbc = await linkIbc.createChannel(
          'A',
          'transfer',
          'transfer',
          1,
          'ics20-1'
        );
      }
      // setup channel for the connections
      if (step === STEPS.RUN_RELAYER_WITH_EXISTING) {
        channelsIbc = {
          src: {
            portId: valueChannelsRelayer.src.portId,
            cannelId: valueChannelsRelayer.src.cannelId,
          },
          dest: {
            portId: valueChannelsRelayer.dest.portId,
            cannelId: valueChannelsRelayer.dest.cannelId,
          },
        };
      }

      setChannels(channelsIbc);
      console.group('IBC Channel Details');
      console.log(channelsIbc);
      console.groupEnd('IBC Channel Details');
      setStep(STEPS.RELAYER_READY);
    }
  };

  const logger = () => {
    return {
      log: (msg) => {
        // console.log(`log`, msg);
        setRelayerLog((item) => [...item, `LOG:  ${msg}`]);
      },
      info: (msg) => {
        // console.log(`info`, msg);

        setRelayerLog((item) => [...item, `INFO:  ${msg}`]);
      },
      error: (msg) => {
        // console.log(`error`, msg);

        setRelayerLog((item) => [...item, `ERROR:  ${msg}`]);
      },
      warn: (msg) => {
        // console.log(`warn`, msg);

        setRelayerLog((item) => [...item, `WARN:  ${msg}`]);
      },
      verbose: (msg) => {
        // console.log(`verbose`, msg);

        setRelayerLog((item) => [...item, `VERBOSE:  ${msg}`]);
      },
      debug: (msg) => {
        // console.log(`debug`, msg);

        setRelayerLog((item) => [...item, `DEBUG:  ${msg}`]);
      },
    };
  };

  return { signerA, signerB, link, channels, relayerLog };
}

export default useSetupIbc;

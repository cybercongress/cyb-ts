import { Decimal } from '@cosmjs/math';
import { GasPrice } from '@cosmjs/stargate';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import loadConnections from 'src/containers/ibc/helpers/loadConnections';
import relay from 'src/containers/ibc/helpers/relay';
import useCommunityPassports from 'src/features/passport/hooks/useCommunityPassports';
import { useChannels } from 'src/hooks/useHub';
import { ObjectKey } from 'src/types/data';
import { Channel } from 'src/types/hub';
import { getKeplr } from 'src/utils/keplrUtils';
import networkList, { NetworkCons } from 'src/utils/networkListIbc';

const TeleportContext = React.createContext<{
  channels: undefined | ObjectKey<NetworkCons>;
  relayerLog: any[];
  isRelaying: boolean;
  selectChain: string;
  setSelectChain: (key: string) => void;
  stop: () => void;
}>({
  channels: undefined,
  relayerLog: [],
  isRelaying: false,
  selectChain: '',
  setSelectChain: () => {},
  stop: () => {},
});

function findNetwork(chainId: string) {
  return networkList[chainId];
}

export const useTeleportContext = () => React.useContext(TeleportContext);

function TeleportContextProvider({ children }: { children: React.ReactNode }) {
  useCommunityPassports();
  const { channels } = useChannels();

  const stopFn = useRef<() => void>();

  const [selectChain, setSelectChain] = useState('');
  const [isRelaying, setIsRelaying] = useState(false);
  const [relayerLog, setRelayerLog] = useState([]);

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

  useEffect(() => {
    return () => {
      stopFn.current?.();
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (selectChain.length > 0) {
        setIsRelaying(true);
        const keplrWindow = await getKeplr();

        stopFn.current?.();

        if (!channels || !keplrWindow) {
          return;
        }

        const chainInfos = await keplrWindow.getChainInfosWithoutEndpoints();

        const { sourceChainId: chainIdA, destinationChainId: chainIdB } =
          channels[selectChain];

        const chainInfoA = chainInfos.find((item) => item.chainId === chainIdA);
        const chainInfoB = chainInfos.find((item) => item.chainId === chainIdB);

        if (!chainInfoA || !chainInfoB) {
          return;
        }

        const feeCurrenciesA = chainInfoA.feeCurrencies[0];
        const feeCurrenciesB = chainInfoB.feeCurrencies[0];

        const GasPriceA = new GasPrice(
          Decimal.fromUserInput(
            feeCurrenciesA.gasPriceStep?.average.toString() || '0',
            3
          ),
          feeCurrenciesA?.coinMinimalDenom
        );

        const GasPriceB = new GasPrice(
          Decimal.fromUserInput(
            feeCurrenciesB.gasPriceStep?.average.toString() || '0',
            3
          ),
          feeCurrenciesB?.coinMinimalDenom
        );

        const { rpc: rpcA } = findNetwork(chainIdA);
        const { rpc: rpcB } = findNetwork(chainIdB);

        const signerA = await keplrWindow.getOfflineSignerAuto(chainIdA);
        const signerB = await keplrWindow.getOfflineSignerAuto(chainIdB);

        const [{ address: addressSignerA }] = await signerA.getAccounts();
        const [{ address: addressSignerB }] = await signerB.getAccounts();

        const cxns = await loadConnections(channels[selectChain]);

        if (!cxns.length) {
          return;
        }

        console.log('cxns', cxns)

        const [{ cxnA, cxnB }] = cxns;

        (async () => {
          const config = await relay(
            signerA,
            signerB,
            rpcA,
            rpcB,
            addressSignerA,
            addressSignerB,
            GasPriceA,
            GasPriceB,
            cxnA,
            cxnB,
            addressSignerA,
            addressSignerB,
            0,
            0,
            logger()
          );

          stopFn.current = () => {
            config.stop();
            setIsRelaying(false);
            setSelectChain('');
            setRelayerLog([]);
            stopFn.current = undefined;
          };
        })();
      }
    })();

    return () => {
      stopFn.current?.();
    };
  }, [selectChain, channels]);

  const stop = () => {
    stopFn.current?.();
  };

  const contextValue = useMemo(
    () => ({
      channels,
      relayerLog,
      isRelaying,
      selectChain,
      setSelectChain,
      stop,
    }),
    [channels, relayerLog, isRelaying, selectChain]
  );

  return (
    <TeleportContext.Provider value={contextValue}>
      {children}
    </TeleportContext.Provider>
  );
}

export default TeleportContextProvider;

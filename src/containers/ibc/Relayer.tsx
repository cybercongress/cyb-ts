import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'src/components';
import { useChannels } from 'src/hooks/useHub';
import { getKeplr } from 'src/utils/keplrUtils';
import networkList from 'src/utils/networkListIbc';
import { GasPrice } from '@cosmjs/stargate';
import { Decimal } from '@cosmjs/math';
import loadConnections from '../teleport/helpers/loadConnections';
import relay from '../teleport/helpers/relay';
import { LogRelayer } from './components/relayer';

function findNetwork(chainId: string) {
  return networkList[chainId];
}

function Relayer() {
  const [isRelaying, setIsRelaying] = useState(false);
  const [relayerLog, setRelayerLog] = useState([]);
  const [selectChain, setSelectChain] = useState('');

  const stopFn = useRef<() => void>();
  const { channels } = useChannels();

  console.log('stopFn', stopFn)

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

  // run stop function on unmount using react hook
  useEffect(() => {
    return () => {
      stopFn.current?.();
    };
  }, []);

  // console.log('channels', channels);

  const startRelaying = useCallback(
    async (key: string) => {
      setIsRelaying(true);
      setSelectChain(key);
      const keplrWindow = await getKeplr();

      stopFn.current?.();

      if (!channels || !keplrWindow) {
        return;
      }

      const chainInfos = await keplrWindow.getChainInfosWithoutEndpoints();

      const { source_chain_id: chainIdA, destination_chain_id: chainIdB } =
        channels[key];

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

      const cxns = await loadConnections(channels[key]);

      if (!cxns.length) {
        return;
      }

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
          stopFn.current = undefined;
        };
      })();
    },
    [channels]
  );

  const channelsRow = useMemo(() => {
    if (channels) {
      return Object.keys(channels).map((key, i) => {
        const item = channels[key];
        return (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
            }}
          >
            <div>{item.active}</div>
            <div>{item.id}</div>
            <div>
              <div>{item.destination_chain_id}</div>
              <div>{item.destination_channel_id}</div>
            </div>
            <div>
              <div>{item.source_chain_id}</div>
              <div>{item.source_channel_id}</div>
            </div>
            <Button
              onClick={() => {
                selectChain === key && isRelaying
                  ? stopFn.current?.()
                  : startRelaying(key);
              }}
            >
              {selectChain === key && isRelaying
                ? 'stop Relaying'
                : 'start Relaying'}
            </Button>
          </div>
        );
      });
    }
    return null;
  }, [channels, isRelaying, selectChain]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '80%',
        margin: '0 auto',
        gap: '20px',
        marginTop: '100px',
      }}
    >
      {channelsRow}
      <br />
      <LogRelayer relayerLog={relayerLog} />
    </div>
  );
}

export default Relayer;

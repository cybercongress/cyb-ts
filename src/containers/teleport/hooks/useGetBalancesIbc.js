/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Sha256 } from '@cosmjs/crypto';
import { CYBER } from '../../../utils/config';
import coinDecimalsConfig from '../../../utils/configToken';
import { reduceBalances } from '../../../utils/utils';

const initValueBalance = { amount: 0, denom: '' };

export const networkList = {
  bostrom: { chainId: 'bostrom', rpc: CYBER.CYBER_NODE_URL_API },
  'osmosis-1': {
    chainId: 'osmosis-1',
    sourceChannelId: 'channel-95',
    destChannelId: 'channel-2',
    coinMinimalDenom: 'uosmo',
    coinDecimals: 6,
    denom: 'OSMO',
    rpc: 'https://rpc-osmosis.blockapsis.com/',
    prefix: 'osmo',
    explorerUrlToTx: 'https://www.mintscan.io/osmosis/txs/{txHash}',
  },
  'cosmoshub-4': {
    chainId: 'cosmoshub-4',
    sourceChannelId: 'channel-341',
    destChannelId: 'channel-8',
    coinMinimalDenom: 'uatom',
    coinDecimals: 6,
    denom: 'ATOM',
    rpc: 'https://rpc.cosmoshub-4.cybernode.ai/',
    prefix: 'cosmos',
    explorerUrlToTx: 'https://www.mintscan.io/cosmos/txs/{txHash}',
  },
  'space-pussy': {
    chainId: 'space-pussy',
    coinDecimals: 0,
    denom: 'PUSSY',
    coinMinimalDenom: 'pussy',
    rpc: 'https://rpc.space-pussy.cybernode.ai/',
    prefix: 'pussy',
    sourceChannelId: 'channel-0',
    destChannelId: 'channel-11',
    explorerUrlToTx: 'https://space-pussy.cyb.ai/network/bostrom/tx/{txHash}',
  },
};

const sha256 = (data) => {
  return new Uint8Array(new Sha256().update(data).digest());
};

const ibcDenom = (paths, coinMinimalDenom) => {
  const prefixes = [];
  for (const path of paths) {
    prefixes.push(`${path.portId}/${path.channelId}`);
  }
  const prefix = prefixes.join('/');
  const denom = `${prefix}/${coinMinimalDenom}`;

  return `ibc/${Buffer.from(sha256(Buffer.from(denom)))
    .toString('hex')
    .toUpperCase()}`;
};

// const de = ibcDenom([{ portId: 'transfer', channelId: 'channel-2' }], 'uosmo');

function useGetBalancesIbc(client, denom) {
  const [balanceIbc, setBalanceIbc] = useState(null);
  const [denomIbc, setDenomIbc] = useState(null);

  // useEffect(() => {
  //   const getBalance = async () => {
  //     setBalanceIbc(null);
  //     if (client !== null && denom !== null) {
  //       const responseChainId = client.signer.chainId;
  //       if (responseChainId !== CYBER.CHAIN_ID) {
  //         if (Object.prototype.hasOwnProperty.call(coinDecimalsConfig, denom)) {
  //           const { coinMinimalDenom } = coinDecimalsConfig[denom];
  //           const [{ address }] = await client.signer.getAccounts();

  //           const responseBalance = await client.queryClient.bank.balance(
  //             address,
  //             coinMinimalDenom
  //           );
  //           console.log('response', responseBalance);
  //           setBalanceIbc({ [denom]: responseBalance.amount });
  //         }
  //       }
  //     }
  //   };
  //   getBalance();
  // }, [client, denom]);

  useEffect(() => {
    const getBalance = async () => {
      if (client !== null && denom !== null) {
        const responseChainId = client.signer.chainId;
        if (responseChainId !== CYBER.CHAIN_ID) {
          let coinMinimalDenom = null;
          if (denom.includes('ibc')) {
            coinMinimalDenom = coinDecimalsConfig[denom].coinMinimalDenom;
          } else {
            coinMinimalDenom = ibcDenom(
              [
                {
                  portId: 'transfer',
                  channelId: networkList[responseChainId].sourceChannelId,
                },
              ],
              denom
            );
          }
          const [{ address }] = await client.signer.getAccounts();
          const responseBalance = await client.queryClient.bank.balance(
            address,
            coinMinimalDenom
          );
          setDenomIbc(coinMinimalDenom);
          console.log('response', responseBalance);
          setBalanceIbc({ [coinMinimalDenom]: responseBalance.amount });
        }
      }
    };
    getBalance();
  }, [client, denom]);

  return { balanceIbc, denomIbc };
}

export default useGetBalancesIbc;

import { ObjectKey } from 'src/types/data';
import { CYBER } from './config';

type NetworkCons = {
  chainId: string;
  sourceChannelId: string;
  destChannelId: string;
  coinMinimalDenom: string;
  coinDecimals: number;
  denom: string;
  rpc: string;
  prefix: string;
  explorerUrlToTx: string;
};

const networkList: ObjectKey<NetworkCons> = {
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
  'juno-1': {
    chainId: 'juno-1',
    coinDecimals: 6,
    denom: 'JUNO',
    coinMinimalDenom: 'ujuno',
    rpc: 'https://rpc.uni.junonetwork.io',
    sourceChannelId: 'channel-93',
    destChannelId: 'channel-10',
    prefix: 'juno',
    explorerUrlToTx: 'https://www.mintscan.io/juno/txs/{txHash}',
  },
  'gravity-bridge-3': {
    chainId: 'gravity-bridge-3',
    coinDecimals: 6,
    denom: 'GRAV',
    coinMinimalDenom: 'ugraviton',
    rpc: 'https://gravitychain.io:26657',
    sourceChannelId: 'channel-103',
    destChannelId: 'channel-12',
    prefix: 'gravity',
    explorerUrlToTx: 'https://www.mintscan.io/gravity-bridge/txs/{txHash}',
  },
  'desmos-mainnet': {
    chainId: 'desmos-mainnet',
    coinDecimals: 6,
    denom: 'DSM',
    coinMinimalDenom: 'udsm',
    rpc: 'https://rpc.mainnet.desmos.network',
    sourceChannelId: 'channel-6',
    destChannelId: 'channel-13',
    prefix: 'desmos',
    explorerUrlToTx: 'https://www.mintscan.io/desmos/txs/{txHash}',
  },
  'evmos_9001-2': {
    chainId: 'evmos_9001-2',
    rpc: 'https://tendermint.bd.evmos.org:26657',
    sourceChannelId: 'channel-19',
    destChannelId: 'channel-9',
    prefix: 'evmos',
    explorerUrlToTx: 'https://www.mintscan.io/evmos/txs/{txHash}',
    coinDecimals: 18,
    coinMinimalDenom: 'aevmos',
    denom: 'EVMOS',
  },
  'chihuahua-1': {
    chainId: 'chihuahua-1',
    coinDecimals: 6,
    denom: 'HUAHUA',
    coinMinimalDenom: 'uhuahua',
    rpc: 'https://rpc.chihuahua.wtf',
    sourceChannelId: 'channel-6',
    destChannelId: 'channel-13',
    prefix: 'chihuahua',
    explorerUrlToTx: 'https://www.mintscan.io/chihuahua/txs/{txHash}',
  },
  'axelar-dojo-1': {
    chainId: 'axelar-dojo-1',
    coinDecimals: 6,
    denom: 'AXL',
    coinMinimalDenom: 'uaxl',
    rpc: 'https://rpc-1.axelar.nodes.guru',
    sourceChannelId: 'channel-14',
    destChannelId: 'channel-52',
    prefix: 'axelar',
    explorerUrlToTx: 'https://mintscan.io/axelar/txs/{txHash}',
  },
};

export default networkList;
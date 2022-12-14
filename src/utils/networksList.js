const networkList = [
  {
    chainId: 'osmosis-1',
    chainName: 'osmosis',
    prefix: 'osmo',
    chainIdImageCid: '',
    rpc: 'https://rpc-osmosis.blockapsis.com/',
    explorerUrlToTx: 'https://www.mintscan.io/osmosis/txs/{txHash}',
    currencies: [
      {
        coinDecimals: 6,
        coinMinimalDenom: 'uosmo',
        denom: 'OSMO',
        coinImageCid: '',
      },
    ],
  },
  {
    chainId: 'cosmoshub-4',
    chainName: 'cosmos hub',
    prefix: 'cosmos',
    rpc: 'https://rpc.cosmoshub-4.cybernode.ai/',
    explorerUrlToTx: 'https://www.mintscan.io/cosmos/txs/{txHash}',
    chainIdImageCid: '',
    currencies: [
      {
        coinDecimals: 6,
        coinMinimalDenom: 'uatom',
        denom: 'ATOM',
        coinImageCid: '',
      },
    ],
  },
  {
    chainId: 'space-pussy',
    chainName: 'space-pussy',
    prefix: 'pussy',
    rpc: 'https://rpc.space-pussy.cybernode.ai/',
    explorerUrlToTx: 'https://space-pussy.cyb.ai/network/bostrom/tx/{txHash}',
    chainIdImageCid: '',
    currencies: [
      {
        coinDecimals: 0,
        coinMinimalDenom: 'pussy',
        denom: 'PUSSY',
        coinImageCid: '',
      },
    ],
  },
  {
    chainId: 'juno-1',
    chainName: 'juno',
    prefix: 'juno',
    rpc: 'https://rpc-juno.itastakers.com',
    explorerUrlToTx: 'https://www.mintscan.io/juno/txs/{txHash}',
    chainIdImageCid: '',
    currencies: [
      {
        coinDecimals: 6,
        coinMinimalDenom: 'ujuno',
        denom: 'JUNO',
        coinImageCid: '',
      },
    ],
  },
  {
    chainId: 'gravity-bridge-3',
    chainName: 'gravity-bridge',
    prefix: 'gravity',
    rpc: 'https://gravitychain.io:26657',
    explorerUrlToTx: 'https://www.mintscan.io/gravity-bridge/txs/{txHash}',
    chainIdImageCid: '',
    currencies: [
      {
        coinDecimals: 6,
        coinMinimalDenom: 'ugraviton',
        denom: 'GRAV',
        coinImageCid: '',
      },
    ],
  },
  {
    chainId: 'desmos-mainnet',
    chainName: 'desmos',
    prefix: 'desmos',
    rpc: 'https://rpc.mainnet.desmos.network',
    explorerUrlToTx: 'https://www.mintscan.io/desmos/txs/{txHash}',
    chainIdImageCid: '',
    currencies: [
      {
        coinDecimals: 6,
        coinMinimalDenom: 'udsm',
        denom: 'DSM',
        coinImageCid: '',
      },
    ],
  },
  {
    chainId: 'evmos_9001-2',
    chainName: 'evmos',
    rpc: 'https://tendermint.bd.evmos.org:26657',
    prefix: 'evmos',
    explorerUrlToTx: 'https://www.mintscan.io/evmos/txs/{txHash}',
    chainIdImageCid: '',
    currencies: [
      {
        coinDecimals: 18,
        coinMinimalDenom: 'aevmos',
        denom: 'EVMOS',
        coinImageCid: '',
      },
    ],
  },
  {
    chainId: 'chihuahua-1',
    chainName: 'chihuahua',
    prefix: 'chihuahua',
    rpc: 'https://rpc.chihuahua.wtf',
    explorerUrlToTx: 'https://www.mintscan.io/chihuahua/txs/{txHash}',
    chainIdImageCid: '',
    currencies: [
      {
        coinDecimals: 6,
        coinMinimalDenom: 'uhuahua',
        denom: 'HUAHUA',
        coinImageCid: '',
      },
    ],
  },
];

export default networkList;

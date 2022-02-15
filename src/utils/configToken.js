const coinDecimalsConfig = {
  'ibc/13B2C536BB057AC79D5616B8EA1B9540EC1F2170718CAFF6F0083C966FFFED0B': {
    chainId: 'osmosis-1',
    coinDecimals: 6,
    denom: 'OSMO',
    coinMinimalDenom: 'uosmo',
    channel: 'channel-2',
    rpc: 'https://rpc-osmosis.blockapsis.com/',
    prefix: 'osmo',
    sourceChannelId: 'channel-95',
    destChannelId: 'channel-2',
  },
  'ibc/BA313C4A19DFBF943586C0387E6B11286F9E416B4DD27574E6909CABE0E342FA': {
    chainId: 'cosmoshub-4',
    coinDecimals: 6,
    denom: 'ATOM',
    coinMinimalDenom: 'uatom',
    channel: '',
    rpc: 'https://rpc.cosmoshub-4.cybernode.ai/',
    prefix: 'cosmos',
    sourceChannelId: 'channel-240',
    destChannelId: 'channel-5',
  },
  milliampere: {
    coinDecimals: 3,
    denom: 'A',
    coinMinimalDenom: 'milliampere',
  },
  millivolt: {
    coinDecimals: 3,
    denom: 'V',
    coinMinimalDenom: 'millivolt',
  },
};

export default coinDecimalsConfig;

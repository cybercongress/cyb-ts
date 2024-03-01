const defaultNetworks = {
  bostrom: {
    CHAIN_ID: 'bostrom',
    DENOM_CYBER: 'boot',
    DENOM_LIQUID_TOKEN: 'hydrogen',
    DENOM_CYBER_G: 'GBOOT',
    CYBER_NODE_URL_API: 'https://rpc.bostrom.cybernode.ai',
    CYBER_WEBSOCKET_URL: 'wss://rpc.bostrom.cybernode.ai/websocket',
    CYBER_NODE_URL_LCD: 'https://lcd.bostrom.cybernode.ai',
    CYBER_INDEX_HTTPS: 'https://index.bostrom.cybernode.ai/v1/graphql',
    CYBER_INDEX_WEBSOCKET: 'wss://index.bostrom.cybernode.ai/v1/graphql',
    BECH32_PREFIX_ACC_ADDR_CYBER: 'bostrom',
    BECH32_PREFIX_ACC_ADDR_CYBERVALOPER: 'bostromvaloper',
    MEMO_KEPLR: '[bostrom] cyb.ai, using keplr',
  },
  'space-pussy': {
    CHAIN_ID: 'space-pussy',
    DENOM_CYBER: 'pussy',
    DENOM_LIQUID_TOKEN: 'liquidpussy',
    DENOM_CYBER_G: 'GPUSSY',
    CYBER_NODE_URL_API: 'https://rpc.space-pussy.cybernode.ai/',
    CYBER_WEBSOCKET_URL: 'wss://rpc.space-pussy.cybernode.ai/websocket',
    CYBER_NODE_URL_LCD: 'https://lcd.space-pussy.cybernode.ai',
    CYBER_INDEX_HTTPS: 'https://index.space-pussy.cybernode.ai/v1/graphql',
    CYBER_INDEX_WEBSOCKET: 'wss://index.space-pussy.cybernode.ai/v1/graphql',

    BECH32_PREFIX_ACC_ADDR_CYBER: 'pussy',
    BECH32_PREFIX_ACC_ADDR_CYBERVALOPER: 'pussyvaloper',
    MEMO_KEPLR: '[space-pussy] cyb.ai, using keplr',
  },
  deep: {
    CHAIN_ID: 'deep',
    DENOM_CYBER: 'energy',
    DENOM_LIQUID_TOKEN: 'hydrogen',
    DENOM_CYBER_G: 'GENERGY',
    CYBER_NODE_URL_API: 'https://rpc.testnet.deepchain.dev/',
    CYBER_WEBSOCKET_URL: 'wss://rpc.testnet.deepchain.dev/websocket',
    CYBER_NODE_URL_LCD: 'https://lcd.testnet.deepchain.dev',
    CYBER_INDEX_HTTPS: 'https://index.testnet.deepchain.dev/v1/graphql',
    CYBER_INDEX_WEBSOCKET: 'wss://index.testnet.deepchain.dev/v1/graphql',

    BECH32_PREFIX_ACC_ADDR_CYBER: 'deep',
    BECH32_PREFIX_ACC_ADDR_CYBERVALOPER: 'deepvaloper',
    MEMO_KEPLR: '[deep] deepchain.dev, using keplr',
  },
};

export default defaultNetworks;

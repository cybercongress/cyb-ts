const defaultNetworks = {
  bostrom: {
    CHAIN_ID: 'bostrom',
    DENOM: 'boot',
    DENOM_LIQUID: 'hydrogen',
    API: 'https://rpc.bostrom.cybernode.ai',
    LCD: 'https://lcd.bostrom.cybernode.ai',
    WEBSOCKET_URL: 'wss://rpc.bostrom.cybernode.ai/websocket',
    INDEX_HTTPS: 'https://index.bostrom.cybernode.ai/v1/graphql',
    INDEX_WEBSOCKET: 'wss://index.bostrom.cybernode.ai/v1/graphql',
    BECH32_PREFIX: 'bostrom',
    MEMO_KEPLR: '[bostrom] cyb.ai, using keplr',
  },
  'space-pussy': {
    CHAIN_ID: 'space-pussy',
    DENOM: 'pussy',
    DENOM_LIQUID: 'liquidpussy',
    API: 'https://rpc.space-pussy.cybernode.ai/',
    LCD: 'https://lcd.space-pussy.cybernode.ai',
    WEBSOCKET_URL: 'wss://rpc.space-pussy.cybernode.ai/websocket',
    INDEX_HTTPS: 'https://index.space-pussy.cybernode.ai/v1/graphql',
    INDEX_WEBSOCKET: 'wss://index.space-pussy.cybernode.ai/v1/graphql',
    BECH32_PREFIX: 'pussy',
    MEMO_KEPLR: '[space-pussy] cyb.ai, using keplr',
  },
};

export default defaultNetworks;

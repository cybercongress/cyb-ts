import { NetworkConfig, Networks } from 'src/types/networks';

type NetworksList = {
  [key in Networks.SPACE_PUSSY | Networks.BOSTROM]: NetworkConfig;
};

const defaultNetworks: NetworksList = {
  bostrom: {
    CHAIN_ID: Networks.BOSTROM,
    BASE_DENOM: 'boot',
    DENOM_LIQUID: 'hydrogen',
    RPC_URL: 'https://rpc.bostrom.cybernode.ai',
    LCD_URL: 'https://lcd.bostrom.cybernode.ai',
    WEBSOCKET_URL: 'wss://rpc.bostrom.cybernode.ai/websocket',
    INDEX_HTTPS: 'https://index.bostrom.cybernode.ai/v1/graphql',
    INDEX_WEBSOCKET: 'wss://index.bostrom.cybernode.ai/v1/graphql',
    BECH32_PREFIX: 'bostrom',
    MEMO_KEPLR: '[bostrom] cyb.ai, using keplr',
  },
  'space-pussy': {
    CHAIN_ID: Networks.SPACE_PUSSY,
    BASE_DENOM: 'pussy',
    DENOM_LIQUID: 'liquidpussy',
    RPC_URL: 'https://rpc.space-pussy.cybernode.ai/',
    LCD_URL: 'https://lcd.space-pussy.cybernode.ai',
    WEBSOCKET_URL: 'wss://rpc.space-pussy.cybernode.ai/websocket',
    INDEX_HTTPS: 'https://index.space-pussy.cybernode.ai/v1/graphql',
    INDEX_WEBSOCKET: 'wss://index.space-pussy.cybernode.ai/v1/graphql',
    BECH32_PREFIX: 'pussy',
    MEMO_KEPLR: '[space-pussy] cyb.ai, using keplr',
  },
};

export default defaultNetworks;

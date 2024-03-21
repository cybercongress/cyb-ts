import { Networks } from '../types/networks';

const LOCALSTORAGE_CHAIN_ID = Networks.BOSTROM;

let CHAIN_PARAMS = {
  CHAIN_ID: process.env.CHAIN_ID || Networks.BOSTROM,
  DENOM: 'boot',
  DENOM_LIQUID: 'hydrogen',
  CYBER_NODE_URL_API:
    process.env.CYBER_NODE_URL_API || 'https://rpc.bostrom.cybernode.ai',
  CYBER_WEBSOCKET_URL:
    process.env.CYBER_WEBSOCKET_URL ||
    'wss://rpc.bostrom.cybernode.ai/websocket',
  CYBER_NODE_URL_LCD:
    process.env.CYBER_NODE_URL_LCD || 'https://lcd.bostrom.cybernode.ai',
  CYBER_INDEX_HTTPS:
    process.env.CYBER_INDEX_HTTPS ||
    'https://index.bostrom.cybernode.ai/v1/graphql',
  CYBER_INDEX_WEBSOCKET:
    process.env.CYBER_INDEX_WEBSOCKET ||
    'wss://index.bostrom.cybernode.ai/v1/graphql',
  BECH32_PREFIX_ACC_ADDR_CYBER: 'bostrom',
  BECH32_PREFIX_ACC_ADDR_CYBERVALOPER: 'bostromvaloper',
  MEMO_KEPLR: '[bostrom] cyb.ai, using keplr',
};

if (LOCALSTORAGE_CHAIN_ID === 'space-pussy') {
  CHAIN_PARAMS = {
    CHAIN_ID: Networks.SPACE_PUSSY,
    DENOM: 'pussy',
    DENOM_LIQUID: 'liquidpussy',
    CYBER_NODE_URL_API: 'https://rpc.space-pussy.cybernode.ai/',
    CYBER_WEBSOCKET_URL: 'wss://rpc.space-pussy.cybernode.ai/websocket',
    CYBER_NODE_URL_LCD: 'https://lcd.space-pussy.cybernode.ai',
    CYBER_INDEX_HTTPS: 'https://index.space-pussy.cybernode.ai/v1/graphql',
    CYBER_INDEX_WEBSOCKET: 'wss://index.space-pussy.cybernode.ai/v1/graphql',

    BECH32_PREFIX_ACC_ADDR_CYBER: 'pussy',
    BECH32_PREFIX_ACC_ADDR_CYBERVALOPER: `pussyvaloper`,
    MEMO_KEPLR: '[space-pussy] cyb.ai, using keplr',
  };
}

const CYBER = {
  CYBER_CONGRESS_ADDRESS: 'bostrom1xszmhkfjs3s00z2nvtn7evqxw3dtus6yr8e4pw',
  DIVISOR_CYBER_G: 10 ** 9,
  HYDROGEN: 'H',

  ...CHAIN_PARAMS,

  // CHAIN_ID: 'dev',
  // CYBER_NODE_URL_API: 'http://localhost:26657',
  // CYBER_WEBSOCKET_URL: 'ws://localhost:26657/websocket',
  // CYBER_NODE_URL_LCD: 'http://localhost:1317',

  CYBER_GATEWAY:
    process.env.CYBER_GATEWAY || 'https://gateway.ipfs.cybernode.ai',
};

const LEDGER = {
  STAGE_INIT: 0,
  STAGE_SELECTION: 1,
  STAGE_LEDGER_INIT: 2,
  STAGE_READY: 3,
  STAGE_WAIT: 4,
  STAGE_GENERATED: 5,
  STAGE_SUBMITTED: 6,
  STAGE_CONFIRMING: 7,
  STAGE_CONFIRMED: 8,
  STAGE_ERROR: 15,
  HDPATH: [44, 118, 0, 0, 0],
};

const GENESIS_SUPPLY = 1000000000000000;
const TOTAL_GOL_GENESIS_SUPPLY = 50000000000000;

const POCKET = {
  STAGE_TWEET_ACTION_BAR: {
    ADD_AVATAR: 'addAvatar',
    FOLLOW: 'follow',
    TWEET: 'tweet',
  },
};

export { LEDGER, GENESIS_SUPPLY, TOTAL_GOL_GENESIS_SUPPLY, POCKET };

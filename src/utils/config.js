const AUCTION = {
  ADDR_SMART_CONTRACT: '0xc8a0b9d38d1301391fa593728cfaa2962bc72965',
  ADDR_SMART_CONTRACT_AUCTION_UTILS:
    '0x5095b56b6607724559d21bb4d2af0d9cdab64149',
  ADDR_TOKEN: '0xce09a0c3ff16a4f5d2c66cea9b89e3cc2cf5242b',
  ADDR_TOKEN_MANAGER: '0x74a653b35970c16b766a541a3410900b0f5ff024',
  ADDR_VESTING: '0x3ce65173b147a01eb65c6ded14efc7c202186ebd',
  TOKEN_NAME: 'GOL',
  TOPICS_SEND:
    '0xe054057d0479c6218d6ec87be73f88230a7e4e1f064cee6e7504e2c4cd9d6150',
  TOPICS_CLAIM:
    '0x51223fdc0a25891366fb358b4af9fe3c381b1566e287c61a29d01c8a173fe4f4',
  TOPICS_VESTING:
    '0x552f182d4b9ab267a8580e2aa80cf374b7aabc8f528b7e9eea58919eea48e87d',
  HTTP_PROVIDER_URL: 'https://rinkeby.infura.io/metamask',
};

const NETWORKSIDS = {
  42: 'kovan',
  1: 'main',
  5777: 'TestNet',
  4: 'rinkeby',
};

const TAKEOFF = {
  ATOMsALL: 600000,
  CYBWON_A: 0.000740464,
  CYBWON_B: -666.418,
  CYBWON_C: 2.3328 * 10 ** 8,
  CYBWON_D: 0.000343014,
  GETSHARES_A: -1.856 * 10 ** -3,
  GETSHARES_B: 2.355 * 10 ** -5,
  GETSHARES_C: 6.66 * 10 ** -11,
  GETSHARES_D: 7.332 * 10 ** -17,
  DISCOUNT_TG: -0.00005,
  DISCOUNT_TILT_ANGLE: 30,
};

const COSMOS = {
  ADDR_FUNDING: 'cosmos18d2wdn0k70ll75ev3wu73yzazsprxeylv7mvd6',
  CHAIN_ID: 'cosmoshub-3',
  DEFAULT_GAS: 150000,
  DEFAULT_GAS_PRICE: 0.01,
  GAIA_NODE_URL_LSD: 'https://deimos.cybernode.ai/gaia_lcd/',
  GAIA_WEBSOCKET_URL: 'wss://deimos.cybernode.ai/',
  DENOM_COSMOS: 'uatom',
  DIVISOR_ATOM: 10 ** 6,
  BECH32_PREFIX_ACC_ADDR_COSMOS: 'cosmos',
};

const CYBER = {
  DIVISOR_CYBER_G: 10 ** 9,
  DENOM_CYBER: 'eul',
  DENOM_CYBER_G: `GEUL`,
  CYBER_WEBSOCKET_URL: 'wss://titan.cybernode.ai/websocket',
  CYBER_NODE_URL: 'https://titan.cybernode.ai',
  BECH32_PREFIX_ACC_ADDR_CYBER: 'cyber',
  BECH32_PREFIX_ACC_ADDR_CYBERVALOPER: 'cybervaloper',
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
  LEDGER_VERSION_REQ: [1, 1, 1],
  HDPATH: [44, 118, 0, 0, 0],
  LEDGER_OK: 36864,
  LEDGER_NOAPP: 28160,
  MEMO: 'cyber.page, using Ledger',
};

const GENESIS_SUPPLY = 100000000000000;
const TOTAL_GOL_GENESIS_SUPPLY = 15000000000000;

const DISTRIBUTION = [
  {
    group: 'takeoff donations',
    amount: '60000000000000',
  },
  {
    group: 'relevance',
    amount: '15000000000000',
  },
  {
    group: 'load',
    amount: '6000000000000',
  },
  {
    group: 'delegation',
    amount: '5000000000000',
  },
  {
    group: 'full validator set',
    amount: '5000000000000',
  },
  {
    group: 'euler-4 rewards',
    amount: '5000000000000',
  },
  {
    group: 'lifetime',
    amount: '2000000000000',
  },
  {
    group: 'community pool',
    amount: '2000000000000',
  },
];

const PATTERN = /^0x[a-fA-F0-9]{40}$|^cybervaloper[a-zA-Z0-9]{39}$|^cyber[a-zA-Z0-9]{39}$|^cosmos[a-zA-Z0-9]{39}$/g;
const PATTERN_CYBER = /^cyber[a-zA-Z0-9]{39}$/g;

export {
  TAKEOFF,
  COSMOS,
  CYBER,
  LEDGER,
  AUCTION,
  NETWORKSIDS,
  DISTRIBUTION,
  GENESIS_SUPPLY,
  TOTAL_GOL_GENESIS_SUPPLY,
  PATTERN,
  PATTERN_CYBER,
};

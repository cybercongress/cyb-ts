const AUCTION = {
  ADDR_SMART_CONTRACT: '0x6C9c39D896B51e6736DBd3dA710163903A3B091B',
  ADDR_SMART_CONTRACT_AUCTION_UTILS:
    '0x303Fb6bA398F2039b3AE56AB472D80839463E7dF',
  TOKEN_NAME: 'GOL',
  TOPICS_SEND:
    '0xe054057d0479c6218d6ec87be73f88230a7e4e1f064cee6e7504e2c4cd9d6150',
  TOPICS_CLAIM:
    '0x51223fdc0a25891366fb358b4af9fe3c381b1566e287c61a29d01c8a173fe4f4',
  HTTP_PROVIDER_URL: 'https://rinkeby.infura.io/metamask',
  GOL: 6 * 10 ** 12,
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
  GAIA_NODE_URL_LSD: 'https://lcd.nylira.net',
  GAIA_WEBSOCKET_URL: 'wss://deimos.cybernode.ai/',
  DENOM_COSMOS: 'uatom',
  DIVISOR_ATOM: 10 ** 5,
  BECH32_PREFIX_ACC_ADDR_COSMOS: 'cosmos',
};

const CYBER = {
  DIVISOR_CYBER_G: 10 ** 9,
  DENOM_CYBER: 'eul',
  DENOM_CYBER_G: 'G',
  CYBER_WEBSOCKET_URL: 'wss://titan.cybernode.ai/websocket',
  CYBER_NODE_URL: 'https://titan.cybernode.ai',
  BECH32_PREFIX_ACC_ADDR_CYBER: 'cyber',
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

const GENESIS_SUPPLY = 233000000000000;

const DISTRIBUTION = [
  {
    group: 'Takeoff donations',
    amount: '100000000000000',
  },
  {
    group: 'Gifts to Ethereum, Cosmos and Urbit communities',
    amount: '100000000000000',
  },
  {
    group: 'Euler-4 validators',
    amount: '20000000000000',
  },
  {
    group: 'GOL stakers	',
    amount: '10000000000000',
  },
  {
    group: 'Community pool',
    amount: '2000000000000',
  },
  {
    group: 'Test of Thrones in ATOMs',
    amount: '1000000000000',
  },
];

export {
  TAKEOFF,
  COSMOS,
  CYBER,
  LEDGER,
  AUCTION,
  NETWORKSIDS,
  DISTRIBUTION,
  GENESIS_SUPPLY,
};

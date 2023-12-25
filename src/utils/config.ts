import { Networks } from '../types/networks';

const TIME_START = '2022-10-03T19:32:28Z';
const INFINITY = '∞';
const WP =
  'https://ipfs.io/ipfs/QmQ1Vong13MDNxixDyUdjniqqEj8sjuNEBYMyhQU4gQgq3';
const AUCTION = {
  ADDR_SMART_CONTRACT: '0x0b1f54be915e77d9bf14268f94f8a26afab11296',
  ADDR_VESTING: '0xd84469ecd96825c956d7ae8b072209ca89ae37e2',
  ADDR_EVANGELISM: '0xfc3849b9711f69ddb677facff0cd6755a981a1f0',
  TOKEN_NAME: 'GOL',
  ADDR_TOKEN: '0xF4ecdBa8ba4144Ff3a2d8792Cad9051431Aa4F64',
  TOPICS_SEND:
    '0x3b599f6217e39be59216b60e543ce0d4c7d534fe64dd9d962334924e7819894e',
  TOPICS_CLAIM:
    '0x3ed1528b0fdc7c5207c1bf935e34a667e13656b9ed165260c522be0bc544f303',
  TOPICS_VESTING:
    '0x552f182d4b9ab267a8580e2aa80cf374b7aabc8f528b7e9eea58919eea48e87d',
  HTTP_PROVIDER_URL: 'https://rpc.ethereum.cybernode.ai/',
  // 'https://mainnet.infura.io/v3/b80bdc43536c4f0c97b8c0afd2a7d75d',
  ROUND_DURATION: 1000 * 60 * 60 * 23 + 1,
  TOKEN_ALOCATION: 15 * 10 ** 3,
};

const HUB_CONTRACTS = {
  TOKENS: 'bostrom15phze6xnvfnpuvvgs2tw58xnnuf872wlz72sv0j2yauh6zwm7cmqqpmc42',
  NETWORKS:
    'bostrom1lpn69a74ftv04upfej8f9ay56pe2zyk48vzlk49kp3grysc7u56qq363nr',
  CHANNELS:
    'bostrom15tx5z779rdks07sg774ufn8q0a9x993c9uwmr6ycec78z6lfrmkqyjnfge',
  PROTOCOLS:
    'bostrom12yqsxh82qy3dz6alnmjhupyk85skgeqznzxv92q99hqtyu7vvdsqgwjgv',
};

const ADD_ARAGON_FINANCE = '0xa0a55e68dc52b47f8a9d5d05329fab5bdabffb14';

const NETWORKSIDS = {
  main: 1,
  rinkeby: 4,
  kovan: 42,
  TestNet: 5777,
};

const TAKEOFF = {
  ATOMsALL: 300000,
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
  DISCOUNT: 0.3,
  SQRT_5: 2.23606797749979,
  BLOCK_START: 2000000,
  FINISH_PRICE: 1.485,
  FINISH_AMOUNT: 15088.40963,
  FINISH_ESTIMATION: 12141.224,
};

const COSMOS = {
  ADDR_FUNDING: 'cosmos1latzme6xf6s8tsrymuu6laf2ks2humqv2tkd9a',
  TIME_START: 'April 27 2020 21:50:00 GMT +3',
  TIME_END: 'November 31 2020 24:00:00 GMT +3',
  CHAIN_ID: 'cosmoshub-4',
  DEFAULT_GAS: 200000,
  DEFAULT_GAS_PRICE: 0.01,
  GAIA_NODE_URL_LSD: 'https://lcd.cosmoshub-4.cybernode.ai',
  GAIA_WEBSOCKET_URL: 'wss://io.cybernode.ai/gaia_websocket',
  DENOM_COSMOS: 'uatom',
  DIVISOR_ATOM: 10 ** 6,
  BECH32_PREFIX_ACC_ADDR_COSMOS: 'cosmos',
};

const LOCALSTORAGE_CHAIN_ID = localStorage.getItem('chainId') || Networks.SPACE_PUSSY;

const CHAIN_PARAMS_LOCALSTORAGE = localStorage.getItem('CHAIN_PARAMS');

let CHAIN_PARAMS = {
  CHAIN_ID: process.env.CHAIN_ID || Networks.BOSTROM,
  DENOM_CYBER: 'boot',
  DENOM_LIQUID_TOKEN: 'hydrogen',
  DENOM_CYBER_G: `GBOOT`,
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
    DENOM_CYBER: 'pussy',
    DENOM_LIQUID_TOKEN: 'liquidpussy',
    DENOM_CYBER_G: `GPUSSY`,
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

if (CHAIN_PARAMS_LOCALSTORAGE !== null && LOCALSTORAGE_CHAIN_ID !== null) {
  const CHAIN_PARAMS_LOCALSTORAGE_DATA = JSON.parse(CHAIN_PARAMS_LOCALSTORAGE);
  if (CHAIN_PARAMS_LOCALSTORAGE_DATA[LOCALSTORAGE_CHAIN_ID]) {
    CHAIN_PARAMS = { ...CHAIN_PARAMS_LOCALSTORAGE_DATA[LOCALSTORAGE_CHAIN_ID] };
  }
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

const DEFAULT_GAS_LIMITS = 200000;

const GAS_LIMITS = {
  send: 200000,
  cyberlink: 256000,
  investmint: 160000,
  createRoute: 128000,
  editRoute: 128000,
  editRouteAlias: 128000,
  deleteRoute: 128000,
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
  MEMO: 'cyb.ai, using Ledger',
};

const TAKEOFF_SUPPLY = 100000000000000;
const GENESIS_SUPPLY = 1000000000000000;
const TOTAL_GOL_GENESIS_SUPPLY = 50000000000000;

const DISTRIBUTION = {
  takeoff: 100000000000000,
  relevance: 20000000000000,
  load: 10000000000000,
  delegation: 5000000000000,
  'full validator set': 5000000000000,
  'euler 4 rewards': 5000000000000,
  lifetime: 3000000000000,
  'community pool': 2000000000000,
};

const DISTRIBUTION_PRIZE = {
  takeoff: 100000000000000,
  relevance: 500000000000,
  load: 500000000000,
  delegation: 500000000000,
  'full validator set': 250000000000,
  'euler 4 rewards': 5000000000000,
  lifetime: 500000000000,
  'community pool': 2000000000000,
};

const POCKET = {
  STAGE_TWEET_ACTION_BAR: {
    ADD_AVATAR: 'addAvatar',
    FOLLOW: 'follow',
    TWEET: 'tweet',
  },
};

const PROPOSAL_STATUS = {
  /** PROPOSAL_STATUS_UNSPECIFIED - PROPOSAL_STATUS_UNSPECIFIED defines the default propopsal status. */
  PROPOSAL_STATUS_UNSPECIFIED: 0,
  /**
   * PROPOSAL_STATUS_DEPOSIT_PERIOD - PROPOSAL_STATUS_DEPOSIT_PERIOD defines a proposal status during the deposit
   * period.
   */
  PROPOSAL_STATUS_DEPOSIT_PERIOD: 1,
  /**
   * PROPOSAL_STATUS_VOTING_PERIOD - PROPOSAL_STATUS_VOTING_PERIOD defines a proposal status during the voting
   * period.
   */
  PROPOSAL_STATUS_VOTING_PERIOD: 2,
  /**
   * PROPOSAL_STATUS_PASSED - PROPOSAL_STATUS_PASSED defines a proposal status of a proposal that has
   * passed.
   */
  PROPOSAL_STATUS_PASSED: 3,
  /**
   * PROPOSAL_STATUS_REJECTED - PROPOSAL_STATUS_REJECTED defines a proposal status of a proposal that has
   * been rejected.
   */
  PROPOSAL_STATUS_REJECTED: 4,
  /**
   * PROPOSAL_STATUS_FAILED - PROPOSAL_STATUS_FAILED defines a proposal status of a proposal that has
   * failed.
   */
  PROPOSAL_STATUS_FAILED: 5,
  UNRECOGNIZED: -1,
};

const VOTE_OPTION = {
  /** VOTE_OPTION_UNSPECIFIED - VOTE_OPTION_UNSPECIFIED defines a no-op vote option. */
  VOTE_OPTION_UNSPECIFIED: 0,
  /** VOTE_OPTION_YES - VOTE_OPTION_YES defines a yes vote option. */
  VOTE_OPTION_YES: 1,
  /** VOTE_OPTION_ABSTAIN - VOTE_OPTION_ABSTAIN defines an abstain vote option. */
  VOTE_OPTION_ABSTAIN: 2,
  /** VOTE_OPTION_NO - VOTE_OPTION_NO defines a no vote option. */
  VOTE_OPTION_NO: 3,
  /** VOTE_OPTION_NO_WITH_VETO - VOTE_OPTION_NO_WITH_VETO defines a no with veto vote option. */
  VOTE_OPTION_NO_WITH_VETO: 4,
  UNRECOGNIZED: -1,
};

const BOND_STATUS = {
  BOND_STATUS_UNSPECIFIED: 0,
  /** BOND_STATUS_UNBONDED - UNBONDED defines a validator that is not bonded. */
  BOND_STATUS_UNBONDED: 1,
  /** BOND_STATUS_UNBONDING - UNBONDING defines a validator that is unbonding. */
  BOND_STATUS_UNBONDING: 2,
  /** BOND_STATUS_BONDED - BONDED defines a validator that is bonded. */
  BOND_STATUS_BONDED: 3,
};

const CID_AVATAR = 'Qmf89bXkJH9jw4uaLkHmZkxQ51qGKfUPtAMxA8rTwBrmTs';
const CID_TWEET = 'QmbdH2WBamyKLPE5zu4mJ9v49qvY8BFfoumoVPMR5V4Rvx';

const PATTERN = new RegExp(
  `^0x[a-fA-F0-9]{40}$|^${CYBER.BECH32_PREFIX_ACC_ADDR_CYBER}valoper[a-zA-Z0-9]{39}$|^${CYBER.BECH32_PREFIX_ACC_ADDR_CYBER}[a-zA-Z0-9]{39}$|^cosmos[a-zA-Z0-9]{39}$`,
  'g'
);
const PATTERN_CYBER = new RegExp(
  `^${CYBER.BECH32_PREFIX_ACC_ADDR_CYBER}[a-zA-Z0-9]{39}$`,
  'g'
);
const PATTERN_CYBER_CONTRACT = new RegExp(
  `^${CYBER.BECH32_PREFIX_ACC_ADDR_CYBER}[a-zA-Z0-9]{59}$`,
  'g'
);
const PATTERN_CYBER_VALOPER = new RegExp(
  `^${CYBER.BECH32_PREFIX_ACC_ADDR_CYBER}valoper[a-zA-Z0-9]{39}$`,
  'g'
);
const PATTERN_COSMOS = /^cosmos[a-zA-Z0-9]{39}$/g;
const PATTERN_OSMOS = /^osmo[a-zA-Z0-9]{39}$/g;
const PATTERN_TERRA = /^terra[a-zA-Z0-9]{39}$/g;
const PATTERN_ETH = /^0x[a-fA-F0-9]{40}$/g;
const PATTERN_TX = /[0-9a-fA-F]{64}$/g;
const PATTERN_IPFS_HASH = /^Qm[a-zA-Z0-9]{44}$/g;
const PATTERN_BLOCK = /^[0-9]+$/g;
const PATTERN_HTTP = /^https:\/\/|^http:\/\//g;
const PATTERN_HTML = /<\/?[\w\d]+>/gi;

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
  PATTERN_CYBER_CONTRACT,
  PATTERN_CYBER_VALOPER,
  PATTERN_TX,
  PATTERN_IPFS_HASH,
  PATTERN_COSMOS,
  PATTERN_ETH,
  PATTERN_TERRA,
  PATTERN_OSMOS,
  PATTERN_BLOCK,
  TIME_START,
  TAKEOFF_SUPPLY,
  WP,
  PATTERN_HTTP,
  POCKET,
  INFINITY,
  ADD_ARAGON_FINANCE,
  DISTRIBUTION_PRIZE,
  GAS_LIMITS,
  DEFAULT_GAS_LIMITS,
  PROPOSAL_STATUS,
  VOTE_OPTION,
  BOND_STATUS,
  CID_AVATAR,
  CID_TWEET,
  PATTERN_HTML,
  HUB_CONTRACTS,
};

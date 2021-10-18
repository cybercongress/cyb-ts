const TIME_START = 'Sep 18 2021 19:00:00 GMT +3';
const INFINITY = '∞';
const WP =
  'https://ipfs.io/ipfs/QmQ1Vong13MDNxixDyUdjniqqEj8sjuNEBYMyhQU4gQgq3';
const AUCTION = {
  ADDR_SMART_CONTRACT: '0x0b1f54be915e77d9bf14268f94f8a26afab11296',
  ADDR_VESTING: '0xd84469ecd96825c956d7ae8b072209ca89ae37e2',
  ADDR_EVANGELISM: '0xfc3849b9711f69ddb677facff0cd6755a981a1f0',
  TOKEN_NAME: 'GOL',
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

const CYBER = {
  CYBER_CONGRESS_ADDRESS: 'cyber1latzme6xf6s8tsrymuu6laf2ks2humqvdq39v8',
  DIVISOR_CYBER_G: 10 ** 9,
  DENOM_CYBER: 'boot',
  DENOM_CYBER_G: `GBOOT`,
  // CHAIN_ID: 'dev',
  // CYBER_NODE_URL_API: 'http://localhost:26657',
  // CYBER_WEBSOCKET_URL: 'ws://localhost:26657/websocket',
  // CYBER_NODE_URL_LCD: 'http://localhost:1317',
  CHAIN_ID: 'bostrom-testnet-5',
  CYBER_NODE_URL_API: 'https://rpc.bostromdev.cybernode.ai',
  CYBER_WEBSOCKET_URL: 'wss://rpc.bostromdev.cybernode.ai/websocket',
  CYBER_NODE_URL_LCD: 'https://lcd.bostromdev.cybernode.ai',
  CYBER_INDEX_HTTPS: 'https://index.bostromdev.cybernode.ai/v1/graphql',
  CYBER_INDEX_WEBSOCKET: 'wss://index.bostromdev.cybernode.ai/v1/graphql',
  BECH32_PREFIX_ACC_ADDR_CYBER: 'bostrom',
  BECH32_PREFIX_ACC_ADDR_CYBERVALOPER: 'bostromvaloper',
  MEMO_KEPLR: '[bostrom] cyb.ai, using keplr',
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

const PATTERN = /^0x[a-fA-F0-9]{40}$|^bostromvaloper[a-zA-Z0-9]{39}$|^bostrom[a-zA-Z0-9]{39}$|^cosmos[a-zA-Z0-9]{39}$/g;
const PATTERN_CYBER = /^bostrom[a-zA-Z0-9]{39}$/g;
const PATTERN_COSMOS = /^cosmos[a-zA-Z0-9]{39}$/g;
const PATTERN_ETH = /^0x[a-fA-F0-9]{40}$/g;
const PATTERN_CYBER_VALOPER = /^bostromvaloper[a-zA-Z0-9]{39}$/g;
const PATTERN_TX = /[0-9a-fA-F]{64}$/g;
const PATTERN_IPFS_HASH = /^Qm[a-zA-Z0-9]{44}$/g;
const PATTERN_BLOCK = /^[0-9]+$/g;
const PATTERN_HTTP = /^https:\/\/|^http:\/\//g;

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
  PATTERN_CYBER_VALOPER,
  PATTERN_TX,
  PATTERN_IPFS_HASH,
  PATTERN_COSMOS,
  PATTERN_ETH,
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
};

// const wsURL = 'wss://herzner1.cybernode.ai/';
const wsURL = 'wss://deimos.cybernode.ai/';
const OPERATOR_ADDR = 'cosmos18d2wdn0k70ll75ev3wu73yzazsprxeylv7mvd6';
const CHAIN_ID = 'cosmoshub-2';
const DEFAULT_GAS = 150000;
const DEFAULT_GAS_PRICE = 0.01;
const DENOM = 'uatom';
const MEMO = 'Ledger';
const urlGaiaLSD = 'https://lcd.nylira.net';
const indexedNode = 'https://titan.cybernode.ai';
// const indexedNode = 'https://callisto.cybernode.ai';
const wssCyberUrl= 'wss://titan.cybernode.ai/websocket';

const ATOMsALL = 600000;

const a = 0.000740464;
const b = -666.418;
const c = 2.3328 * 10 ** 8;
const d = 0.000343014;

const a_3d_plot = -1.856 * 10 ** -3;
const b_3d_plot = 2.355 * 10 ** -5;
const c_3d_plot = 6.66 * 10 ** -11;
const d_3d_plot = 7.332 * 10 ** -17;

// ----CYBER---

const DIVISOR_CYBER_G = 10 ** -9;
const DENOM_CYBER = 'eul';
const DENOM_CYBER_G = 'G';

// -----

// ---LEDGER---

const LEDGER_VERSION_REQ = [1, 1, 1];
const HDPATH = [44, 118, 0, 0, 0];
const LEDGER_OK = 36864;
const LEDGER_NOAPP = 28160;

const STAGE_INIT = 0;
const STAGE_SELECTION = 1;
const STAGE_LEDGER_INIT = 2;
const STAGE_READY = 3;
const STAGE_WAIT = 4;
const STAGE_GENERATED = 5;
const STAGE_SUBMITTED = 6;
const STAGE_CONFIRMING = 7;
const STAGE_CONFIRMED = 8;
const STAGE_ERROR = 15;

//------

const BECH32_PREFIX_ACC_ADDR = 'cyber';

export {
  a,
  b,
  c,
  d,
  wsURL,
  ATOMsALL,
  a_3d_plot,
  b_3d_plot,
  c_3d_plot,
  d_3d_plot,
  OPERATOR_ADDR,
  CHAIN_ID,
  DEFAULT_GAS,
  DEFAULT_GAS_PRICE,
  DENOM,
  MEMO,
  urlGaiaLSD,
  indexedNode,
  wssCyberUrl,
  BECH32_PREFIX_ACC_ADDR,
  STAGE_INIT,
  STAGE_SELECTION,
  STAGE_LEDGER_INIT,
  STAGE_READY,
  STAGE_WAIT,
  STAGE_GENERATED,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
  STAGE_ERROR,
  LEDGER_VERSION_REQ,
  HDPATH,
  LEDGER_OK,
  LEDGER_NOAPP,
  DIVISOR_CYBER_G,
  DENOM_CYBER,
  DENOM_CYBER_G,
};

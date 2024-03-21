import { Networks } from 'src/types/networks';
import defaultNetworks from './defaultNetworks';

const DEFAULT_CHAIN_ID = Networks.BOSTROM;

export const CHAIN_ID = process.env.CHAIN_ID || DEFAULT_CHAIN_ID;

export const LCD =
  process.env.CYBER_NODE_URL_LCD || defaultNetworks[DEFAULT_CHAIN_ID].LCD;

export const WEBSOCKET_URL =
  process.env.CYBER_NODE_URL_WS || defaultNetworks[DEFAULT_CHAIN_ID].WEBSOCKET_URL;

export const INDEX_URL =
  process.env.CYBER_INDEX_HTTPS || defaultNetworks[DEFAULT_CHAIN_ID].INDEX_HTTPS;

export const INDEX_WSS =
  process.env.CYBER_INDEX_WSS || defaultNetworks[DEFAULT_CHAIN_ID].INDEX_WEBSOCKET;

export const {
  API,
  DENOM,
  DENOM_LIQUID,
  DENOM_G,
  BECH32_PREFIX,
  BECH32_PREFIX_VALOPER,
  MEMO_KEPLR,
} = defaultNetworks[DEFAULT_CHAIN_ID];

export const CYBER_GATEWAY =
  process.env.CYBER_GATEWAY || 'https://gateway.ipfs.cybernode.ai';

export const DIVISOR_CYBER_G = 10 ** 9;

export const DEFAULT_GAS_LIMITS = 200000;

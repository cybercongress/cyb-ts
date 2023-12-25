export const enum Networks {
  BOSTROM = 'bostrom',
  SPACE_PUSSY = 'space-pussy',
  ETH = 'eth',
  OSMO = 'osmo',
  TERRA = 'terra',
  COSMOS = 'cosmoshub-4',
}

export type NetworkConfig = {
  CHAIN_ID: Networks;
  DENOM_CYBER: string;
  DENOM_LIQUID_TOKEN: string;
  DENOM_CYBER_G: string;
  CYBER_NODE_URL_API: string;
  CYBER_WEBSOCKET_URL: string;
  CYBER_NODE_URL_LCD: string;
  CYBER_INDEX_HTTPS: string;
  CYBER_INDEX_WEBSOCKET: string;
  BECH32_PREFIX_ACC_ADDR_CYBER: string;
  BECH32_PREFIX_ACC_ADDR_CYBERVALOPER: string;
  MEMO_KEPLR: string;
};

export type NetworksList = {
  [key in Networks]: NetworkConfig;
};

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
  DENOM: string;
  DENOM_LIQUID: string;
  API: string;
  LCD: string;
  WEBSOCKET_URL: string;
  INDEX_HTTPS: string;
  INDEX_WEBSOCKET: string;
  BECH32_PREFIX: string;
  MEMO_KEPLR: string;
};

export type NetworksList = {
  [key in Networks]: NetworkConfig;
};

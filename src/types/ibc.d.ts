export type IbcDenoms = {
  sourceChannelId: string;
  baseDenom: string;
  ibcDenom: string;
};

export type IbcDenomsArr = {
  [key: string]: IbcDenoms;
};

export type TraseDenomFuncResponse = {
  denom: string;
  coinDecimals: number;
  path: string;
  coinImageCid: string;
  native: boolean;
};

export type TraseDenomFuncType = (denom: string) => TraseDenomFuncResponse[];

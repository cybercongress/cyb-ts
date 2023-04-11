export type IbcDenomsType = {
  sourceChannelId: string;
  baseDenom: string;
  ibcDenom: string;
};

export type IbcDenomsArrType = {
  [key: string]: IbcDenomsType;
};

export type TraseDenomFuncResponse = {
  denom: string;
  coinDecimals: number;
  path: string;
  coinImageCid: string;
  native: boolean;
};

export type TraseDenomFuncType = (denom: string) => TraseDenomFuncResponse[];

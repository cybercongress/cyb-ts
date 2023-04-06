import { Pool } from "@cybercongress/cyber-js/build/codec/tendermint/liquidity/v1beta1/liquidity";

type AccountTypeKey = 'cyber' | 'cosmos';

type AccountTypeValue = {
  keys: string;
  bech32: string;
  name: string;
};

type AccountType = {
  [key in AccountTypeKey]: AccountTypeValue;
};

export type DefaultAccountType = {
  name: string;
  account: AccountType;
};

export interface MyPoolsT extends Pool {
  coinDenom: string;
  myTokenAmount: number;
}
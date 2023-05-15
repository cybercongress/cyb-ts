import { Pool } from '@cybercongress/cyber-js/build/codec/tendermint/liquidity/v1beta1/liquidity';

type AccountTypeKey = 'cyber' | 'cosmos';

type AccountTypeValue = {
  keys: string;
  bech32: string;
  name: string;
};

type Account = {
  [key in AccountTypeKey]: AccountTypeValue;
};

export type TypeTxsT = 'swap' | 'deposit' | 'withdraw';

export const enum TxsType {
  Swap = 'swap',
  Deposit = 'deposit',
  Withdraw = 'withdraw',
}

export type DefaultAccount = {
  name: string;
  account: Account;
};

export interface MyPoolsT extends Pool {
  coinDenom: string;
  myTokenAmount: number;
}

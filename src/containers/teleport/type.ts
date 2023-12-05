import { Pool } from '@cybercongress/cyber-js/build/codec/tendermint/liquidity/v1beta1/liquidity';

export enum TypePages {
  swap = 'swap',
  send = 'send',
  bridge = 'bridge',
}

export type TypeTxsT = 'swap' | 'deposit' | 'withdraw';

export const enum TxsType {
  Swap = 'swap',
  Deposit = 'deposit',
  Withdraw = 'withdraw',
}

export interface MyPoolsT extends Pool {
  coinDenom: string;
  myTokenAmount: number;
}

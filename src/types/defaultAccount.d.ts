type AccountKey = 'cyber' | 'cosmos';

export type AccountValue = {
  keys: 'read-only' | 'ledger' | 'keplr';
  bech32: string;
  name?: string;
  path?: number[];
  pk?: string;
};

type Account = {
  [key in AccountKey]: AccountValue;
};

type Accounts = {
  [key in string]: Account;
};

export type DefaultAccount = {
  name: string | null;
  account: Account | null;
};

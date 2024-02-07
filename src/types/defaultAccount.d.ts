type AccountKey = 'cyber' | 'cosmos';

export type AccountValue = {
  keys: 'read-only' | 'keplr';
  bech32: string;
  name?: string;
  path?: number[];
  pk?: string;
};

type Account = {
  [key in AccountKey]: AccountValue;
};

export type Accounts = {
  [key in string]: Account;
};

export type DefaultAccount = {
  name: string | null;
  account: Account | null;
};

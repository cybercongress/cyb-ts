type AccountKey = 'cyber' | 'cosmos';

export type AccountValue = {
  keys: string;
  bech32: string;
  name?: string;
  path?: number[];
  pk?: string;
};

type Account = {
  [key in AccountKey]: AccountValue;
};

export type DefaultAccount = {
  name: string | null;
  account: Account | null;
};

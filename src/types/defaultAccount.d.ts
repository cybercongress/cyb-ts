type AccountKeyType = 'cyber' | 'cosmos';

export type AccountValueType = {
  keys: string;
  bech32: string;
  name?: string;
};

type AccountType = {
  [key in AccountKeyType]: AccountValueType;
};

export type DefaultAccountType = {
  name: string | null;
  account: AccountType | null;
};

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

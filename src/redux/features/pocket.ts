import { Dispatch } from 'redux';
import { localStorageKeys } from 'src/constants/localStorageKeys';

import { Account, DefaultAccount } from 'src/types/defaultAccount';
import { POCKET } from '../../utils/config';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type SliceState = {
  actionBar: {
    tweet: string;
  };
  defaultAccount: DefaultAccount;
  accounts: null | Account[];
};

const initialState: SliceState = {
  actionBar: {
    tweet: POCKET.STAGE_TWEET_ACTION_BAR.TWEET, // stage for tweet ActionBar: 'addAvatar' 'follow' 'tweet'
  },
  defaultAccount: {
    name: null,
    account: null,
  },
  accounts: null,
};

const slice = createSlice({
  name: 'pocket',
  initialState,
  reducers: {
    setDefaultAccount: (
      state,
      { payload }: PayloadAction<DefaultAccount>
    ) => {
      state.defaultAccount = payload;
    },
    setAccounts: (state, { payload }: PayloadAction<Account[]>) => {
      state.accounts = payload;
    },
    setStageTweetActionBar: (state, { payload }: PayloadAction<string>) => {
      state.actionBar.tweet = payload;
    },
  },
});

export const { setDefaultAccount, setAccounts, setStageTweetActionBar } =
  slice.actions;

export default slice.reducer;

// refactor this
export const initPocket = () => (dispatch: Dispatch) => {
  let defaultAccounts = null;
  let defaultAccountsKeys = null;
  let accountsTemp = null;

  const localStoragePocketAccount = localStorage.getItem(
    localStorageKeys.pocket.POCKET_ACCOUNT
  );
  const localStoragePocket = localStorage.getItem(
    localStorageKeys.pocket.POCKET
  );
  if (localStoragePocket !== null) {
    const localStoragePocketData = JSON.parse(localStoragePocket);
    const keyPocket = Object.keys(localStoragePocketData)[0];
    const accountPocket = Object.values(localStoragePocketData)[0];
    defaultAccounts = accountPocket;
    defaultAccountsKeys = keyPocket;
  }
  if (localStoragePocketAccount !== null) {
    const localStoragePocketAccountData = JSON.parse(localStoragePocketAccount);
    if (localStoragePocket === null) {
      const keys0 = Object.keys(localStoragePocketAccountData)[0];
      localStorage.setItem(
        localStorageKeys.pocket.POCKET,
        JSON.stringify({ [keys0]: localStoragePocketAccountData[keys0] })
      );
      defaultAccounts = localStoragePocketAccountData[keys0];
      defaultAccountsKeys = keys0;
    } else if (defaultAccountsKeys !== null) {
      accountsTemp = {
        [defaultAccountsKeys]:
          localStoragePocketAccountData[defaultAccountsKeys],
        ...localStoragePocketAccountData,
      };
    }
  } else {
    localStorage.removeItem(localStorageKeys.pocket.POCKET);
    localStorage.removeItem(localStorageKeys.pocket.POCKET_ACCOUNT);
  }

  defaultAccountsKeys &&
    dispatch(
      setDefaultAccount({
        name: defaultAccountsKeys,
        account: defaultAccounts,
      })
    );
  accountsTemp && dispatch(setAccounts(accountsTemp));
};

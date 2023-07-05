import { Dispatch } from 'redux';
import { localStorageKeys } from 'src/constants/localStorageKeys';

import { Account, DefaultAccount } from 'src/types/defaultAccount';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { POCKET } from '../../utils/config';

type SliceState = {
  actionBar: {
    tweet: string;
  };
  defaultAccount: DefaultAccount;
  accounts: null | { [key: string]: Account };
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
    setDefaultAccount: (state, { payload }: PayloadAction<DefaultAccount>) => {
      state.defaultAccount = payload;
    },
    setAccounts: (state, { payload }: PayloadAction<Account[]>) => {
      state.accounts = payload;
    },
    setStageTweetActionBar: (state, { payload }: PayloadAction<string>) => {
      state.actionBar.tweet = payload;
    },

    // bullshit
    deleteAddress: (state, { payload }: PayloadAction<string>) => {
      if (state.accounts) {
        Object.keys(state.accounts).forEach((accountKey) => {
          Object.keys(state.accounts[accountKey]).forEach((networkKey) => {
            if (state.accounts[accountKey][networkKey].bech32 === payload) {
              delete state.accounts[accountKey][networkKey];

              if (Object.keys(state.accounts[accountKey]).length === 0) {
                delete state.accounts[accountKey];
              }

              if (state.defaultAccount?.account?.cyber?.bech32 === payload) {
                if (Object.keys(state.accounts).length) {
                  state.defaultAccount = {
                    name: Object.keys(state.accounts)[0],
                    account: state.accounts[Object.keys(state.accounts)[0]],
                  };
                } else {
                  state.defaultAccount = {
                    name: null,
                    account: null,
                  };
                }
              }

              saveToLocalStorage(state);
            }
          });
        });
      }
    },
  },
});

function saveToLocalStorage(state) {
  const { defaultAccount, accounts } = state;

  defaultAccount &&
    localStorage.setItem(
      localStorageKeys.pocket.POCKET,
      JSON.stringify({
        [defaultAccount.name]: defaultAccount.account,
      })
    );
  accounts &&
    localStorage.setItem(
      localStorageKeys.pocket.POCKET_ACCOUNT,
      JSON.stringify(accounts)
    );
}

export const {
  setDefaultAccount,
  setAccounts,
  setStageTweetActionBar,
  deleteAddress,
} = slice.actions;

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

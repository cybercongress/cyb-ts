import { Dispatch } from 'redux';
import { localStorageKeys } from 'src/constants/localStorageKeys';

import { Account, Accounts, DefaultAccount } from 'src/types/defaultAccount';
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

function saveToLocalStorage(state: SliceState) {
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

const slice = createSlice({
  name: 'pocket',
  initialState,
  reducers: {
    setDefaultAccount: (
      state,
      {
        payload: { name, account },
      }: PayloadAction<{ name: string; account?: Account }>
    ) => {
      state.defaultAccount = {
        name,
        account: account || state.accounts?.[name] || null,
      };

      saveToLocalStorage(state);
    },
    setAccounts: (state, { payload }: PayloadAction<Accounts>) => {
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
                const entries = Object.entries(state.accounts);

                const entryCyber = entries.find(
                  ([, value]) => value.cyber?.bech32
                );

                if (entryCyber) {
                  state.defaultAccount = {
                    name: entryCyber[0],
                    account: entryCyber[1],
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
  let accountsTemp: Accounts | null = null;

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
          localStoragePocketAccountData[defaultAccountsKeys] || undefined,
        ...localStoragePocketAccountData,
      };
    }
  } else {
    localStorage.removeItem(localStorageKeys.pocket.POCKET);
    localStorage.removeItem(localStorageKeys.pocket.POCKET_ACCOUNT);
  }

  defaultAccountsKeys &&
    defaultAccounts &&
    dispatch(
      setDefaultAccount({
        name: defaultAccountsKeys,
        account: defaultAccounts,
      })
    );

  accountsTemp &&
    Object.keys(accountsTemp).forEach((key) => {
      if (!accountsTemp[key] || Object.keys(accountsTemp[key]).length === 0) {
        delete accountsTemp[key];
      }
    });

  accountsTemp && dispatch(setAccounts(accountsTemp));
};

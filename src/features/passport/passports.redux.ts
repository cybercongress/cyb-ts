import {
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { queryPassportContract } from 'src/soft.js/api/passport';
import { Citizenship } from 'src/types/citizenship';
import { CyberClient } from '@cybercongress/cyber-js';
import { RootState } from 'src/redux/store';
import { AppThunk } from 'src/redux/types';
import { selectFollowings } from 'src/redux/features/currentAccount';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { Accounts } from 'src/types/defaultAccount';

export type SliceState = {
  // address
  [key in string]?: {
    data?: Citizenship | null;
    loading: boolean;
  };
};

const initialState: SliceState = {};

export function getCommunityPassports(queryClient: CyberClient): AppThunk {
  return (dispatch, getState) => {
    const { currentAccount, passports } = getState();
    const { following, followers, friends } = currentAccount.community;
    [...friends, ...following, ...followers].forEach((address) => {
      const passport = passports[address];
      if (!passport?.data && !passport?.loading) {
        dispatch(getPassport({ address, queryClient }));
      }
    });
  };
}

export function getAccountsPassports(queryClient: CyberClient): AppThunk {
  return (dispatch, getState) => {
    const { pocket, passports } = getState();
    const { accounts } = pocket;

    if (accounts === null) {
      return;
    }

    Object.keys(accounts).forEach((key) => {
      const item = accounts[key];
      const address = item.cyber.bech32;
      const passport = passports[address];
      if (!passport?.data && !passport?.loading) {
        dispatch(getPassport({ address, queryClient }));
      }
    });
  };
}

const getPassport = createAsyncThunk(
  'passports/getPassport',
  async ({
    address,
    queryClient,
  }: {
    address: string;
    queryClient: CyberClient;
  }) => {
    const response = await queryPassportContract(
      {
        active_passport: {
          address,
        },
      },
      queryClient
    );
    return response;
  }
);

const slice = createSlice({
  name: 'passports',
  initialState,
  reducers: {
    addAddress: (
      state,
      {
        payload: { address, currentAddress },
      }: PayloadAction<{
        address: string;
        currentAddress: string;
      }>
    ) => {
      if (
        !(
          state[currentAddress]?.data &&
          state[currentAddress].data.extension.addresses
        )
      ) {
        return;
      }

      state[currentAddress].data.extension.addresses.push({
        label: null,
        address,
      });
    },

    deleteAddress: (
      state,
      {
        payload: { address, currentAddress },
      }: PayloadAction<{
        address: string;
        currentAddress: string;
      }>
    ) => {
      if (
        !(
          state[currentAddress]?.data &&
          state[currentAddress].data.extension.addresses
        )
      ) {
        return;
      }

      state[currentAddress].data.extension.addresses = state[
        currentAddress
      ].data.extension.addresses.filter((item) => item.address !== address);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPassport.pending, (state, action) => {
      state[action.meta.arg.address] = {
        loading: true,
      };
    });

    builder.addCase(getPassport.fulfilled, (state, action) => {
      state[action.meta.arg.address] = {
        loading: false,
        data: action.payload,
      };
    });

    builder.addCase(getPassport.rejected, (state, action) => {
      console.error(action);

      state[action.meta.arg.address] = {
        loading: false,
      };
    });
  },
});

export const selectCommunityPassports = createSelector(
  (state: RootState) => state.currentAccount.community,
  (state: RootState) => state.passports,
  (community, passports) => {
    const { following, followers, friends } = community;

    function process(addresses: string[]) {
      return addresses.reduce<SliceState>((acc, value) => {
        acc[value] = passports[value];
        return acc;
      }, {});
    }

    return {
      following: process(following),
      followers: process(followers),
      friends: process(friends),
    };
  }
);

export const selectAccountsPassports = createSelector(
  (state: RootState) => state.pocket.accounts,
  (state: RootState) => state.passports,
  (accounts, passports) => {
    function process(addresses: Accounts) {
      return Object.keys(addresses).reduce<SliceState>((acc, key) => {
        const item = addresses[key];
        const address = item.cyber.bech32;
        acc[address] = passports[address];
        return acc;
      }, {});
    }

    return {
      accounts: accounts ? process(accounts) : {},
    };
  }
);

export const selectCurrentPassport = createSelector(
  selectCurrentAddress,
  (state: RootState) => state.passports,
  (address, passports) => (address ? passports[address] : undefined)
);

export const { deleteAddress, addAddress } = slice.actions;

export { getPassport };

export default slice.reducer;

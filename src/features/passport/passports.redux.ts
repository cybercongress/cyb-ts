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

type SliceState = {
  // address
  [key in string]?: {
    data?: Citizenship | null;
    loading: boolean;
  };
};

const initialState: SliceState = {};

export function getFollowingsPassports(queryClient: CyberClient): AppThunk {
  return (dispatch, getState) => {
    const { currentAccount, passports } = getState();
    currentAccount.community.following.forEach((address) => {
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
    });
  },
});

const selectPassports = (state: RootState) => state.passports;

export const selectFollowingsPassports = createSelector(
  selectFollowings,
  selectPassports,
  (followings, passports) => {
    return followings
      .map((address) => {
        return passports[address];
      })
      .filter(Boolean);
  }
);

export const { deleteAddress, addAddress } = slice.actions;

export { getPassport };

export default slice.reducer;

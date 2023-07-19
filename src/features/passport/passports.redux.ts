import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { queryPassportContract } from 'src/soft.js/api/passport';
import { Citizenship } from 'src/types/citizenship';
import { CyberClient } from '@cybercongress/cyber-js';

type SliceState = {
  // address
  [key in string]?: {
    data?: Citizenship | null;
    loading: boolean;
  };
};

const initialState: SliceState = {};

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

export const { deleteAddress, addAddress } = slice.actions;

export { getPassport };

export default slice.reducer;

/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Citizenship } from 'src/types/citizenship';

type SliceState = {
  data: Citizenship | null;
  loading: boolean;
};

const initialState: SliceState = {
  data: null,
  loading: false,
};

const slice = createSlice({
  name: 'passport',
  initialState,
  reducers: {
    setPassportLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.loading = payload;
    },
    setPassport: (state, { payload }: PayloadAction<Citizenship | null>) => {
      state.data = payload;
      state.loading = false;
    },

    addAddress: (state, { payload }: PayloadAction<string>) => {
      if (!(state.data && state.data.extension.addresses)) {
        return;
      }

      state.data.extension.addresses.push({
        label: null,
        address: payload,
      });
    },

    deleteAddress: (state, { payload }: PayloadAction<string>) => {
      if (!(state.data && state.data.extension.addresses)) {
        return;
      }

      state.data.extension.addresses = state.data.extension.addresses.filter(
        (item) => item.address !== payload
      );
    },
  },
});

export const { setPassport, setPassportLoading, deleteAddress, addAddress } =
  slice.actions;

export default slice.reducer;

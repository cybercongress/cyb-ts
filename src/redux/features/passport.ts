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
    setPassportLoading: (state) => {
      state.loading = true;
    },
    setPassport: (state, { payload }: PayloadAction<Citizenship>) => {
      state.data = payload;
      state.loading = false;
    },

    addAddress: (state, { payload }: PayloadAction<string>) => {
      state.data.extension.addresses.push({
        label: null,
        address: payload,
      });
    },

    deleteAddress: (state, { payload }: PayloadAction<string>) => {
      state.data.extension.addresses = state.data.extension.addresses.filter(
        (item) => item.address !== payload
      );
    },
  },
});

export const { setPassport, setPassportLoading, deleteAddress, addAddress } =
  slice.actions;

export default slice.reducer;

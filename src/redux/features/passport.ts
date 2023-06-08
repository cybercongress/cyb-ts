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
  },
});

export const { setPassport, setPassportLoading } = slice.actions;

export default slice.reducer;

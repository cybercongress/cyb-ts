import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type ResolveType = (value: any) => void;
type RejectType = (reason?: any) => void;

type InitialState = {
  resolve?: ResolveType;
  reject?: RejectType;
  memo: string;
};
const initialState = { memo: '' } as InitialState;

const signerSlice = createSlice({
  name: 'signer',
  initialState,
  reducers: {
    shareSignerPromise(
      state,
      { payload }: PayloadAction<{ resolve: ResolveType; reject: RejectType }>
    ) {
      state.resolve = payload.resolve;
      state.reject = payload.reject;
    },
    resetSignerState() {
      return { ...initialState };
    },
    updateMemo(state, { payload }: PayloadAction<string>) {
      state.memo = payload;
    },
  },
});

export const { shareSignerPromise, resetSignerState, updateMemo } =
  signerSlice.actions;

export default signerSlice.reducer;

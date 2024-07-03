import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type ResolveType = (value: any) => void;
type RejectType = (reason?: any) => void;

type InitialState = {
  resolve?: ResolveType;
  reject?: RejectType;
  actionBarState?: number;
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
    setActionBarState(state, { payload }: PayloadAction<number>) {
      state.actionBarState = payload;
    },
    updateMemo(state, { payload }: PayloadAction<string>) {
      state.memo = payload;
    },
  },
});

export const {
  shareSignerPromise,
  resetSignerState,
  setActionBarState,
  updateMemo,
} = signerSlice.actions;

export default signerSlice.reducer;

import { StdFee } from '@keplr-wallet/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type ResolveType = (value: any) => void;
type RejectType = (reason?: any) => void;

type InitialState = {
  resolve?: ResolveType;
  reject?: RejectType;
  memo: string;
  fee?: number | 'auto' | StdFee;
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
    setFee(state, { payload }: PayloadAction<number | 'auto' | StdFee>) {
      state.fee = payload;
    },
  },
});

export const { shareSignerPromise, resetSignerState, updateMemo, setFee } =
  signerSlice.actions;

export default signerSlice.reducer;

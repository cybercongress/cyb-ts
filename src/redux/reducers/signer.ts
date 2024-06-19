import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type ResolveType = (value: any) => void;
type RejectType = (reason?: any) => void;

type InitialState = {
  open: boolean;
  resolve?: ResolveType;
  reject?: RejectType;
};
const initialState = { open: false } as InitialState;

const signerSlice = createSlice({
  name: 'signer',
  initialState,
  reducers: {
    openSignerModal(
      state,
      { payload }: PayloadAction<{ resolve: ResolveType; reject: RejectType }>
    ) {
      state.open = true;
      state.resolve = payload.resolve;
      state.reject = payload.reject;
    },
    closeSignerModal() {
      return { ...initialState };
    },
  },
});

export const { openSignerModal, closeSignerModal } = signerSlice.actions;

export default signerSlice.reducer;

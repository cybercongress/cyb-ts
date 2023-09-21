import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { SyncState } from 'src/services/backend/types';

type BackendSliceState = {
  syncState: SyncState;
};

const initialState: BackendSliceState = {
  syncState: {
    status: 'inactive',
    entryStatus: {},
  },
};

const backendSlice = createSlice({
  name: 'backend',
  initialState,
  reducers: {
    updateWorkerStatus: (state, action) => {
      state.syncState.status = action.payload.status;
      state.syncState.lastError = action.payload.lastError;
    },
    updateSyncStatus: (state, action) => {
      const { entry, state: entryState } = action.payload;
      state.syncState.entryStatus[entry] = {
        ...state.syncState.entryStatus[entry],
        ...entryState,
      };
    },
  },
});

export const { updateWorkerStatus, updateSyncStatus } = backendSlice.actions;

export default backendSlice.reducer;

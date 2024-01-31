import {
  ServiceName,
  SyncState,
  ServiceStatus,
  BroadcastChannelMessage,
  SyncEntryStatus,
} from 'src/services/backend/types/services';
import { assocPath } from 'ramda';

type BackendState = {
  dbPendingWrites: number;
  syncState: SyncState;
  services: {
    [key in ServiceName]: {
      status: ServiceStatus;
      error?: string;
      message?: string;
    };
  };
  syncEstimatedTime: number;
};

const initialState: BackendState = {
  dbPendingWrites: 0,
  syncState: {
    status: 'inactive',
    entryStatus: {},
  },
  services: {
    db: { status: 'inactive' },
    ipfs: { status: 'inactive' },
    sync: { status: 'inactive' },
  },
  syncEstimatedTime: 0,
};

function calculateAverageSyncTime(entryStatus: SyncEntryStatus): number {
  let totalEstimatedTime = 0;
  let count = 0;
  Object.values(entryStatus).forEach((entry) => {
    if (entry?.progress?.estimatedTime !== undefined) {
      totalEstimatedTime += entry.progress.estimatedTime;
      count++;
    }
  });
  console.log('--------calculateAverageSyncTime', totalEstimatedTime, count);
  return count > 0 ? totalEstimatedTime / count : 0;
}

// Backend state
function backendReducer(state = initialState, action: BroadcastChannelMessage) {
  switch (action.type) {
    case 'indexeddb_write': {
      return assocPath(['dbPendingWrites'], action.value, state);
    }
    case 'sync_status': {
      return assocPath(
        ['syncState'],
        { ...state.syncState, ...action.value },
        state
      );
    }
    case 'sync_entry': {
      const { entry, state: entryState } = action.value;
      const updatedEntry = {
        ...state.syncState.entryStatus[entry],
        done: false,
        ...entryState,
      };
      const newState = assocPath(
        ['syncState', 'entryStatus', entry],
        updatedEntry,
        state
      );

      newState.syncEstimatedTime = calculateAverageSyncTime(
        newState.syncState.entryStatus
      );

      return newState;
    }

    case 'service_status': {
      const { name, status, message } = action.value;
      return assocPath(['services', name], { status, message }, state);
    }
    default:
      return state;
  }
}

export default backendReducer;

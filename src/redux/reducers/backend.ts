import { BroadcastChannelMessage } from 'src/services/backend/channels/BroadcastChannel';
import {
  ServiceName,
  WorkerState,
  ServiceStatus,
} from 'src/services/backend/types';
import { assocPath } from 'ramda';

type BackendState = {
  dbPendingWrites: number;
  syncState: WorkerState;
  services: { [key in ServiceName]: { status: ServiceStatus; error?: string } };
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
};

// Backend state
function backendReducer(state = initialState, action: BroadcastChannelMessage) {
  switch (action.type) {
    case 'indexeddb_write': {
      return assocPath(['dbPendingWrites'], action.value, state);
    }
    case 'worker_status': {
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
      return assocPath(
        ['syncState', 'entryStatus', entry],
        updatedEntry,
        state
      );
    }

    case 'service_status': {
      const { name, status, error } = action.value;
      return assocPath(['services', name], { status, error }, state);
    }
    default:
      return state;
  }
}

export default backendReducer;

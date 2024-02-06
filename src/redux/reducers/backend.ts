import {
  ServiceName,
  SyncState,
  ServiceStatus,
  BroadcastChannelMessage,
  SyncEntryStatus,
  SyncEntryName,
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
};

const initialState: BackendState = {
  dbPendingWrites: 0,
  syncState: {
    status: 'inactive',
    entryStatus: {},
    totalEstimatedTime: 0,
    message: '',
    inProgress: false,
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

      const messages: string[] = [];
      let totalEstimatedTime = 0;
      const { entryStatus } = newState.syncState;
      (['my-friends', 'particle', 'transaction'] as SyncEntryName[]).forEach(
        (name) => {
          if (entryStatus[name]) {
            const { progress, status } = newState.syncState.entryStatus[name]!;

            if (progress && status === 'in-progress') {
              totalEstimatedTime += progress.estimatedTime;
              messages.push(
                `${name}: ${progress.completeCount}/${progress.totalCount}`
              );
            }
          }
        }
      );

      // if (
      //   messages.length === 0 &&
      //   state.syncState.entryStatus['transaction']?.status === 'in-progress'
      // ) {
      //   debugger;
      // }

      newState.syncState = {
        ...newState.syncState,
        message: messages.join(', '),
        totalEstimatedTime,
        inProgress: messages.length > 0,
      };

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

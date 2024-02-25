import {
  ServiceName,
  SyncState,
  ServiceStatus,
  BroadcastChannelMessage,
  SyncEntryName,
} from 'src/services/backend/types/services';
import { assocPath } from 'ramda';
import { CommunityDto } from 'src/services/CozoDb/types/dto';
import { NeuronAddress } from 'src/types/base';
import { raw } from '@storybook/react';
import { removeDublicates } from 'src/utils/list';

type BackendState = {
  dbPendingWrites: number;
  syncState: SyncState;
  community: {
    isLoaded: boolean;
    raw: CommunityDto[];
    following: NeuronAddress[];
    followers: NeuronAddress[];
    friends: NeuronAddress[];
  };
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
  community: {
    isLoaded: false,
    raw: [],
    following: [],
    followers: [],
    friends: [],
  },
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

    case 'load_community': {
      const { action: stateAction, items } = action.value;
      // console.log('------------load_community', stateAction, items, state);
      if (stateAction === 'reset') {
        const community = {
          isLoaded: false,
          raw: [],
          following: [],
          followers: [],
          friends: [],
        };
        return { ...state, community };
      }
      const allItems = [...state.community.raw, ...items];

      const community = {
        isLoaded: stateAction === 'complete',
        raw: allItems,
        following: removeDublicates(
          allItems
            .filter((item) => item.following && !item.follower)
            .map((item) => item.neuron)
        ),
        followers: removeDublicates(
          allItems
            .filter((item) => item.follower && !item.following)
            .map((item) => item.neuron)
        ),
        friends: removeDublicates(
          allItems
            .filter((item) => item.follower && item.following)
            .map((item) => item.neuron)
        ),
      };

      return { ...state, community };
    }

    default:
      return state;
  }
}

export default backendReducer;

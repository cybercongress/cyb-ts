import {
  SyncState,
  WorkerStatus,
  SyncEntryUpdate,
  SyncBroadcastType,
} from './types';

import store from 'src/redux/store';
import {
  updateWorkerStatus,
  updateSyncStatus,
} from 'src/redux/features/backend';

// eslint-disable-next-line import/prefer-default-export
export class DualChannelSyncState {
  private _state: SyncState = {
    status: 'inactive',
    entryStatus: {},
  };

  private broadcastType: SyncBroadcastType;

  private channel: BroadcastChannel;

  get state(): SyncState {
    return this._state;
  }

  constructor(
    broadcastType: SyncBroadcastType,
    channelName: string,
    onChange?: (func: Function) => void
  ) {
    this.channel = new BroadcastChannel(channelName);
    console.log('----bg DualChannelSyncState', broadcastType);
    this.broadcastType = broadcastType;
    if (broadcastType === 'reciever') {
      this.channel.onmessage = (event) => {
        const { type, value } = event.data;

        switch (type) {
          case 'workerStatus':
            const { status, lastError } = value;
            this._state.status = status;
            this._state.lastError = lastError;
            onChange &&
              onChange(() => updateWorkerStatus({ status, lastError }));
            // store.dispatch(updateWorkerStatus({ status, lastError }));
            console.log('Worker Status:', value, type);
            break;
          case 'sync':
            const { entry, state } = value;
            const currentEntryState = this._state.entryStatus[entry] || {};
            this._state.entryStatus[entry] = {
              ...currentEntryState,
              ...state,
            };
            onChange && onChange(() => updateSyncStatus({ entry, state }));
            // store.dispatch(updateSyncStatus({ entry, state }));
            console.log('Sync:', value, this._state, type);
            break;
          default:
            console.warn('Unknown message type:', type);
        }
        // onChange && onChange(this._state);
      };
    }
  }

  public syncStatusUpdate(status: WorkerStatus, lastError?: string) {
    if (this.broadcastType === 'reciever') {
      throw new Error('write is not allowed for reciever');
    }

    this._state.status = status;
    this._state.lastError = lastError;
    this.channel.postMessage({
      type: 'workerStatus',
      value: { status, lastError },
    });
  }

  public syncEntryUpdate(entryState: Partial<SyncEntryUpdate>) {
    if (this.broadcastType === 'reciever') {
      throw new Error('write is not allowed for reciever');
    }

    const { entry, state } = entryState;
    this._state.entryStatus[entry!] = state;

    this.channel.postMessage({ type: 'sync', value: entryState });
  }
}

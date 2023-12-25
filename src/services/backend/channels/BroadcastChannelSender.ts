import {
  BroadcastChannelMessage,
  ServiceName,
  ServiceStatus,
  SyncEntryName,
  SyncEntryStatus,
  SyncProgress,
} from '../types';
import { CYB_BROADCAST_CHANNEL } from './consts';

class BroadcastChannelSender {
  static mockClear() {
    throw new Error('Method not implemented.');
  }

  private channel: BroadcastChannel;

  static mock: any;

  constructor() {
    this.channel = new BroadcastChannel(CYB_BROADCAST_CHANNEL);
  }

  public postServiceStatus(
    name: ServiceName,
    status: ServiceStatus,
    message?: string
  ) {
    this.channel.postMessage({
      type: 'service_status',
      value: { name, status, message },
    });
  }

  public postSyncStatus(status: ServiceStatus, lastError?: string) {
    this.channel.postMessage({
      type: 'sync_status',
      value: { status, lastError },
    });
  }

  public postSyncEntryProgress(entry: SyncEntryName, state: SyncProgress) {
    // console.log('postSyncEntryProgress', entry, state);
    this.channel.postMessage({ type: 'sync_entry', value: { entry, state } });
  }

  post(msg: BroadcastChannelMessage) {
    this.channel.postMessage(msg);
  }
}

export const broadcastStatus = (
  name: SyncEntryName,
  channelApi: BroadcastChannelSender
) => {
  return {
    sendStatus: (status: SyncProgress['status'], message?: string) => {
      channelApi.postSyncEntryProgress(name, {
        status,
        message,
        done: status === 'idle' || status === 'error',
      });
    },
  };
};

export default BroadcastChannelSender;

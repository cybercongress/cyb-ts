import {
  BroadcastChannelMessage,
  ServiceName,
  ServiceStatus,
  SyncEntryName,
  SyncProgress,
} from '../types';
import { CYB_BROADCAST_CHANNEL } from './consts';

class BroadcastChannelSender {
  private channel: BroadcastChannel;

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
    this.channel.postMessage({ type: 'sync_entry', value: { entry, state } });
  }

  post(msg: BroadcastChannelMessage) {
    this.channel.postMessage(msg);
  }
}

export default BroadcastChannelSender;

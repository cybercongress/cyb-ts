import { SenseListItem } from '../types/sense';
import {
  BroadcastChannelMessage,
  SenseListRemove,
  SenseListUpdate,
  ServiceName,
  ServiceStatus,
  SyncEntryName,
  SyncProgress,
} from '../types/services';
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

  public postSenseUpdate(senseList: SenseListItem[]) {
    // console.log('postSyncEntryProgress', entry, state);
    if (senseList.length > 0) {
      this.channel.postMessage({
        type: 'sense_list_update',
        list: senseList,
      } as SenseListUpdate);
    }
  }

  public postSenseRemove(senseList: SenseListItem[]) {
    // console.log('postSyncEntryProgress', entry, state);
    this.channel.postMessage({
      type: 'sense_list_remove',
      list: senseList,
    } as SenseListRemove);
  }

  post(msg: BroadcastChannelMessage) {
    this.channel.postMessage(msg);
  }
}

export default BroadcastChannelSender;

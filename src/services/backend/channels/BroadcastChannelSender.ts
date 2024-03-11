import { updateSenseList } from 'src/features/sense/redux/sense.redux';
import { SenseListItem } from '../types/sense';
import {
  BroadcastChannelMessage,
  ServiceName,
  ServiceStatus,
  SyncEntryName,
  SyncProgress,
} from '../types/services';
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

  public postSyncEntryProgress(entry: SyncEntryName, state: SyncProgress) {
    // console.log('postSyncEntryProgress', entry, state);
    this.channel.postMessage({ type: 'sync_entry', value: { entry, state } });
  }

  public postSenseUpdate(senseList: SenseListItem[]) {
    // console.log('postSenseUpdate', senseList);
    if (senseList.length > 0) {
      this.channel.postMessage(updateSenseList(senseList));
    }
  }

  post(msg: BroadcastChannelMessage) {
    this.channel.postMessage(msg);
  }
}

export default BroadcastChannelSender;

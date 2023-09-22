import { IndexedDbWriteMessage } from '../CozoDb/types';
import { SyncEntryMessage, WorkerStatusMessage } from './types';

const CYB_BROADCAST_CHANNEL = 'cyb-broadcast-channel';

export type BroadcastChannelMessage =
  | WorkerStatusMessage
  | SyncEntryMessage
  | IndexedDbWriteMessage;

class BcChannel {
  private channel: BroadcastChannel;

  constructor(
    onMessage?: (msg: MessageEvent<BroadcastChannelMessage>) => void
  ) {
    this.channel = new BroadcastChannel(CYB_BROADCAST_CHANNEL);

    if (onMessage) {
      this.channel.onmessage = (event) => onMessage(event);
    }
  }

  post(msg: BroadcastChannelMessage) {
    console.log('----bg BcChannel msg', msg);
    this.channel.postMessage(msg);
  }
}

export default BcChannel;

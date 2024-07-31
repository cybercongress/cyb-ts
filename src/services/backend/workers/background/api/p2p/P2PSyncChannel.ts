import { NeuronPeerId } from 'src/types/base';
import { PubSubMessageWitPeerId } from 'src/services/backend/types/services';
import { onMessage, PUBSUB_PIN_RESPONSE } from './types';

const CYB_P2P_SYNC_CHANNEL_NAME = 'cyb-p2p-sync-channel';

export const P2PChannelListener = (
  onMessage: onMessage,
  filter?: (msg: PubSubMessageWitPeerId) => boolean
) => {
  const channel = new BroadcastChannel(CYB_P2P_SYNC_CHANNEL_NAME);

  channel.onmessage = (event) => {
    const message = event.data;
    if (!filter || filter(message)) {
      onMessage(message);
    }
  };

  const close = () => {
    channel.close();
  };
  return { close };
};

export const P2PChannelSender = () => {
  const channel = new BroadcastChannel(CYB_P2P_SYNC_CHANNEL_NAME);
  const post = (message: PubSubMessageWitPeerId) => {
    channel.postMessage(message);
  };
  const postSyncBatch = (dest: NeuronPeerId, pins: string[]) => {
    channel.postMessage({
      type: PUBSUB_PIN_RESPONSE,
      pins,
      peerId: dest,
    });
  };

  return { postSyncBatch, post };
};

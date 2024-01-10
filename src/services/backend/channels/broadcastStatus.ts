import { SyncEntryName, SyncProgress } from '../types/services';
import { BroadcastChannelSender } from './BroadcastChannelSender';

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

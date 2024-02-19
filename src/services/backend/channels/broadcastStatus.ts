import {
  ProgressTracking,
  SyncEntryName,
  SyncProgress,
} from '../types/services';
import { BroadcastChannelSender } from './BroadcastChannelSender';

export const broadcastStatus = (
  name: SyncEntryName,
  channelApi: BroadcastChannelSender
) => {
  return {
    sendStatus: (
      status: SyncProgress['status'],
      message?: string,
      progress?: ProgressTracking
    ) => {
      channelApi.postSyncEntryProgress(name, {
        status,
        message,
        progress,
        done: ['idle', 'error', 'listen'].some((s) => s === status),
      });
    },
  };
};

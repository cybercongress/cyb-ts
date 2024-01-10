import { IndexedDbWriteMessage } from '../../CozoDb/types/types';

export type SyncEntryName =
  | 'pin'
  | 'particle'
  | 'transaction'
  | 'resolver'
  | 'my-chats';

export type SyncProgress = {
  status?: 'idle' | 'in-progress' | 'error';
  progress?: number;
  done?: boolean;
  error?: string;
  message?: string;
};

export type ServiceStatus = 'inactive' | 'starting' | 'started' | 'error';

export type SyncEntryStatus = Partial<Record<SyncEntryName, SyncProgress>>;

export type SyncState = {
  status: ServiceStatus;
  entryStatus: SyncEntryStatus;
  lastError?: string;
};

export type SyncStatusMessage = {
  type: 'sync_status';
  value: Omit<SyncState, 'entryStatus'>;
};

export type SyncEntryMessage = {
  type: 'sync_entry';
  value: {
    entry: SyncEntryName;
    state: SyncProgress;
  };
};

export type ServiceName = 'db' | 'ipfs' | 'sync';

export type ServiceStatusMessage = {
  type: 'service_status';
  value: { name: ServiceName; status: ServiceStatus; message?: string };
};

export type BroadcastChannelMessage =
  | SyncStatusMessage
  | SyncEntryMessage
  | IndexedDbWriteMessage
  | ServiceStatusMessage;

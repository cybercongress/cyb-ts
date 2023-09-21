export type SyncEntry = 'pin' | 'particle' | 'transaction';
export type SyncProgress = {
  progress?: number;
  done?: boolean;
  error?: string;
};
export type SyncEntryStatus = Partial<Record<SyncEntry, SyncProgress>>;

export type WorkerStatus = 'inactive' | 'idle' | 'syncing' | 'error';
export type SyncState = {
  status: WorkerStatus;
  entryStatus: SyncEntryStatus;
  lastError?: string;
};
export type SyncEntryUpdate = {
  entry: SyncEntry;
  state: SyncProgress;
};

export type SyncBroadcastType = 'sender' | 'reciever';

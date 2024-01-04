import { PinType } from 'ipfs-core-types/src/pin';
import { QueuePriority } from 'src/services/QueueManager/types';
import { IpfsContentType } from 'src/services/ipfs/ipfs';
import { NeuronAddress, ParticleCid, TransactionHash } from 'src/types/base';

type PinEntryType = Exclude<PinType, 'all'>;
// example of db optimization for classifiers

export const PinTypeMap: Record<PinEntryType, number> = {
  indirect: -1,
  direct: 0,
  recursive: 1,
};

export enum EntryType {
  transactions = 1,
  particle = 2,
}

export type PinDbEntity = {
  cid: string;
  type: keyof typeof PinTypeMap;
};

export type TransactionDbEntity = {
  hash: string;
  type: string;
  timestamp: number;
  value: Object; // Transaction;
  success: boolean;
  neuron: NeuronAddress;
};

export type SyncStatusDbEntity = {
  entry_type: EntryType;
  id: NeuronAddress | ParticleCid;
  timestamp_update: number;
  timestamp_read: number;
  disabled: boolean;
  unread_count: number;
  last_id: TransactionHash | ParticleCid; // Transaction HASH or Particle CID
  meta: { direction: 'from' | 'to' } | { memo: string };
};
export type ParticleDbEntity = {
  id: ParticleCid;
  size: number;
  size_local: number;
  blocks: number;
  mime: string;
  type: IpfsContentType;
  text: string;
};

export type ConfigDbEntity = {
  key: string;
  group_key: string;
  value: Object;
};

export type LinkDbEntity = {
  from: ParticleCid;
  to: ParticleCid;
  neuron: NeuronAddress;
  timestamp: number;
};

export type ConfigDbEntity = {
  key: string;
  group_key: string;
  value: Object;
};

export enum SyncQueueStatus {
  pending = 0,
  executing = 1,
  done = 2,
  error = -1,
}

export type SyncQueueDbEntity = {
  id: string;
  status: SyncQueueStatus;
  priority: QueuePriority | number;
};

export type DbEntity =
  | TransactionDbEntity
  | ParticleDbEntity
  | SyncStatusDbEntity
  | ConfigDbEntity
  | SyncQueueDbEntity;

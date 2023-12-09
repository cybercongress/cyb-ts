import { PinType } from 'ipfs-core-types/src/pin';
import { NeuronAddress, ParticleCid } from 'src/types/base';
import { IpfsContentType } from '../ipfs/ipfs';
type ColumnType = 'String' | 'Int' | 'Bool' | 'Float' | 'Json';

export interface Column {
  column: string;
  type: ColumnType;
  is_key?: boolean;
  index: number;
  is_default: boolean;
}

export interface TableSchema {
  keys: string[];
  values: string[];
  columns: Record<string, Column>;
}

export type DBValue = string | number | boolean;

export interface IDBResult {
  headers: string[];
  rows: Array<Array<DBValue>>;
  ok: true;
}

export interface IDBResultError {
  code: string;
  display: string;
  message: string;
  severity: string;
  ok: false;
}

export type PinEntryType = Exclude<PinType, 'all'>;

// example of db optimization for classifiers
export const PinTypeMap: Record<PinEntryType, number> = {
  indirect: -1,
  direct: 0,
  recursive: 1,
};

export type DBSchema = Record<string, TableSchema>;
export interface DBResultWithColIndex extends IDBResult {
  index: Record<string, number>;
}

export type IndexedDbWriteMessage = {
  type: 'indexeddb_write';
  value: number;
};

export enum EntryType {
  transactions = 1,
  particle = 2,
}

export type TransactionDbEntry = {
  hash: string;
  type: string;
  timestamp: number;
  value: Object; // Transaction;
  success: boolean;
  neuron_address: NeuronAddress;
};

export type SyncStatusDbEntry = {
  entry_type: EntryType;
  id: NeuronAddress | ParticleCid;
  timestamp_update: number;
  timestamp_read: number;
  disabled: boolean;
  unread_count: number;
};

export type ParticleDbEntry = {
  id: ParticleCid;
  size: number;
  size_local: number;
  blocks: number;
  mime: string;
  type: IpfsContentType;
  text: string;
};

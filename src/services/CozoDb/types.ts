import { PinType } from 'ipfs-core-types/src/pin';
import { NeuronAddress, ParticleCid } from 'src/types/base';
import { Transaction } from 'src/types/transaction';

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

// example of db optimization for classifiers
export const PinTypeMap: Record<Exclude<PinType, 'all'>, number> = {
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

export type EntryType = 'transactions' | 'particle';

export const EntryTypeMap: Record<EntryType, number> = {
  transactions: 1,
  particle: 2,
};

export type TransactionDbEntry = {
  hash: string;
  type: string;
  timestamp: number;
  value: Transaction;
  success: boolean;
  neuron_address: NeuronAddress;
};

export type SyncStatusDbEntry = {
  entry_type: number;
  id: NeuronAddress | ParticleCid;
  timestamp: number;
  last_read_timestamp: number;
  disabled: boolean;
  unread_count: number;
};

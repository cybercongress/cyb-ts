import { PinType } from 'ipfs-core-types/src/pin';

export interface Column {
  column: string;
  type: 'String' | 'Int' | 'Bool' | 'Float';
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

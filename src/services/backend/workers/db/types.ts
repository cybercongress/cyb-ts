import { DbEntity } from 'src/services/CozoDb/types';

export type DbStackItem = {
  isBatch: boolean;
  tableName: string;
  action: 'put' | 'update' | 'rm';
  data: Partial<DbEntity>[];
  batchSize?: number;
  onProgress?: (count: number) => void;
};

export type PutResult = 'success' | 'error' | 'deffered';

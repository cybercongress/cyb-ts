import { DbEntity } from 'src/services/CozoDb/types';

export type DbStackItem = {
  tableName: string;
  action: 'put' | 'update' | 'rm' | 'batch-put';
  data: Partial<DbEntity>[];
  batchSize?: number;
  onProgress?: (count: number) => void;
};

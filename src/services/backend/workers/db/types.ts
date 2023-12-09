export type DbStackItem = {
  isBatch: boolean;
  tableName: string;
  action: 'put' | 'update' | 'rm';
  data: any[] | any[][];
  batchSize?: number;
  onProgress?: (count: number) => void;
};

export type PutResult = 'success' | 'error' | 'deffered';

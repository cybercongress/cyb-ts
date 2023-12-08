export type DbStackItem = {
  isBatch: boolean;
  tableName: string;
  data: any[] | any[][];
  batchSize?: number;
  onProgress?: (count: number) => void;
};

export type PutResult = 'success' | 'error' | 'deffered';

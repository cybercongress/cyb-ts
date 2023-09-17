import { wrap, proxy } from 'comlink';
import dbWorker from 'worker-loader!./db.worker';
import { DbWorkerApi } from './db.worker';

const worker = new dbWorker();

function dbService() {
  const dbServiceProxy = wrap<DbWorkerApi>(worker);

  let writesCount = 0;

  const init = async () => {
    await dbServiceProxy.init();

    // Sync writesCount, main thread <- worker
    worker.onmessage = (event: any) => {
      const { type, value } = event.data;
      if (type === 'writesCountUpdate') {
        writesCount = value;
      }
    };
  };

  const runCommand = async (command: string) =>
    dbServiceProxy.runCommand(command);

  const executeGetCommand = async (
    tableName: string,
    conditionArr?: string[],
    keys?: string[]
  ) => dbServiceProxy.executeGetCommand(tableName, conditionArr, keys);

  const executePutCommand = async (tableName: string, array: any[][]) =>
    dbServiceProxy.executePutCommand(tableName, array);

  const executeBatchPutCommand = async (
    tableName: string,
    array: any[],
    batchSize: number,
    onProgress?: (count: number) => void
  ) =>
    dbServiceProxy.executeBatchPutCommand(
      tableName,
      array,
      batchSize,
      onProgress ? proxy(onProgress) : undefined
    );

  const importRelations = async (content: string) =>
    dbServiceProxy.importRelations(content);

  const exportRelations = async (relations: string[]) =>
    dbServiceProxy.exportRelations(relations);

  return {
    init,
    executePutCommand,
    executeBatchPutCommand,
    runCommand,
    executeGetCommand,
    importRelations,
    exportRelations,
  };
}

export default dbService();

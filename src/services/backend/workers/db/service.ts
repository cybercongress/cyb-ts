import { wrap, proxy } from 'comlink';
import { waitUntil } from 'src/utils/async/utils';

import { DbWorkerApi } from './worker';

const worker = new SharedWorker(new URL('./worker.ts', import.meta.url), {
  name: 'db-worker',
});
const dbApiProxy = wrap<DbWorkerApi>(worker.port);

function dbServiceApi() {
  let isInitialized = false;

  const init = async () => {
    // if (isInitialized) {
    //   throw new Error('CozoDb is already initialized');
    // }

    await dbApiProxy.init();
    isInitialized = true;
  };

  const runCommand = async (command: string) => dbApiProxy.runCommand(command);

  const executeGetCommand = async (
    tableName: string,
    conditionArr?: string[],
    keys?: string[]
  ) => dbApiProxy.executeGetCommand(tableName, conditionArr, keys);

  const executePutCommand = async (tableName: string, array: any[][]) => {
    await waitUntil(() => isInitialized);
    return dbApiProxy.executePutCommand(tableName, array);
  };

  const executeBatchPutCommand = async (
    tableName: string,
    array: any[],
    batchSize: number,
    onProgress?: (count: number) => void
  ) => {
    await waitUntil(() => isInitialized);

    return dbApiProxy.executeBatchPutCommand(
      tableName,
      array,
      batchSize,
      onProgress ? proxy(onProgress) : undefined
    );
  };
  const importRelations = async (content: string) =>
    dbApiProxy.importRelations(content);

  const exportRelations = async (relations: string[]) =>
    dbApiProxy.exportRelations(relations);

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

export default dbServiceApi();

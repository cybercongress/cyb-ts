import { wrap, proxy } from 'comlink';
import { DbWorkerApi } from './worker';

// const worker = new Worker(new URL('./db.worker.ts', import.meta.url));
// const dbServiceProxy = wrap<DbWorkerApi>(worker);

const worker = new SharedWorker(new URL('./worker.ts', import.meta.url));
const dbServiceProxy = wrap<DbWorkerApi>(worker.port);

async function waitUntiCondition(cond: () => boolean, timeoutDuration = 60000) {
  if (cond()) {
    return true;
  }

  const waitPromise = new Promise((resolve) => {
    const interval = setInterval(() => {
      if (cond()) {
        clearInterval(interval);
        resolve(true);
      }
    }, 10);
  });

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('waitUntiCondition timed out!'));
    }, timeoutDuration);
  });

  return Promise.race([waitPromise, timeoutPromise]);
}

function dbService() {
  let isInitialized = false;

  const init = async () => {
    // if (isInitialized) {
    //   throw new Error('CozoDb is already initialized');
    // }

    await dbServiceProxy.init();
    isInitialized = true;
  };

  const runCommand = async (command: string) =>
    dbServiceProxy.runCommand(command);

  const executeGetCommand = async (
    tableName: string,
    conditionArr?: string[],
    keys?: string[]
  ) => dbServiceProxy.executeGetCommand(tableName, conditionArr, keys);

  const executePutCommand = async (tableName: string, array: any[][]) => {
    await waitUntiCondition(() => isInitialized);
    return dbServiceProxy.executePutCommand(tableName, array);
  };

  const executeBatchPutCommand = async (
    tableName: string,
    array: any[],
    batchSize: number,
    onProgress?: (count: number) => void
  ) => {
    await waitUntiCondition(() => isInitialized);

    return dbServiceProxy.executeBatchPutCommand(
      tableName,
      array,
      batchSize,
      onProgress ? proxy(onProgress) : undefined
    );
  };
  const importRelations = async (content: string) =>
    dbServiceProxy.importRelations(content);

  const exportRelations = async (relations: string[]) =>
    dbServiceProxy.exportRelations(relations);

  // const importTransactions = async (address: string, cyberIndexHttps: string) =>
  //   dbServiceProxy.importTransactions(address, cyberIndexHttps);

  return {
    init,
    executePutCommand,
    executeBatchPutCommand,
    runCommand,
    executeGetCommand,
    importRelations,
    exportRelations,
    // importTransactions,
  };
}

export default dbService();

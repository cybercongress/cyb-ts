import { proxy, transferHandlers } from 'comlink';
import { BehaviorSubject } from 'rxjs';

import { WorkerUrl } from 'worker-url';

import { DbWorkerApi } from './worker';
import { createWorkerApi } from '../factoryMethods';
import { DbStackItem } from './types';

const workerUrl = new WorkerUrl(new URL('./worker.ts', import.meta.url));

const { apiProxy: dbApiProxy } = createWorkerApi<DbWorkerApi>(
  workerUrl,
  'cyb~cozodb'
);

function dbServiceApi() {
  const putStack: DbStackItem[] = []; // accumulate values while db is not initialized
  const isInitialized$ = new BehaviorSubject(false); // true when db is initialized

  // flush stack when db is initialized
  isInitialized$.subscribe((initialized) => {
    if (initialized) {
      while (putStack.length > 0) {
        const item = putStack.shift();
        processPutStackItem(item!);
      }
    }
  });

  // process put stack item or push it to stack if db is not initialized
  const processPutStackItem = async (item: DbStackItem) => {
    // console.log(
    //   '-------processPutStackItem',
    //   item,
    //   isInitialized$.value,
    //   putStack
    // );

    if (isInitialized$.value) {
      const { tableName, data, batchSize, onProgress, isBatch } = item;
      // single/batch mode
      const result = await (isBatch
        ? dbApiProxy.executeBatchPutCommand(
            tableName,
            data,
            batchSize!,
            onProgress ? proxy(onProgress) : undefined
          )
        : dbApiProxy.executePutCommand(tableName, data));
      return result.ok ? 'success' : 'error';
    }

    putStack.push(item);
    return 'deffered';
  };

  const init = async () => {
    await dbApiProxy.init();
    isInitialized$.next(true);
  };

  const runCommand = async (command: string) => dbApiProxy.runCommand(command);

  const executeGetCommand = async (
    tableName: string,
    conditionArr?: string[],
    keys?: string[]
  ) => dbApiProxy.executeGetCommand(tableName, conditionArr, keys);

  const executePutCommand = async (tableName: string, array: any[]) =>
    processPutStackItem({ tableName, data: array, isBatch: false });

  const executeBatchPutCommand = async (
    tableName: string,
    array: any[][],
    batchSize: number,
    onProgress?: (count: number) => void
  ) =>
    processPutStackItem({
      tableName,
      data: array,
      batchSize,
      isBatch: true,
      onProgress,
    });

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

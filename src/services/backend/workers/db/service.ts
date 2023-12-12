import { proxy, transferHandlers } from 'comlink';
import { BehaviorSubject } from 'rxjs';

import { WorkerUrl } from 'worker-url';
import { DbEntity } from 'src/services/CozoDb/types';

import { CozoDbWorkerApi } from './worker';
import { createWorkerApi } from '../factoryMethods';
import { DbStackItem as DbQueueItem } from './types';

const workerUrl = new WorkerUrl(new URL('./worker.ts', import.meta.url));

const { workerApiRemote: dbApiProxyRemote } = createWorkerApi<CozoDbWorkerApi>(
  workerUrl,
  'cyb~cozodb'
);

function dbServiceApi() {
  // accumulate here values while db is not initialized
  const tmpQueue: DbQueueItem[] = [];

  const isInitialized$ = new BehaviorSubject(false);

  // flush stack when db is initialized
  isInitialized$.subscribe((initialized) => {
    if (initialized) {
      while (tmpQueue.length > 0) {
        const item = tmpQueue.shift();
        executeOrEnqueue(item!);
      }
    }
  });

  // execute [modify] command or
  // push into queue until DB not is ready
  const executeOrEnqueue = async (item: DbQueueItem) => {
    if (isInitialized$.value) {
      const { tableName, data, batchSize, onProgress, isBatch, action } = item;
      // single/batch mode
      let result: { ok: boolean } | undefined;
      if (action === 'put') {
        result = await (isBatch
          ? dbApiProxyRemote.executeBatchPutCommand(
              tableName,
              data,
              batchSize!,
              onProgress ? proxy(onProgress) : undefined
            )
          : dbApiProxyRemote.executePutCommand(tableName, data));
      }

      if (action === 'update') {
        result = await dbApiProxyRemote.executeUpdateCommand(tableName, data);
      }
      if (action === 'rm') {
        result = await dbApiProxyRemote.executeRmCommand(tableName, data);
      }

      if (!result) {
        throw new Error('Unknown action');
      }

      return result.ok ? 'success' : 'error';
    }

    tmpQueue.push(item);
    return 'deffered';
  };

  const init = async () => {
    await dbApiProxyRemote.init();
    isInitialized$.next(true);
  };

  const runCommand = async (command: string) =>
    dbApiProxyRemote.runCommand(command);

  const executeGetCommand = async (
    tableName: string,
    selectFields?: string[],
    conditions?: string[],
    conditionFields?: string[]
  ) =>
    dbApiProxyRemote.executeGetCommand(
      tableName,
      selectFields,
      conditions,
      conditionFields
    );

  const executePutCommand = async (tableName: string, array: DbEntity[]) =>
    executeOrEnqueue({
      tableName,
      data: array,
      isBatch: false,
      action: 'put',
    });

  const executeRmCommand = async (tableName: string, array: DbEntity[]) =>
    executeOrEnqueue({
      tableName,
      data: array,
      isBatch: false,
      action: 'rm',
    });

  const executeUpdateCommand = async (tableName: string, array: DbEntity[]) =>
    executeOrEnqueue({
      tableName,
      data: array,
      isBatch: false,
      action: 'update',
    });

  const executeBatchPutCommand = async (
    tableName: string,
    array: DbEntity[],
    batchSize: number,
    onProgress?: (count: number) => void
  ) =>
    executeOrEnqueue({
      tableName,
      data: array,
      batchSize,
      isBatch: true,
      action: 'put',
      onProgress,
    });

  const importRelations = async (content: string) =>
    dbApiProxyRemote.importRelations(content);

  const exportRelations = async (relations: string[]) =>
    dbApiProxyRemote.exportRelations(relations);

  return {
    init,
    executePutCommand,
    executeUpdateCommand,
    executeBatchPutCommand,
    executeRmCommand,
    runCommand,
    executeGetCommand,
    importRelations,
    exportRelations,
  };
}

export default dbServiceApi();

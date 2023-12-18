import { proxy, transferHandlers } from 'comlink';
import { BehaviorSubject, concatMap, filter, from } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { WorkerUrl } from 'worker-url';
import { DbEntity } from 'src/services/CozoDb/types/entities';

import { CozoDbWorker } from './worker';
import { createWorkerApi } from '../factoryMethods';
import { DbStackItem as DbQueueItem } from './types';

const workerUrl = new WorkerUrl(new URL('./worker.ts', import.meta.url));

const { workerApiProxy: dbApiWorkerProxy } = createWorkerApi<CozoDbWorker>(
  workerUrl,
  'cyb~cozodb'
);

function createDbWorkerService() {
  // accumulate here values while db is not initialized
  const queue$ = new BehaviorSubject<Map<uuidv4, DbQueueItem>>(new Map());

  const isInitialized$ = new BehaviorSubject(false);

  isInitialized$
    .pipe(
      filter((isInitialized) => isInitialized),
      concatMap(() => from(processQueue()))
    )
    .subscribe({
      next: () => console.log('DB Queue processed'),
      error: (err) => console.error('Error processing DB queue', err),
    });

  const processQueue = async () => {
    const queue = queue$.value;
    // eslint-disable-next-line no-restricted-syntax
    for (const [id, item] of queue) {
      console.log(
        `processing query item with cid: ${item.action} ${item.tableName}`
      );
      const { tableName, data, batchSize, onProgress, action } = item;
      if (action === 'put') {
        dbApiWorkerProxy.executePutCommand(tableName, data);
      }

      if (action === 'batch-put') {
        // single/batch mode
        // eslint-disable-next-line no-await-in-loop
        await dbApiWorkerProxy.executeBatchPutCommand(
          tableName,
          data,
          batchSize!,
          onProgress ? proxy(onProgress) : undefined
        );
      }

      if (action === 'update') {
        // eslint-disable-next-line no-await-in-loop
        await dbApiWorkerProxy.executeUpdateCommand(tableName, data);
      }
      if (action === 'rm') {
        // eslint-disable-next-line no-await-in-loop
        await dbApiWorkerProxy.executeRmCommand(tableName, data);
      }

      queue.delete(id);
    }

    queue$.next(queue);
  };

  const enqueueAction = async (
    action: DbQueueItem['action'],
    tableName: string,
    data: Partial<DbEntity>[],
    batchParams: {
      batchSize?: number;
      onProgress?: (count: number) => void;
    } = {}
  ) => {
    const queue = queue$.value;

    queue.set(uuidv4(), { action, tableName, data, ...(batchParams || {}) });
    queue$.next(queue);
    return 'deffered';
  };

  const init = async () => {
    await dbApiWorkerProxy.init();
    isInitialized$.next(true);
  };

  const runCommand = async (command: string) =>
    dbApiWorkerProxy.runCommand(command);

  const executeGetCommand = async (
    tableName: string,
    selectFields?: string[],
    conditions?: string[],
    conditionFields?: string[]
  ) =>
    dbApiWorkerProxy.executeGetCommand(
      tableName,
      selectFields,
      conditions,
      conditionFields
    );

  const executePutCommand = async (
    tableName: string,
    array: Partial<DbEntity>[]
  ) =>
    isInitialized$.getValue()
      ? dbApiWorkerProxy.executePutCommand(tableName, array)
      : enqueueAction('put', tableName, array);

  const executeRmCommand = async (
    tableName: string,
    array: Partial<DbEntity>[]
  ) =>
    isInitialized$.getValue()
      ? dbApiWorkerProxy.executeRmCommand(tableName, array)
      : enqueueAction('rm', tableName, array);

  const executeUpdateCommand = async (
    tableName: string,
    array: Partial<DbEntity>[]
  ) =>
    isInitialized$.getValue()
      ? dbApiWorkerProxy.executeUpdateCommand(tableName, array)
      : enqueueAction('update', tableName, array);

  const executeBatchPutCommand = async (
    tableName: string,
    array: Partial<DbEntity>[],
    batchSize?: number,
    onProgress?: (count: number) => void
  ) =>
    isInitialized$.getValue()
      ? dbApiWorkerProxy.executeBatchPutCommand(
          tableName,
          array,
          batchSize,
          onProgress ? proxy(onProgress) : undefined
        )
      : enqueueAction('batch-put', tableName, array, {
          batchSize,
          onProgress,
        });

  const importRelations = async (content: string) =>
    dbApiWorkerProxy.importRelations(content);

  const exportRelations = async (relations: string[]) =>
    dbApiWorkerProxy.exportRelations(relations);

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

const dbWorkerService = createDbWorkerService();

export type DbWorkerService = typeof dbWorkerService;

export default dbWorkerService;

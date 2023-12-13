import cozoDb from 'src/services/CozoDb/cozoDb';
import { exposeWorkerApi } from '../factoryMethods';
import { ServiceStatus } from '../../types';
import { DbEntity } from 'src/services/CozoDb/types';
import BroadcastChannelSender from '../../channels/BroadcastChannelSender';

const dbApiFactory = () => {
  let isInitialized = false;
  const channel = new BroadcastChannelSender();

  const postServiceStatus = (status: ServiceStatus) =>
    channel.postServiceStatus('db', status);

  const init = async () => {
    if (isInitialized) {
      console.log('Db: already initialized!');
      return;
    }
    postServiceStatus('starting');

    // callback to sync writes count worker -> main thread
    const onWriteCallback = (writesCount: number) =>
      channel.post({ type: 'indexeddb_write', value: writesCount });

    await cozoDb.init(onWriteCallback);
    isInitialized = true;
    postServiceStatus('started');
  };

  const runCommand = async (command: string) => cozoDb.runCommand(command);

  const executePutCommand = async (
    tableName: string,
    array: Partial<DbEntity>[]
  ) => cozoDb.put(tableName, array);

  const executeRmCommand = async (
    tableName: string,
    keyValues: Partial<DbEntity>[]
  ) => cozoDb.rm(tableName, keyValues);

  const executeUpdateCommand = async (
    tableName: string,
    array: Partial<DbEntity>[]
  ) => cozoDb.update(tableName, array);

  const executeGetCommand = async (
    tableName: string,
    selectFields?: string[],
    conditions?: string[],
    conditionFields?: string[]
  ) => cozoDb.get(tableName, conditions, selectFields, conditionFields);

  const importRelations = async (content: string) =>
    cozoDb.importRelations(content);

  const exportRelations = async (relations: string[]) =>
    cozoDb.exportRelations(relations);

  const executeBatchPutCommand = async (
    tableName: string,
    array: Partial<DbEntity>[],
    batchSize: number = array.length,
    onProgress?: (count: number) => void
  ) => {
    const { getCommandFactory, runCommand } = cozoDb;

    const commandFactory = getCommandFactory();
    const putCommand = commandFactory!.generateModifyCommand(tableName, 'put');
    let isOk = true;
    for (let i = 0; i < array.length; i += batchSize) {
      const batch = array.slice(i, i + batchSize);

      const atomCommand = commandFactory!.generateAtomCommand(tableName, batch);

      // eslint-disable-next-line no-await-in-loop
      const result = await runCommand([atomCommand, putCommand].join('\r\n'));
      if (!result.ok) {
        isOk = false;
      }

      onProgress && onProgress(i + batch.length);
    }
    return { ok: isOk };
  };

  return {
    init,
    runCommand,
    executeRmCommand,
    executePutCommand,
    executeBatchPutCommand,
    executeUpdateCommand,
    executeGetCommand,
    importRelations,
    exportRelations,
  };
};
const cozoDbWorkerApi = dbApiFactory();

export type CozoDbWorkerApi = typeof cozoDbWorkerApi;

// Expose the API to the main thread as shared/regular worker
exposeWorkerApi(self, cozoDbWorkerApi);

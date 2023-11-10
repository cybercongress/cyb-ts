import BcChannel from 'src/services/backend/channels/BroadcastChannel';
import cozoDb from 'src/services/CozoDb/cozoDb';
import { exposeWorker } from '../workerUtils';

const dbApiFactory = () => {
  console.log('----dbApi worker constructor!');
  const init = async () => {
    console.log('----dbApi worker init!');
    const channel = new BcChannel();

    // callback to sync writes count worker -> main thread
    const onWriteCallback = (writesCount: number) =>
      channel.post({ type: 'indexeddb_write', value: writesCount });

    await cozoDb.init(onWriteCallback);
  };

  const runCommand = async (command: string) => cozoDb.runCommand(command);

  const executePutCommand = async (tableName: string, array: any[]) =>
    cozoDb.put(tableName, array);

  const executeGetCommand = async (
    tableName: string,
    conditionArr?: string[],
    keys?: string[]
  ) => cozoDb.get(tableName, conditionArr, keys);

  const importRelations = async (content: string) =>
    cozoDb.importRelations(content);

  const exportRelations = async (relations: string[]) =>
    cozoDb.exportRelations(relations);

  const executeBatchPutCommand = async (
    tableName: string,
    array: any[],
    batchSize: number,
    onProgress?: (count: number) => void
  ) => {
    const { getCommandFactory, runCommand } = cozoDb;

    const commandFactory = getCommandFactory();
    const putCommand = commandFactory!.generatePutCommand(tableName);

    for (let i = 0; i < array.length; i += batchSize) {
      const batch = array.slice(i, i + batchSize);

      const atomCommand = commandFactory!.generateAtomCommand(tableName, batch);

      // eslint-disable-next-line no-await-in-loop
      await runCommand([atomCommand, putCommand].join('\r\n'));

      onProgress && onProgress(i + batch.length);
    }
  };

  return {
    init,
    runCommand,
    executePutCommand,
    executeBatchPutCommand,
    executeGetCommand,
    importRelations,
    exportRelations,
  };
};
const dbApi = dbApiFactory();

export type DbWorkerApi = typeof dbApi;

// Expose the API to the main thread as shared/regular worker
exposeWorker(self, dbApi);

import { expose } from 'comlink';
import BcChannel from 'src/services/backend/BroadcastChannel';

import cozoDb from './cozoDb';
import { importTransactions } from './importers/transactions';

const api = {
  async init() {
    const channel = new BcChannel();

    // callback to sync writes count worker -> main thread
    const onWriteCallback = (writesCount: number) =>
      channel.post({ type: 'indexeddb_write', value: writesCount });

    await cozoDb.init(onWriteCallback);
  },

  importTransactions: async (address: string, cyberIndexHttps: string) => {
    const res = await importTransactions(address, cyberIndexHttps);
    console.log('-----data', res);
  },

  runCommand: async (command: string) => cozoDb.runCommand(command),

  executePutCommand: async (tableName: string, array: any[]) =>
    cozoDb.put(tableName, array),

  executeGetCommand: async (
    tableName: string,
    conditionArr?: string[],
    keys?: string[]
  ) => cozoDb.get(tableName, conditionArr, keys),

  importRelations: async (content: string) => cozoDb.importRelations(content),

  exportRelations: async (relations: string[]) =>
    cozoDb.exportRelations(relations),

  async executeBatchPutCommand(
    tableName: string,
    array: any[],
    batchSize: number,
    onProgress?: (count: number) => void
  ) {
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
  },
};

export type DbWorkerApi = typeof api;

// Expose the API to the main thread
expose(api);

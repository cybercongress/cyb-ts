import { expose } from 'comlink';

import cozoDb from './cozoDb';

const api = {
  writesCount: 0,

  async init() {
    // callback to sync writes count worker -> main thread
    const onWriteCallback = (writesCount: number) => {
      this.writesCount = writesCount;
      postMessage({
        type: 'writesCountUpdate',
        value: writesCount,
      });
    };

    await cozoDb.init(onWriteCallback);
  },

  runCommand: async (command: string) => cozoDb.runCommand(command),

  executePutCommand: async (tableName: string, array: any[]) =>
    cozoDb.put(tableName, array),

  executeGetCommand: async (tableName: string, conditionArr: string[]) =>
    cozoDb.get(tableName, conditionArr),

  async executeBatchPutCommand(
    tableName: string,
    array: any[],
    batchSize: number,
    onProgress: (count: number) => void
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

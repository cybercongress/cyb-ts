import initCozoDb, { CozoDb } from 'cyb-cozo-lib-wasm';

import {
  IDBResult,
  Column,
  DBSchema,
  IDBResultError,
  TableSchema,
} from './types/types';
import { DbEntity, ConfigDbEntity } from './types/entities';

import { toListOfObjects, clearIndexedDBStore } from './utils';

import initializeScript from './migrations/schema.cozo';
import { CozoDbCommandFactory } from './CozoDbCommandFactory';

const DB_NAME = 'cyb-cozo-idb';
const DB_STORE_NAME = 'cozodb';
const DB_VERSION = '1.1';

type OnWrite = (writesCount: number) => void;

function createCozoDb() {
  let db: CozoDb | undefined;

  let dbSchema: DBSchema = {};
  let commandFactory: ReturnType<typeof CozoDbCommandFactory> | undefined;
  let onIndexedDbWrite: OnWrite | undefined;

  const loadCozoDb = async () => {
    db = await CozoDb.new_from_indexed_db(
      DB_NAME,
      DB_STORE_NAME,
      onIndexedDbWrite
    );
    await initDbSchema();
    commandFactory = CozoDbCommandFactory(dbSchema);
  };

  async function init(onWrite?: OnWrite): Promise<void> {
    onIndexedDbWrite = onWrite;
    await initCozoDb();
    await loadCozoDb();

    await migrate();
  }

  const getRelations = async (): Promise<string[]> => {
    const result = await runCommand('::relations');
    if (result.ok !== true) {
      throw new Error(result.message);
    }

    return result.rows.map((row) => row[0] as string);
  };

  const initDbSchema = async (): Promise<void> => {
    let relations = await getRelations();

    if (relations.length === 0) {
      console.log('CozoDb: apply DB schema', initializeScript);
      await runCommand(initializeScript);
      relations = await getRelations();
    }

    const schemasMap = await Promise.all(
      relations.map(async (table) => {
        const columnResult = await runCommand(`::columns ${table}`);
        if (!columnResult.ok) {
          throw new Error((columnResult as IDBResultError).message);
        }

        const fields = toListOfObjects<Column>(columnResult);
        const keys = fields.filter((c) => c.is_key).map((c) => c.column);
        const values = fields.filter((c) => !c.is_key).map((c) => c.column);

        // map -> column name: {...column props}
        const columns = fields.reduce((obj, field) => {
          obj[field.column] = field;
          return obj;
        }, {} as Record<string, Column>);

        // schema of the table, with some pre-calc
        const tableSchema: TableSchema = {
          keys,
          values,
          columns,
        };

        return [table, tableSchema];
      })
    );

    dbSchema = Object.fromEntries(schemasMap);
    console.log('CozoDb schema initialized: ', dbSchema);
  };

  const getVersion = async () => {
    const versionData = await get(
      'config',
      ['value'],
      ['key = "DB_VERSION"'],
      ['key']
    );
    if (versionData.ok === false) {
      throw new Error(versionData.message);
    }
    return (versionData.rows[0][0] as string) || DB_VERSION;
  };

  const migrate = async () => {
    if (!dbSchema.config) {
      console.log('💀 HARD RESET experemental db...');
      await clearIndexedDBStore(DB_NAME, DB_STORE_NAME);
      await loadCozoDb();
      await put('config', [
        {
          key: 'DB_VERSION',
          group_key: 'system',
          value: DB_VERSION,
        },
      ]);
    }
    // set initial version
    // await put('config', [
    //   {
    //     key: 'DB_VERSION',
    //     group_key: 'system',
    //     value: DB_VERSION,
    //   },
    // ]);
    // const version = await getVersion();
    // console.log(`DB Version ${version}`);
  };

  const runCommand = async (
    command: string,
    immutable = false
  ): Promise<IDBResult | IDBResultError> => {
    if (!db) {
      throw new Error('DB is not initialized');
    }
    const resultStr = await db.run(command, '', immutable);
    const result = JSON.parse(resultStr);
    // console.log('----> runCommand ', command, result);

    return result;
  };

  const put = async (
    tableName: string,
    array: Partial<DbEntity>[]
  ): Promise<IDBResult | IDBResultError> =>
    runCommand(commandFactory!.generatePut(tableName, array));

  const rm = async (
    tableName: string,
    keyValues: Partial<DbEntity>[]
  ): Promise<IDBResult | IDBResultError> =>
    runCommand(commandFactory!.generateRm(tableName, keyValues));

  const update = async (
    tableName: string,
    array: Partial<DbEntity>[]
  ): Promise<IDBResult | IDBResultError> =>
    runCommand(commandFactory!.generateUpdate(tableName, array));

  const get = async (
    tableName: string,
    selectFields: string[] = [],
    conditions: string[] = [],
    conditionFields: string[] = []
  ): Promise<IDBResult | IDBResultError> =>
    runCommand(
      commandFactory!.generateGet(
        tableName,
        conditions,
        selectFields,
        conditionFields
      ),
      true
    );

  const importRelations = (content: string) =>
    JSON.parse(db!.import_relations(content));

  const exportRelations = (relations: string[]) =>
    JSON.parse(db!.export_relations(JSON.stringify({ relations })));

  return {
    init,
    put,
    get,
    rm,
    update,
    runCommand,
    getCommandFactory: () => commandFactory,
    importRelations,
    exportRelations,
  };
}

export default createCozoDb();

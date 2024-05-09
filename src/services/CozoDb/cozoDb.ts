import initCozoDb, { CozoDb } from 'cyb-cozo-lib-wasm';
import { createCyblogChannel } from 'src/utils/logging/cyblog';

import {
  IDBResult,
  Column,
  DBSchema,
  TableSchema,
  GetCommandOptions,
  DBResultError,
} from './types/types';
import { DbEntity } from './types/entities';

import { clearIndexedDBStore, toListOfObjects } from './utils';

import { createCozoDbCommandFactory } from './cozoDbCommandFactory';

import initializeScript from './migrations/schema.cozo';

export const DB_NAME = 'cyb-cozo-idb';

const DB_STORE_NAME = 'cozodb';
const DB_VERSION = '1.1';

type OnWrite = (writesCount: number) => void;

function createCozoDb() {
  let db: CozoDb | undefined;

  let dbSchema: DBSchema = {};
  let commandFactory: ReturnType<typeof createCozoDbCommandFactory> | undefined;
  let onIndexedDbWrite: OnWrite | undefined;

  const cyblogCh = createCyblogChannel({ thread: 'cozo' });

  const loadCozoDb = async () => {
    db = await CozoDb.new_from_indexed_db(
      DB_NAME,
      DB_STORE_NAME,
      onIndexedDbWrite
    );
    await initDbSchema();
    commandFactory = createCozoDbCommandFactory(dbSchema);
  };

  async function init(onWrite?: OnWrite): Promise<void> {
    onIndexedDbWrite = onWrite;
    await initCozoDb();
    await loadCozoDb();

    await migrate();
  }

  const getRelations = async (): Promise<string[]> => {
    const result = await runCommand('::relations');

    return result.rows.map((row) => row[0] as string);
  };

  const createSchema = async (tableName: string) => {
    const columnResult = await runCommand(`::columns ${tableName}`);

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
    return tableSchema;
  };

  const initDbSchema = async (): Promise<void> => {
    let relations = await getRelations();

    if (relations.length === 0) {
      cyblogCh.info('CozoDb: apply DB schema', initializeScript);
      const result = await runCommand(initializeScript);

      relations = await getRelations();
    }

    const schemasMap = await Promise.all(
      relations.map(async (table) => {
        const tableSchema = await createSchema(table);
        return [table, tableSchema];
      })
    );

    dbSchema = Object.fromEntries(schemasMap);
    cyblogCh.info('CozoDb schema initialized: ', {
      data: [dbSchema, relations, schemasMap],
    });
  };

  const getVersion = async () => {
    const versionData = await get(
      'config',
      ['value'],
      ['key = "DB_VERSION"'],
      ['key']
    );

    return (versionData.rows[0][0] as string) || DB_VERSION;
  };

  const migrate = async () => {
    // if (!dbSchema.community) {
    //   const result = await runCommand(communityScript);
    //   console.log('CozoDb >>> migration: creating community relation....');
    //   dbSchema.community = await createSchema('community');
    // }

    if (!dbSchema.transaction.values.includes('block_height')) {
      cyblogCh.info('💀 HARD RESET experemental db...');
      await clearIndexedDBStore(DB_NAME, DB_STORE_NAME);
      await init(onIndexedDbWrite);
      await put('config', [
        {
          key: 'DB_VERSION',
          group_key: 'system',
          value: DB_VERSION,
        },
      ]);
    }
    // const version = await getVersion();
    // console.log(`DB Version ${version}`);
  };

  const runCommand = async (
    command: string,
    immutable = false
  ): Promise<IDBResult> => {
    if (!db) {
      throw new Error('DB is not initialized');
    }
    const resultStr = await db.run(command, '', immutable);
    const result = JSON.parse(resultStr);
    // console.log('----> runCommand ', command, result);

    if (!result.ok) {
      console.log('----> runCommand error ', command, result);
      throw new DBResultError(result);
    }

    return result;
  };

  const put = async (
    tableName: string,
    array: Partial<DbEntity>[]
  ): Promise<IDBResult> =>
    runCommand(commandFactory!.generatePut(tableName, array));

  const rm = async (
    tableName: string,
    keyValues: Partial<DbEntity>[]
  ): Promise<IDBResult> =>
    runCommand(commandFactory!.generateRm(tableName, keyValues));

  const update = async (
    tableName: string,
    array: Partial<DbEntity>[]
  ): Promise<IDBResult> =>
    runCommand(commandFactory!.generateUpdate(tableName, array));

  const get = async (
    tableName: string,
    selectFields: string[] = [],
    conditions: string[] = [],
    conditionFields: string[] = [],
    options: GetCommandOptions = {}
  ): Promise<IDBResult> =>
    runCommand(
      commandFactory!.generateGet(
        tableName,
        conditions,
        selectFields,
        conditionFields,
        options
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

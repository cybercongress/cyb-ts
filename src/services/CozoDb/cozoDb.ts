import initCozoDb, { CozoDb } from 'cyb-cozo-lib-wasm';

import {
  IDBResult,
  Column,
  DBSchema,
  IDBResultError,
  TableSchema,
  DbEntity,
  ConfigDbEntity,
} from './types';

import { toListOfObjects, entityToArray, resetIndexedDBStore } from './utils';

import initializeScript from './migrations/schema.cozo';

const DB_NAME = 'cyb-cozo-idb';
const DB_STORE_NAME = 'cozodb';
const DB_VERSION = '1.1';

function CozoDbCommandFactory(dbSchema: DBSchema) {
  const schema = dbSchema;

  const generateRmCommand = (tableName: string, keys: string[]): string => {
    return `:rm ${tableName} {${keys}}`;
  };

  const generateModifyCommand = (
    tableName: string,
    command: 'put' | 'update' = 'put',
    fieldNames: string[] = []
  ): string => {
    const { keys, values } = schema[tableName];
    const hasValues = values.length > 0;

    const actualValues =
      fieldNames.length > 0
        ? fieldNames.filter((f) => values.includes(f))
        : values;

    return !hasValues
      ? `:${command} ${tableName} {${keys}}`
      : `:${command} ${tableName} {${keys} => ${actualValues}}`;
  };

  const generateAtomCommand = (
    tableName: string,
    items: Partial<DbEntity>[],
    fieldNames: string[] = []
  ): string => {
    const tableSchema = dbSchema[tableName];

    const selectedColumns =
      fieldNames.length > 0
        ? Object.keys(tableSchema.columns).reduce((acc, key) => {
            if (fieldNames.includes(key)) {
              acc[key] = tableSchema.columns[key];
            }
            return acc;
          }, {} as Record<string, Column>)
        : tableSchema.columns;

    const colKeys = Object.keys(selectedColumns);
    const colValues = Object.values(selectedColumns) as Column[];

    return `?[${colKeys.join(', ')}] <- [${items
      .map((item) => entityToArray(item, colValues))
      .join(', ')}]`;
  };

  const generatePut = (tableName: string, array: Partial<DbEntity>[]) => {
    const fields = Object.keys(array[0]);
    const atomCommand = generateAtomCommand(tableName, array, fields);
    const putCommand = generateModifyCommand(tableName, 'put');
    return `${atomCommand}\r\n${putCommand}`;
  };

  const generateRm = (tableName: string, keyValues: Partial<DbEntity>[]) => {
    const { keys } = schema[tableName];

    const atomCommand = generateAtomCommand(tableName, keyValues, keys);
    const rmCommand = generateRmCommand(tableName, keys);
    return `${atomCommand}\r\n${rmCommand}`;
  };

  const generateUpdate = (tableName: string, array: Partial<DbEntity>[]) => {
    // align fields by first entity
    const fields = Object.keys(array[0]);
    const atomCommand = generateAtomCommand(tableName, array, fields);
    const updateCommand = generateModifyCommand(tableName, 'update', fields);
    return `${atomCommand}\r\n${updateCommand}`;
  };

  const generateGet = (
    tableName: string,
    selectFields: string[] = [],
    conditions: string[] = [],
    conditionFields: string[] = []
  ) => {
    const tableSchema = dbSchema[tableName];

    const queryFields =
      selectFields.length > 0 ? selectFields : Object.keys(tableSchema.columns);

    const requiredFields = [...queryFields, ...conditionFields];

    const conditionsStr =
      conditions.length > 0 ? `, ${conditions.join(', ')} ` : '';

    return `?[${queryFields.join(', ')}] := *${tableName}{${requiredFields.join(
      ', '
    )}} ${conditionsStr}`;
  };

  return {
    generateModifyCommand,
    generateAtomCommand,
    generatePut,
    generateGet,
    generateUpdate,
    generateRm,
  };
}

function createCozoDb() {
  let db: CozoDb | undefined;

  let dbSchema: DBSchema = {};
  let commandFactory: ReturnType<typeof CozoDbCommandFactory> | undefined;

  async function init(
    onWrite?: (writesCount: number) => void
  ): Promise<CozoDb> {
    await initCozoDb();

    db = await CozoDb.new_from_indexed_db(DB_NAME, DB_STORE_NAME, onWrite);
    dbSchema = await initDbSchema();
    commandFactory = CozoDbCommandFactory(dbSchema);

    console.log('CozoDb schema initialized: ', dbSchema);
    return db;
  }

  const getRelations = async (): Promise<string[]> => {
    const result = await runCommand('::relations');
    if (result.ok !== true) {
      throw new Error(result.message);
    }

    return result.rows.map((row) => row[0] as string);
  };

  const initDbSchema = async (): Promise<DBSchema> => {
    const relations = await migrate();
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

    return Object.fromEntries(schemasMap);
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
    return (versionData.rows[0][0] as string) || undefined;
  };

  const migrate = async () => {
    let relations = await getRelations();
    if (relations.length === 0) {
      console.log('CozoDb: apply DB schema', initializeScript);
      runCommand(initializeScript);

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

      relations = await getRelations();
    }

    return relations;
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

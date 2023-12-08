import initCozoDb, { CozoDb } from 'cyb-cozo-lib-wasm';

import initializeScript from './migrations/schema.cozo';
import {
  IDBResult,
  Column,
  DBSchema,
  IDBResultError,
  TableSchema,
} from './types';

import { toListOfObjects, mapObjectToArray } from './utils';

const DB_NAME = 'cozo-idb-demo';
const DB_STORE_NAME = 'cozodb';

function CozoDbCommandFactory(dbSchema: DBSchema) {
  const schema = dbSchema;

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
    items: any[],
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
          }, {} as Partial<Record<string, Column>>)
        : tableSchema.columns;

    const colKeys = Object.keys(selectedColumns);
    const colValues = Object.values(selectedColumns) as Column[];

    return `?[${colKeys.join(', ')}] <- [${items
      .map((item) => mapObjectToArray(item, colValues))
      .join(', ')}]`;
  };

  const generatePut = (tableName: string, array: any[][]) => {
    const atomCommand = generateAtomCommand(tableName, array);
    const putCommand = generateModifyCommand(tableName, 'put');
    return `${atomCommand}\r\n${putCommand}`;
  };

  const generateUpdate = (
    tableName: string,
    array: any[][],
    fileds: string[]
  ) => {
    const atomCommand = generateAtomCommand(tableName, array, fileds);
    const updateCommand = generateModifyCommand(tableName, 'update', fileds);
    return `${atomCommand}\r\n${updateCommand}`;
  };

  const generateGet = (
    tableName: string,
    conditionArr: string[] = [],
    selectFields: string[] = [],
    useFields: string[] = []
  ) => {
    const conditionsStr =
      conditionArr.length > 0 ? `, ${conditionArr.join(', ')} ` : '';
    const tableSchema = dbSchema[tableName];
    const queryFields =
      selectFields.length > 0 ? selectFields : Object.keys(tableSchema.columns);
    const useQueryFields = useFields.length > 0 ? useFields : queryFields;
    return `?[${queryFields.join(', ')}] := *${tableName}{${useQueryFields.join(
      ', '
    )}} ${conditionsStr}`;
  };

  return {
    generateModifyCommand,
    generateAtomCommand,
    generatePut,
    generateGet,
    generateUpdate,
  };
}

function DbService() {
  let db: CozoDb | undefined;

  let dbSchema: DBSchema = {};
  let commandFactory: ReturnType<typeof CozoDbCommandFactory> | undefined;

  async function init(
    onWrite?: (writesCount: number) => void
  ): Promise<CozoDb> {
    // if (db) {
    //   return db;
    // }

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
    let relations = await getRelations();

    if (relations.length === 0) {
      console.log('CozoDb: apply DB schema', initializeScript);
      runCommand(initializeScript);
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

    return Object.fromEntries(schemasMap);
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
    console.log('----> runCommand ', command, result);

    return result;
  };

  const put = async (
    tableName: string,
    array: any[][]
  ): Promise<IDBResult | IDBResultError> =>
    runCommand(commandFactory!.generatePut(tableName, array));

  const update = async (
    tableName: string,
    array: any[][],
    fieldNames: string[]
  ): Promise<IDBResult | IDBResultError> =>
    runCommand(commandFactory!.generateUpdate(tableName, array, fieldNames));

  const get = (
    tableName: string,
    conditionArr: string[] = [],
    selectFields: string[] = [],
    useFields: string[] = []
  ): Promise<IDBResult | IDBResultError> =>
    runCommand(
      commandFactory!.generateGet(
        tableName,
        conditionArr,
        selectFields,
        useFields
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
    update,
    runCommand,
    getCommandFactory: () => commandFactory,
    importRelations,
    exportRelations,
  };
}

export default DbService();

import initCozoDb, { CozoDb } from 'cyb-cozo-lib-wasm';
import initializeScript from './migrations/schema.cozo';
import { type } from 'ramda';
let db: CozoDb | undefined;

interface Column {
  column: string;
  type: 'String' | 'Int' | 'Bool';
  is_key?: boolean;
  index: number;
  is_default: boolean;
}

interface TableSchema {
  keys: string[];
  values: string[];
  columns: Record<string, Column>;
}

type DBValue = string | number | boolean;

interface DBResult {
  headers: string[];
  rows: Array<Array<DBValue>>;
  ok: true;
}

interface DBResultError {
  code: string;
  display: string;
  message: string;
  severity: string;
  ok: false;
}

interface DBResultWithColIndex extends DBResult {
  index: Record<string, number>;
}

function DbService() {
  let dbSchema: Record<string, TableSchema> = {};

  async function init(): Promise<CozoDb> {
    if (db) {
      return db;
    }

    await initCozoDb();
    db = await CozoDb.new_from_indexed_db('cozo-idb', 'cyb-cozo');

    dbSchema = initDbSchema();
    console.log('CozoDb schema: ', dbSchema);

    return db;
  }
  const getRelations = (): string[] => {
    const result = runCommand('::relations');
    if (!result.ok) {
      throw new Error(result.message);
    }

    return result.rows.map((row) => row[0] as string);
  };

  const initDbSchema = (): Record<string, TableSchema> => {
    let relations = getRelations();

    if (relations.length === 0) {
      console.log('CozoDb:  create schema');
      runCommand(initializeScript);
      relations = getRelations();
    }

    const schemas: Record<string, TableSchema> = Object.fromEntries(
      relations.map((table) => {
        const columnResult = runCommand(`::columns ${table}`);
        if (!columnResult.ok) {
          throw new Error(columnResult.message);
        }

        const fields: Column[] = mapResultToList<Column>(
          columnResult
        ) as Column[];
        const keys = fields.filter((c) => c.is_key).map((c) => c.column);
        const values = fields.filter((c) => !c.is_key).map((c) => c.column);
        const tableSchema: TableSchema = {
          keys,
          values,
          columns: fields.reduce((obj, field) => {
            obj[field.column] = field;
            return obj;
          }, {} as Record<string, Column>),
        };
        return [table, tableSchema];
      })
    );

    return schemas;
  };

  const generatePutCommand = (tableName: string): string => {
    const { keys, values } = dbSchema[tableName];
    const hasValues = values.length > 0;

    return !hasValues
      ? `:put ${tableName} {${keys}}`
      : `:put ${tableName} {${keys} => ${values}}`;
  };

  const mapResultToList = <T extends Record<string, any>>(
    result: DBResult
  ): T[] => {
    const { headers } = result;
    return result.rows.map((row) => {
      const obj: Partial<T> = {};
      row.forEach((value, index) => {
        const key = headers[index];
        obj[key] = value;
      });
      return obj as T;
    });
  };

  const applyColIndex = (result: DBResult): DBResultWithColIndex => {
    const index = result.headers.reduce((acc, column, index) => {
      acc[column] = index;
      return acc;
    }, {} as Record<string, number>);

    return { ...result, index };
  };

  const runCommand = (
    command: string,
    immutable = false
  ): DBResult | DBResultError => {
    if (!db) {
      throw new Error('DB is not initialized');
    }
    const resultStr = db.run(command, '', immutable);
    const result: DBResult = JSON.parse(resultStr);
    console.log('----runCommand: ', command, result);

    return result;
  };

  const mapObjectToArray = (
    obj: Record<string, DBValue>,
    columns: Column[]
  ): string => {
    return `[${columns
      .map((col) =>
        col.type === 'String' ? `"${obj[col.column]}"` : obj[col.column]
      )
      .join(', ')}]`;
  };

  const generateAtomCommand = (tableName: string, items: any[]): string => {
    const tableSchema = dbSchema[tableName];
    const colKeys = Object.keys(tableSchema.columns);
    const colValues = Object.values(tableSchema.columns);
    return `?[${colKeys.join(', ')}] <- [${items
      .map((item) => mapObjectToArray(item, colValues))
      .join(', ')}]`;
  };

  const executePutCommand = async (
    tableName: string,
    array: any[]
  ): Promise<void> => {
    const atomCommand = generateAtomCommand(tableName, array);
    const putCommand = generatePutCommand(tableName);
    const command = `${atomCommand}\r\n${putCommand}`;
    runCommand(command);
    await CozoDb.wait_for_indexed_db_writes();
  };

  const executeBatchPutCommand = async (
    tableName: string,
    array: any[],
    batchSize = 10,
    onProgress?: (count: number) => void
  ): Promise<void> => {
    const putCommand = generatePutCommand(tableName);

    for (let i = 0; i < array.length; i += batchSize) {
      const batch = array.slice(i, i + batchSize);
      const atomCommand = generateAtomCommand(tableName, batch);
      const command = `${atomCommand}\r\n${putCommand}`;
      runCommand(command);

      // hack to avoid long pool of indexeddb writes,
      // block put call until previous batch is written
      // eslint-disable-next-line no-await-in-loop
      await CozoDb.wait_for_indexed_db_writes();
      onProgress && onProgress(i + batch.length);
    }
  };

  const executeGetCommand = (
    tableName: string,
    conditionArr: string[] = [],
    keys: string[] = []
  ): DBResultWithColIndex | DBResultError => {
    const conditionsStr =
      conditionArr.length > 0 ? `, ${conditionArr.join(', ')} ` : '';
    const tableSchema = dbSchema[tableName];
    const queryKeys = keys.length > 0 ? keys : Object.keys(tableSchema.columns);
    const getCommmand = `?[${queryKeys.join(
      ', '
    )}] := *${tableName}{${queryKeys.join(', ')}} ${conditionsStr}`;
    const result = runCommand(getCommmand, true);
    return result.ok ? applyColIndex(result) : result;
  };

  return {
    init,
    executePutCommand,
    executeGetCommand,
    executeBatchPutCommand,
    runCommand,
  };
}

export type { DBResult, DBResultError, DBResultWithColIndex };

export default DbService();

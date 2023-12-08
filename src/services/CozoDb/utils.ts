// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  IDBResult,
  DBSchema,
  DBResultWithColIndex,
  DBValue,
  Column,
} from './types';

export function withColIndex(result: IDBResult): DBResultWithColIndex {
  const index = result.headers.reduce((acc, column, index) => {
    acc[column] = index;
    return acc;
  }, {} as Record<string, number>);

  return { ...result, index };
}

export const toListOfObjects = <T extends Record<string, any>>({
  rows,
  headers,
}: IDBResult): T[] => {
  return rows.map((row) => {
    const obj: Partial<T> = {};
    row.forEach((value, index) => {
      const key = headers[index];
      obj[key] = value;
    });
    return obj as T;
  });
};

export const mapObjectToArray = (
  obj: Record<string, DBValue>,
  columns: Column[]
): string => {
  return `[${columns
    .map((col) =>
      col.type === 'Json'
        ? `'${JSON.stringify(obj[col.column])}'`
        : col.type === 'String'
        ? `"${obj[col.column]}"`
        : obj[col.column]
    )
    .join(', ')}]`;
};

export const snakeToCamel = (str: string) =>
  str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );

export const camelToSnake = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const dbResultToObjects = (
  dbResult: IDBResult,
  tableName: string,
  dbSchema: DBSchema
) => {
  const { headers, rows } = dbResult;

  const camelCaseHeadersMap = headers.reduce((acc, header) => {
    acc[header] = snakeToCamel(header);
    return acc;
  }, {});

  return rows.map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      // const camelCaseHeader = snakeToCamel(header);
      obj[camelCaseHeadersMap[header]] = row[index];
    });
    return obj;
  });
};

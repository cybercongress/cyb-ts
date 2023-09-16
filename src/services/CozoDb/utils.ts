// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IDBResult, DBResultWithColIndex, DBValue, Column } from './cozoDb.d';

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
      col.type === 'String' ? `"${obj[col.column]}"` : obj[col.column]
    )
    .join(', ')}]`;
};

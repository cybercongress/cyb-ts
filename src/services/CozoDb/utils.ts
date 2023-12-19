// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  IDBResult,
  DBSchema,
  DBResultWithColIndex,
  DBValue,
  Column,
  IDBResultError,
} from './types/types';
import { DbEntity } from './types/entities';

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

export const entityToArray = (
  obj: Partial<DbEntity>,
  columns: Column[]
): string => {
  return `[${columns
    .map((col) => {
      const key = col.column as keyof DbEntity;
      const value = obj[key];
      return col.type === 'Json'
        ? `'${JSON.stringify(value)}'`
        : col.type === 'String'
        ? `"${value}"`
        : value;
    })
    .join(', ')}]`;
};

export const snakeToCamel = (str: string) =>
  str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );

export const camelToSnake = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

// Function to transform a DB entity to a DTO
export function transformToDto<T extends Record<string, any>>(
  dbEntity: T
): DbEntityToDto<T> {
  const dto: any = {};
  for (const key in dbEntity) {
    const camelCaseKey = snakeToCamel(key);
    dto[camelCaseKey] = dbEntity[key];
  }
  return dto as DbEntityToDto<T>;
}

export function transformToDbEntity<T extends Record<string, any>>(
  dto: T
): Partial<T> {
  // Replace T with the appropriate DB Entity type if known
  const dbEntity: any = {};
  for (const key in dto) {
    const snakeCaseKey = camelToSnake(key);
    dbEntity[snakeCaseKey] = dto[key];
  }
  return dbEntity as Partial<T>; // Replace T with the appropriate DB Entity type if known
}

export function transformListToDbEntity<T extends Record<string, any>>(
  array: T[]
): T[] {
  return array.map((dto) => transformToDbEntity(dto)) as Partial<T>[];
}

export function removeUndefinedFields(entity: Record<string, any>) {
  Object.keys(entity).forEach((key) => {
    if (entity[key] === undefined) {
      delete entity[key];
    }
  });
  return entity;
}

export const dbResultToDtoList = (dbResult: IDBResult | IDBResultError) => {
  if (!dbResult.ok) {
    throw new Error(`Can't parse DBResult: ${dbResult.message}`);
  }
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

export async function clearIndexedDBStore(
  dbName: string,
  storeName: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Open a connection to the database
    const request = indexedDB.open(dbName);

    request.onerror = (event) => {
      reject(`Database error: ${request.error?.message}`);
    };

    request.onsuccess = (event) => {
      const db = request.result;

      // Start a transaction and get the store
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      // Clear the store
      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        console.log(`Store cleared ${dbName}/${storeName}`);
        resolve();
      };

      clearRequest.onerror = () => {
        reject(`Error clearing the store: ${clearRequest.error?.message}`);
      };

      // Close the database when the transaction is complete
      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
}

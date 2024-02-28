/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unused-modules */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IDBResult, DBResultWithColIndex, Column } from './types/types';
import { DbEntity } from './types/entities';
import { DbEntityToDto, DtoToDbEntity } from './types/dto';

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
    const obj: Record<string, any> = {};
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
        ? `parse_json('${JSON.stringify(value)}')`
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
  const dto: Record<string, any> = {}; // Specify the type for dto
  Object.keys(dbEntity).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(dbEntity, key)) {
      const camelCaseKey = snakeToCamel(key);
      dto[camelCaseKey] = dbEntity[key];
    }
  });
  return dto as DbEntityToDto<T>;
}

export function transformToDbEntity<T extends Record<string, any>>(
  dto: T
): DtoToDbEntity<T> {
  // in case of recursive calls
  if (!dto || typeof dto !== 'object') {
    return dto;
  }
  // Replace T with the appropriate DB Entity type if known
  const dbEntity: any = {};

  Object.keys(dto).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(dto, key)) {
      const snakeCaseKey = camelToSnake(key);
      let value = dto[key];
      if (Array.isArray(dto[key])) {
        value = dto[key].map((item) => transformToDbEntity(item));
      } else if (typeof dto[key] === 'object') {
        value = transformToDbEntity(dto[key]);
      }
      dbEntity[snakeCaseKey] = value;
    }
  });
  return dbEntity as DtoToDbEntity<T>; // Replace T with the appropriate DB Entity type if known
}

export function transformListToDbEntity<T extends Record<string, any>>(
  array: T[]
): DtoToDbEntity<T>[] {
  return array.map((dto) => transformToDbEntity(dto));
}

export function transformListToDto<T extends Record<string, any>>(
  array: T[]
): DbEntityToDto<T>[] {
  return array.map((dto) => transformToDto(dto));
}

export function removeUndefinedFields(entity: Record<string, any>) {
  Object.keys(entity).forEach((key) => {
    if (entity[key] === undefined) {
      delete entity[key];
    }
  });
  return entity;
}

export function dbResultToDtoList<T>(dbResult: IDBResult): T[] {
  const { headers, rows } = dbResult;

  const camelCaseHeadersMap = headers.reduce(
    (acc: Record<string, any>, header) => {
      acc[header] = snakeToCamel(header);
      return acc;
    },
    {}
  );

  return rows.map((row) => {
    const obj: Record<string, any> = {};
    headers.forEach((header, index) => {
      obj[camelCaseHeadersMap[header]] = row[index];
    });
    return obj as T;
  });
}

export function jsonifyFields(obj: Record<string, any>, fields: string[]) {
  Object.keys(obj).forEach((k) => {
    if (fields.includes(k)) {
      if (obj[k]) {
        try {
          obj[k] = JSON.parse(obj[k]);
        } catch {
          // ???
        }
      }
    }
  });
  return obj;
}

export async function clearIndexedDBStore(
  dbName: string,
  storeName: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Open a connection to the database
    const request = indexedDB.open(dbName);

    request.onerror = (event) => {
      reject(new Error(`Database error: ${request.error?.message}`));
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
        reject(
          new Error(`Error clearing the store: ${clearRequest.error?.message}`)
        );
      };

      // Close the database when the transaction is complete
      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
}

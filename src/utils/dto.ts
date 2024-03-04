import { EntityToDto, DtoToEntity } from 'src/types/dto';

export const snakeToCamel = (str: string) =>
  str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );

export const camelToSnake = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
// Function to transform a DB entity to a DTO

// eslint-disable-next-line import/no-unused-modules
export function entityToDto<T extends Record<string, any>>(
  dbEntity: T
): EntityToDto<T> {
  if (!dbEntity || typeof dbEntity !== 'object') {
    return dbEntity;
  }
  const dto: Record<string, any> = {}; // Specify the type for dto
  Object.keys(dbEntity).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(dbEntity, key)) {
      const camelCaseKey = snakeToCamel(key);
      let value = dbEntity[key];
      if (Array.isArray(dbEntity[key])) {
        value = dbEntity[key].map((item) => entityToDto(item));
      } else if (typeof dbEntity[key] === 'object') {
        value = entityToDto(dbEntity[key]);
      }
      dto[camelCaseKey] = value;
    }
  });
  return dto as EntityToDto<T>;
}

// eslint-disable-next-line import/no-unused-modules
export function dtoToEntity<T extends Record<string, any>>(
  dto: T
): DtoToEntity<T> {
  // in case of recursive calls
  if (!dto || typeof dto !== 'object') {
    return dto;
  }
  const dbEntity: any = {};

  Object.keys(dto).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(dto, key)) {
      const snakeCaseKey = camelToSnake(key);
      let value = dto[key];
      if (Array.isArray(dto[key])) {
        value = dto[key].map((item) => dtoToEntity(item));
      } else if (typeof dto[key] === 'object') {
        value = dtoToEntity(dto[key]);
      }
      dbEntity[snakeCaseKey] = value;
    }
  });
  return dbEntity as DtoToEntity<T>; // Replace T with the appropriate DB Entity type if known
}

export function dtoListToEntity<T extends Record<string, any>>(
  array: T[]
): DtoToEntity<T>[] {
  return array.map((dto) => dtoToEntity(dto));
}

export function entityListToDto<T extends Record<string, any>>(
  array: T[]
): EntityToDto<T>[] {
  return array.map((dto) => entityToDto(dto));
}

export function removeUndefinedFields(entity: Record<string, any>) {
  Object.keys(entity).forEach((key) => {
    if (entity[key] === undefined) {
      delete entity[key];
    }
  });
  return entity;
}

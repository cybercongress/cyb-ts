import {
  PinDbEntity,
  SyncStatusDbEntity,
  TransactionDbEntity,
  ParticleDbEntity,
  ConfigDbEntity,
  LinkDbEntity,
  SyncQueueDbEntity,
  CommunityDbEntity,
} from './entities';

// Utility type to capitalize the first letter of a string
type Capitalize<S extends string> = S extends `${infer T}${infer U}`
  ? `${Uppercase<T>}${U}`
  : S;

// Utility type to convert snake_case to camelCase
type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

// Generic type transformer to convert DB entity type to DTO type
export type DbEntityToDto<T> = {
  [P in keyof T as P extends string ? SnakeToCamelCase<P> : never]: T[P];
};

type CamelCaseToSnake<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? `_${Lowercase<T>}` : T}${CamelCaseToSnake<U>}`
  : S;

export type DtoToDbEntity<T> = {
  [P in keyof T as P extends string ? CamelCaseToSnake<P> : never]: T[P];
};

export type PinDto = DbEntityToDto<PinDbEntity>;
export type SyncStatusDto = DbEntityToDto<SyncStatusDbEntity>;
export type TransactionDto = DbEntityToDto<TransactionDbEntity>;
export type ParticleDto = DbEntityToDto<ParticleDbEntity>;
export type ConfigDto = DbEntityToDto<ConfigDbEntity>;
export type LinkDto = DbEntityToDto<LinkDbEntity>;
export type SyncQueueDto = DbEntityToDto<SyncQueueDbEntity>;
export type CommunityDto = DbEntityToDto<CommunityDbEntity>;

import { EntityToDto } from 'src/types/dto';
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

export type PinDto = EntityToDto<PinDbEntity>;
export type SyncStatusDto = EntityToDto<SyncStatusDbEntity>;
export type TransactionDto = EntityToDto<TransactionDbEntity>;
export type ParticleDto = EntityToDto<ParticleDbEntity>;
export type ConfigDto = EntityToDto<ConfigDbEntity>;
export type LinkDto = EntityToDto<LinkDbEntity>;
export type SyncQueueDto = EntityToDto<SyncQueueDbEntity>;
export type CommunityDto = EntityToDto<CommunityDbEntity>;

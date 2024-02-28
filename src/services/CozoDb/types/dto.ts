import { DbEntityToDto } from 'src/types/dto';
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

export type PinDto = DbEntityToDto<PinDbEntity>;
export type SyncStatusDto = DbEntityToDto<SyncStatusDbEntity>;
export type TransactionDto = DbEntityToDto<TransactionDbEntity>;
export type ParticleDto = DbEntityToDto<ParticleDbEntity>;
export type ConfigDto = DbEntityToDto<ConfigDbEntity>;
export type LinkDto = DbEntityToDto<LinkDbEntity>;
export type SyncQueueDto = DbEntityToDto<SyncQueueDbEntity>;
export type CommunityDto = DbEntityToDto<CommunityDbEntity>;

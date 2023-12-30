import { SyncQueueDto } from 'src/services/CozoDb/types/dto';
import {
  EnqueuedIpfsResult,
  QueuePriority,
} from 'src/services/QueueManager/types';
import { NeuronAddress, ParticleCid } from 'src/types/base';

export type SyncServiceParams = {
  myAddress: NeuronAddress | null;
  followings: NeuronAddress[];
  cyberIndexUrl?: string;
};

export type FetchIpfsFunc = (
  cid: ParticleCid,
  priority: QueuePriority
) => Promise<EnqueuedIpfsResult>;

export type ParticleResult = {
  timestamp: number;
  direction: 'from' | 'to';
  from: ParticleCid;
  to: ParticleCid;
};

export type SyncQueueItem = Omit<SyncQueueDto, 'status'>;

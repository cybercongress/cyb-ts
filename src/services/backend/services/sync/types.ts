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

export type LinkDirection = 'from' | 'to';

export type LinkResult = {
  timestamp: number;
  direction: LinkDirection;
  from: ParticleCid;
  to: ParticleCid;
};

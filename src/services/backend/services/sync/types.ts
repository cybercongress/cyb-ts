import {
  QueueItemAsyncResult,
  QueuePriority,
} from 'src/services/QueueManager/types';
import { NeuronAddress, ParticleCid } from 'src/types/base';

export type SyncServiceParams = {
  myAddress: NeuronAddress | null;
  followings: NeuronAddress[];
};

export type FetchIpfsFunc = (
  cid: ParticleCid,
  priority: QueuePriority
) => Promise<QueueItemAsyncResult>;

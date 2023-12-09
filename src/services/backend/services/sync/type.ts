import { EnqueuedIpfsResult } from 'src/services/QueueManager/QueueManager';
import { NeuronAddress, ParticleCid } from 'src/types/base';

export type SyncServiceParams = {
  myAddress: NeuronAddress | null;
  followings: NeuronAddress[];
  cyberIndexUrl?: string;
};

export type FetchIpfsFunc = (cid: ParticleCid) => Promise<EnqueuedIpfsResult>;

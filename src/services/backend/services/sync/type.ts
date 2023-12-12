import { EntryType } from 'src/services/CozoDb/types';
import { EnqueuedIpfsResult } from 'src/services/QueueManager/QueueManager.d';
import { NeuronAddress, ParticleCid } from 'src/types/base';

export type SyncServiceParams = {
  myAddress: NeuronAddress | null;
  followings: NeuronAddress[];
  cyberIndexUrl?: string;
};

export type FetchIpfsFunc = (cid: ParticleCid) => Promise<EnqueuedIpfsResult>;

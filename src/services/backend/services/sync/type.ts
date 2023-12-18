import { EntryType } from 'src/services/CozoDb/types/entities';
import { EnqueuedIpfsResult } from 'src/services/QueueManager/types';
import { NeuronAddress, ParticleCid } from 'src/types/base';

export type SyncServiceParams = {
  myAddress: NeuronAddress | null;
  followings: NeuronAddress[];
  cyberIndexUrl?: string;
};

export type FetchIpfsFunc = (cid: ParticleCid) => Promise<EnqueuedIpfsResult>;

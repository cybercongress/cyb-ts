import { NeuronAddress } from 'src/types/base';

export type onProgressCallback = (count: number) => void;
export type onCompleteCallback = (total: number) => void;

export type SyncServiceParams = {
  myAddress: NeuronAddress | null;
  followings: NeuronAddress[];
  cyberIndexUrl?: string;
};

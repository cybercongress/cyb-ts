import { Observable } from 'rxjs';
import { CybIpfsNode } from 'src/services/ipfs/types';
import DbApi from '../../DbApi/DbApi';
import { FetchIpfsFunc, SyncServiceParams } from '../types';
import { NeuronAddress } from 'src/types/base';

export type ServiceDeps = {
  dbInstance$: Observable<DbApi | undefined>;
  ipfsInstance$: Observable<CybIpfsNode | undefined>;
  params$: Observable<SyncServiceParams> | undefined;
  followings$: Observable<NeuronAddress[]> | undefined;
  waitForParticleResolve?: FetchIpfsFunc;
};

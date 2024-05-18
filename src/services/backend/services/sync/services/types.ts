import { Observable } from 'rxjs';
import { CybIpfsNode } from 'src/services/ipfs/types';
import { NeuronAddress } from 'src/types/base';
import { GetEmbeddingFunc } from 'src/services/backend/workers/background/worker';

import DbApi from '../../DbApi/DbApi';
import { FetchIpfsFunc, SyncServiceParams } from '../types';

export type ServiceDeps = {
  dbInstance$: Observable<DbApi | undefined>;
  ipfsInstance$: Observable<CybIpfsNode | undefined>;
  params$: Observable<SyncServiceParams> | undefined;
  followings$?: Observable<NeuronAddress[]> | undefined;
  getEmbeddingInstance$?: Observable<GetEmbeddingFunc | undefined> | undefined;
  waitForParticleResolve?: FetchIpfsFunc;
};

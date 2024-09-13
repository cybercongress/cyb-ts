import { Observable } from 'rxjs';
import { CybIpfsNode } from 'src/services/ipfs/types';
import { NeuronAddress } from 'src/types/base';
import { EmbeddingApi } from 'src/services/backend/workers/background/api/mlApi';

import DbApi from '../../DbApi/DbApi';
import { FetchIpfsFunc, SyncServiceParams } from '../types';

export type ServiceDeps = {
  dbInstance$: Observable<DbApi | undefined>;
  ipfsInstance$: Observable<CybIpfsNode | undefined>;
  params$: Observable<SyncServiceParams> | undefined;
  followings$?: Observable<NeuronAddress[]>;
  embeddingApi$: Observable<EmbeddingApi>;
  waitForParticleResolve$: Observable<FetchIpfsFunc>;
};

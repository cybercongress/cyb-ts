import { proxy, Remote } from 'comlink';

import { QueuePriority } from 'src/services/QueueManager/types';
import { ParticleCid } from 'src/types/base';
import { BehaviorSubject, Subject } from 'rxjs';
import { RuneInnerDeps } from 'src/services/scripting/runeDeps';
import { CybIpfsNode } from 'src/services/ipfs/types';
import { Option } from 'src/types';

import { exposeWorkerApi } from '../factoryMethods';

import { SyncService } from '../../services/sync/sync';
import { FetchIpfsFunc, SyncServiceParams } from '../../services/sync/types';

import DbApi from '../../services/DbApi/DbApi';

import BroadcastChannelSender from '../../channels/BroadcastChannelSender';
import { createMlApi } from './api/mlApi';
import { createRuneApi } from './api/runeApi';
import { IpfsApi } from './api/ipfsApi';

const createBackgroundWorkerApi = () => {
  const broadcastApi = new BroadcastChannelSender();

  const dbInstance$ = new Subject<DbApi>();
  const ipfsInstance$ = new Subject<Option<CybIpfsNode>>();
  const waitForParticleResolve$ = new Subject<FetchIpfsFunc>();

  const injectDb = (db: DbApi) => dbInstance$.next(db);

  const injectIpfsNode = (node: Option<CybIpfsNode>) =>
    ipfsInstance$.next(node);

  const injectIpfsApi = (ipfsApi: Remote<IpfsApi>) => {
    setInnerDeps({ ipfsApi });

    const waitForParticleResolve = (
      cid: ParticleCid,
      priority: QueuePriority = QueuePriority.MEDIUM
    ) => ipfsApi.enqueueAndWait(cid, { priority });

    waitForParticleResolve$.next(waitForParticleResolve);
  };

  const { embeddingApi$, getEmbeddingApi } = createMlApi(
    dbInstance$,
    broadcastApi
  );

  const { setInnerDeps, rune } = createRuneApi(
    embeddingApi$,
    dbInstance$,
    broadcastApi
  );

  const params$ = new BehaviorSubject<SyncServiceParams>({
    myAddress: null,
  });

  const serviceDeps = {
    waitForParticleResolve$,
    dbInstance$,
    ipfsInstance$,
    embeddingApi$,
    params$,
  };

  // service to sync updates about cyberlinks, transactions, swarm etc.
  const syncService = new SyncService(serviceDeps);

  return {
    injectDb,
    injectIpfsNode,
    injectIpfsApi,
    rune: proxy(rune),
    getEmbeddingApi: proxy(getEmbeddingApi), // RepaySubject does not work with comlink
    setRuneDeps: (
      deps: Partial<Omit<RuneInnerDeps, 'embeddingApi' | 'dbApi'>>
    ) => setInnerDeps(deps),
    setParams: (params: Partial<SyncServiceParams>) =>
      params$.next({ ...params$.value, ...params }),
  };
};

const backgroundWorker = createBackgroundWorkerApi();

export type BackgroundWorker = typeof backgroundWorker;

// Expose the API to the main thread as shared/regular worker
exposeWorkerApi(self, backgroundWorker);

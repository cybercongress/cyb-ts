import { proxy } from 'comlink';

import { QueuePriority } from 'src/services/QueueManager/types';
import { ParticleCid } from 'src/types/base';
import { BehaviorSubject, Subject } from 'rxjs';
import { RuneInnerDeps } from 'src/services/scripting/runeDeps';

import { exposeWorkerApi } from '../factoryMethods';

import { SyncService } from '../../services/sync/sync';
import { SyncServiceParams } from '../../services/sync/types';

import DbApi from '../../services/DbApi/DbApi';

import BroadcastChannelSender from '../../channels/BroadcastChannelSender';
import { createIpfsApi } from './api/ipfsApi';
import { createMlApi } from './api/mlApi';
import { createRuneApi } from './api/runeApi';
import { createP2PApi } from './api/p2pApi';

// import { initRuneDeps } from 'src/services/scripting/wasmBindings';

const createBackgroundWorkerApi = () => {
  const broadcastApi = new BroadcastChannelSender();

  const dbInstance$ = new Subject<DbApi>();

  const injectDb = (db: DbApi) => dbInstance$.next(db);

  const params$ = new BehaviorSubject<SyncServiceParams>({
    myAddress: null,
  });

  const { embeddingApi$ } = createMlApi(dbInstance$, broadcastApi);

  const { setInnerDeps, rune } = createRuneApi(
    embeddingApi$,
    dbInstance$,
    broadcastApi
  );

  const { api: p2pApi } = createP2PApi(broadcastApi);

  const {
    ipfsQueue,
    ipfsInstance$,
    api: ipfsApi,
  } = createIpfsApi(rune, p2pApi, broadcastApi);

  const waitForParticleResolve = (
    cid: ParticleCid,
    priority: QueuePriority = QueuePriority.MEDIUM
  ) => ipfsQueue.enqueueAndWait(cid, { priority });

  const serviceDeps = {
    waitForParticleResolve,
    dbInstance$,
    ipfsInstance$,
    embeddingApi$,
    params$,
  };

  // service to sync updates about cyberlinks, transactions, swarm etc.
  const syncService = new SyncService(serviceDeps);

  // INITIALIZATION
  setInnerDeps({ ipfsApi });

  return {
    injectDb,
    isIpfsInitialized: () => !!ipfsInstance$.getValue(),
    // syncDrive,
    ipfsApi: proxy(ipfsApi),
    p2pApi: proxy(p2pApi),
    rune: proxy(rune),
    embeddingApi$,
    // ipfsInstance$,
    ipfsQueue: proxy(ipfsQueue),
    setRuneDeps: (
      deps: Partial<Omit<RuneInnerDeps, 'embeddingApi' | 'dbApi'>>
    ) => setInnerDeps(deps),
    // restartSync: (name: SyncEntryName) => syncService.restart(name),
    setParams: (params: Partial<SyncServiceParams>) =>
      params$.next({ ...params$.value, ...params }),
  };
};

const backgroundWorker = createBackgroundWorkerApi();

export type BackgroundWorker = typeof backgroundWorker;

// Expose the API to the main thread as shared/regular worker
exposeWorkerApi(self, backgroundWorker);

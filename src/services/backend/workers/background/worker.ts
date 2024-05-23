import { ProxyMarked, Remote, proxy } from 'comlink';

import { initIpfsNode } from 'src/services/ipfs/node/factory';

import {
  CybIpfsNode,
  IpfsContentType,
  IpfsOptsType,
} from 'src/services/ipfs/types';

import QueueManager from 'src/services/QueueManager/QueueManager';

// import { CozoDbWorkerApi } from 'src/services/backend/workers/db/worker';

import {
  QueueItemCallback,
  QueueItemOptions,
  QueuePriority,
} from 'src/services/QueueManager/types';
import { ParticleCid } from 'src/types/base';
import { LinkDto } from 'src/services/CozoDb/types/dto';
import { BehaviorSubject, Subject } from 'rxjs';
import { PipelineType, pipeline } from '@xenova/transformers';
import rune, { LoadParams, RuneEngine } from 'src/services/scripting/engine';
import runeDeps from 'src/services/scripting/runeDeps';

import { exposeWorkerApi } from '../factoryMethods';

import { SyncService } from '../../services/sync/sync';
import { SyncServiceParams } from '../../services/sync/types';

import DbApi from '../../services/DbApi/DbApi';

import BroadcastChannelSender from '../../channels/BroadcastChannelSender';
import { SyncEntryName } from '../../types/services';
import ParticlesResolverQueue from '../../services/sync/services/ParticlesResolverQueue/ParticlesResolverQueue';
import BackendQueueChannelListener from '../../channels/BackendQueueChannel/BackendQueueChannel';

// import { initRuneDeps } from 'src/services/scripting/wasmBindings';

type MlModelParams = {
  name: PipelineType;
  model: string;
};
const mlModelMap: Record<string, MlModelParams> = {
  featureExtractor: {
    name: 'feature-extraction',
    model: 'Xenova/all-MiniLM-L6-v2',
  },
  // summarization: {
  //   name: 'summarization',
  //   model: 'ahmedaeb/distilbart-cnn-6-6-optimised',
  // },
  // qa: {
  //   name: 'question-answering',
  //   model: 'Xenova/distilbert-base-uncased-distilled-squad',
  // },
};

export type GetEmbeddingFunc = (text: string) => Promise<number[]>;

const createBackgroundWorkerApi = () => {
  const dbInstance$ = new BehaviorSubject<DbApi | undefined>(undefined);
  const runeInstance$ = new Subject<RuneEngine | undefined>();

  const ipfsInstance$ = new BehaviorSubject<CybIpfsNode | undefined>(undefined);

  const params$ = new BehaviorSubject<SyncServiceParams>({
    myAddress: null,
  });

  let ipfsNode: CybIpfsNode | undefined;

  let dbApi: DbApi | undefined;

  const mlInstances: Record<keyof typeof mlModelMap, any> = {};

  const getEmbeddingInstance$ = new Subject<GetEmbeddingFunc | undefined>();

  dbInstance$.subscribe((db) => {
    dbApi = db;
  });

  const ipfsQueue = new QueueManager(ipfsInstance$, {
    runeInstance$,
  });
  const broadcastApi = new BroadcastChannelSender();

  const initMlInstance = async (name: keyof typeof mlModelMap) => {
    if (!mlInstances[name]) {
      // broadcastApi.postServiceStatus('ml', 'starting');
      const model = mlModelMap[name];
      console.log('-----------init ml pipeline');

      mlInstances[name] = await pipeline(model.name, model.model, {
        progress_callback: (progressData: any) => {
          // console.log('progress_callback', name, progressData);
          const {
            status,
            progress,
            // name: modelName,
            loaded,
            total,
          } = progressData;

          const message = loaded
            ? `${model.model} - ${loaded}/${total} bytes`
            : model.model;
          const progressItem = {
            status,
            message,
            done: ['done', 'ready', 'error'].some((s) => s === status),
          };

          if (name === 'featureExtractor' && status === 'done') {
            getEmbeddingInstance$.next(getEmbedding);
          }

          if (progress) {
            progressItem.progress = Math.round(progress);
          }

          broadcastApi.postMlSyncEntryProgress(name, progressItem);
        },
      });
      console.log('-----mlInst', !!mlInstances[name]);
    }

    return mlInstances[name];
  };

  const serviceDeps = {
    waitForParticleResolve: async (
      cid: ParticleCid,
      priority: QueuePriority = QueuePriority.MEDIUM
    ) => ipfsQueue.enqueueAndWait(cid, { postProcessing: true, priority }),
    dbInstance$,
    ipfsInstance$,
    getEmbeddingInstance$,
    params$,
  };

  const particlesResolver = new ParticlesResolverQueue(serviceDeps).start();

  const backendQueueChannel = new BackendQueueChannelListener(
    particlesResolver,
    dbInstance$
  );

  // service to sync updates about cyberlinks, transactions, swarm etc.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const syncService = new SyncService(serviceDeps, particlesResolver);
  const initMl = async () => {
    broadcastApi.postServiceStatus('ml', 'starting');
    console.log('-----------init ml starting');

    return Promise.all([
      initMlInstance('featureExtractor'),
      // initMlInstance('summarization'),
      // initMlInstance('qa'),
    ])
      .then((result) => {
        console.log('-----------init ml', result);
        broadcastApi.postServiceStatus('ml', 'started');
        return result;
      })
      .catch((e) =>
        broadcastApi.postServiceStatus('ml', 'error', e.toString())
      );
  };

  const initRune = async (params: LoadParams) => {
    broadcastApi.postServiceStatus('rune', 'starting');
    await rune
      .load(params)
      .then(() => {
        runeDeps.setInternalDeps({ rune });
        broadcastApi.postServiceStatus('rune', 'started');
      })
      .catch((err) =>
        broadcastApi.postServiceStatus('rune', 'error', err.toString())
      );

    runeInstance$.next(rune);
  };

  const init = async (
    dbApiProxy: DbApi & ProxyMarked,
    params: LoadParams
  ): Promise<void> => {
    dbInstance$.next(dbApiProxy);

    // non-awaitable
    Promise.all([initMl(), initRune(params)]);
  };

  const stopIpfs = async () => {
    if (ipfsNode) {
      await ipfsNode.stop();
    }
    ipfsInstance$.next(undefined);
    broadcastApi.postServiceStatus('ipfs', 'inactive');
  };

  const startIpfs = async (ipfsOpts: IpfsOptsType) => {
    try {
      if (ipfsNode) {
        console.log('Ipfs node already started!');
        await ipfsNode.stop();
      }
      broadcastApi.postServiceStatus('ipfs', 'starting');
      ipfsNode = await initIpfsNode(ipfsOpts);
      ipfsInstance$.next(ipfsNode);
      setTimeout(() => broadcastApi.postServiceStatus('ipfs', 'started'), 0);
      return true;
    } catch (err) {
      console.log('----ipfs node init error ', err);
      const msg = err instanceof Error ? err.message : (err as string);
      broadcastApi.postServiceStatus('ipfs', 'error', msg);
      throw Error(msg);
    }
  };

  const getEmbedding = async (text: string) => {
    const output = await mlInstances.featureExtractor(text, {
      pooling: 'mean',
      normalize: true,
    });

    return output.data;
  };

  const mlApi = {
    getEmbedding,
    // getQA: async (question: string, context: string) => {
    //   const output = await mlInstances.qa(question, context);
    //   console.log('---- getQA output', output);
    //   return output.answer;
    // },
    // getSummary: async (context: string, maxTokens = 100) => {
    //   const output = await mlInstances.summarization(context, {
    //     max_new_tokens: maxTokens,
    //   });
    //   console.log('---- getSummary output', output);
    //   return output[0].summary_text;
    // },

    searchByEmbedding: async (text: string, count?: number) => {
      const vec = await getEmbedding(text);

      const rows = await dbApi!.searchByEmbedding(vec, count);
      return rows;
    },
  };

  const ipfsApi = {
    start: startIpfs,
    stop: stopIpfs,
    getIpfsNode: async () => ipfsNode && proxy(ipfsNode),
    config: async () => ipfsNode?.config,
    info: async () => ipfsNode?.info(),
    fetchWithDetails: async (
      cid: string,
      parseAs?: IpfsContentType,
      controller?: AbortController
    ) => {
      if (!ipfsNode) {
        throw new Error('ipfs node not initialized');
      }
      return ipfsNode.fetchWithDetails(cid, parseAs, controller);
    },
    enqueue: async (
      cid: string,
      callback: QueueItemCallback,
      options: QueueItemOptions
    ) => ipfsQueue!.enqueue(cid, callback, options),
    enqueueAndWait: async (cid: string, options?: QueueItemOptions) =>
      ipfsQueue!.enqueueAndWait(cid, options),
    dequeue: async (cid: string) => ipfsQueue.cancel(cid),
    dequeueByParent: async (parent: string) => ipfsQueue.cancelByParent(parent),
    clearQueue: async () => ipfsQueue.clear(),
    addContent: async (content: string | File) => ipfsNode?.addContent(content),
  };

  runeDeps.setInternalDeps({ ipfsApi, mlApi });

  return {
    init,
    isInitialized: () => !!ipfsInstance$.value,
    // syncDrive,
    ipfsApi: proxy(ipfsApi),
    rune: proxy(rune),
    mlApi: proxy(mlApi),
    ipfsQueue: proxy(ipfsQueue),
    restartSync: (name: SyncEntryName) => syncService.restart(name),
    setParams: (params: Partial<SyncServiceParams>) =>
      params$.next({ ...params$.value, ...params }),
  };
};

const backgroundWorker = createBackgroundWorkerApi();

export type IpfsApi = typeof backgroundWorker.ipfsApi;

export type MlApi = typeof backgroundWorker.mlApi;

export type RemoteIpfsApi = Remote<IpfsApi>;

export type BackgroundWorker = typeof backgroundWorker;

// Expose the API to the main thread as shared/regular worker
exposeWorkerApi(self, backgroundWorker);

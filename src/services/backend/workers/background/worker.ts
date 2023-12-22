import { ProxyMarked, Remote, proxy } from 'comlink';

import { initIpfsNode } from 'src/services/ipfs/node/factory';

import {
  CybIpfsNode,
  IPFSContent,
  IPFSContentMaybe,
  IpfsContentType,
  IpfsOptsType,
} from 'src/services/ipfs/ipfs';

import QueueManager from 'src/services/QueueManager/QueueManager';

// import { CozoDbWorkerApi } from 'src/services/backend/workers/db/worker';

import {
  QueueItemCallback,
  QueueItemOptions,
} from 'src/services/QueueManager/types';
import { ParticleCid } from 'src/types/base';
import { LinkDto } from 'src/services/CozoDb/types/dto';
import { BehaviorSubject, Subject } from 'rxjs';
import { exposeWorkerApi } from '../factoryMethods';

import { SyncService } from '../../services/sync/sync';
import { SyncServiceParams } from '../../services/sync/types';

import { DbApi } from '../../services/dataSource/indexedDb/dbApiWrapper';

import BroadcastChannelSender from '../../channels/BroadcastChannelSender';
import DeferredDbProcessor from '../../services/DeferredDbProcessor/DeferredDbProcessor';

const createBackgroundWorkerApi = () => {
  const dbInstance$ = new Subject<DbApi | undefined>();

  const ipfsInstance$ = new Subject<CybIpfsNode | undefined>();

  const params$ = new BehaviorSubject<SyncServiceParams>({
    myAddress: null,
    followings: [],
  });

  let ipfsNode: CybIpfsNode | undefined;
  const defferedDbProcessor = new DeferredDbProcessor(dbInstance$);

  const ipfsQueue = new QueueManager({ defferedDbProcessor });
  const broadcastApi = new BroadcastChannelSender();

  // service to sync updates about cyberlinks, transactions, swarm etc.

  const resolveAndSaveParticle = async (cid: ParticleCid) =>
    ipfsQueue.enqueueAndWait(cid, { postProcessing: true });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const syncService = new SyncService({
    resolveAndSaveParticle,
    dbInstance$,
    ipfsInstance$,
    params$,
  });

  // TODO: fix wrong type is used
  const init = async (dbApiProxy: DbApi & ProxyMarked) => {
    // proxy to worker with db
    dbInstance$.next(dbApiProxy);
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

      ipfsQueue.setNode(ipfsNode);

      setTimeout(() => broadcastApi.postServiceStatus('ipfs', 'started'), 0);
      return true;
    } catch (err) {
      console.log('----ipfs node init error ', err);
      const msg = err instanceof Error ? err.message : (err as string);
      broadcastApi.postServiceStatus('ipfs', 'error', msg);
      throw Error(msg);
    }
  };

  const defferedDbApi = {
    importCyberlinks: (links: LinkDto[]) => {
      defferedDbProcessor.enqueueLinks(links);
    },
  };

  const ipfsApi = {
    start: startIpfs,
    stop: stopIpfs,
    getIpfsNode: async () => ipfsNode && proxy(ipfsNode),
    config: async () => ipfsNode?.config,
    info: async () => ipfsNode?.info(),
    fetchWithDetails: async (cid: string, parseAs?: IpfsContentType) =>
      ipfsNode?.fetchWithDetails(cid, parseAs),
    enqueue: async (
      cid: string,
      callback: QueueItemCallback<IPFSContentMaybe>,
      options: QueueItemOptions
    ) => ipfsQueue!.enqueue(cid, callback, options),
    enqueueAndWait: async (cid: string, options?: QueueItemOptions) =>
      ipfsQueue!.enqueueAndWait(cid, options),
    dequeue: async (cid: string) => ipfsQueue.cancel(cid),
    dequeueByParent: async (parent: string) => ipfsQueue.cancelByParent(parent),
    clearQueue: async () => ipfsQueue.clear(),
    addContent: async (content: string | File) => ipfsNode?.addContent(content),
  };

  return {
    init,
    // syncDrive,
    ipfsApi: proxy(ipfsApi),
    defferedDbApi: proxy(defferedDbApi),
    setParams: (params: Partial<SyncServiceParams>) =>
      params$.next({ ...params$.value, ...params }),
  };
};

const backgroundWorker = createBackgroundWorkerApi();

export type BackgroundWorker = typeof backgroundWorker;

// Expose the API to the main thread as shared/regular worker
exposeWorkerApi(self, backgroundWorker);

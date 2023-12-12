import { proxy } from 'comlink';

import { initIpfsNode } from 'src/services/ipfs/node/factory';

import {
  CybIpfsNode,
  IPFSContent,
  IPFSContentMaybe,
  IpfsContentType,
  IpfsOptsType,
} from 'src/services/ipfs/ipfs';

import QueueManager from 'src/services/QueueManager/QueueManager';

import { CozoDbWorkerApi } from 'src/services/backend/workers/db/worker';

import { LinkDbEntity, PinTypeMap } from 'src/services/CozoDb/types';

import BcChannel from 'src/services/backend/channels/BroadcastChannel';

import {
  ServiceName,
  ServiceStatus,
  SyncEntry,
  SyncProgress,
  WorkerStatus,
} from 'src/services/backend/types';
import {
  QueueItemCallback,
  QueueItemOptions,
} from 'src/services/QueueManager/QueueManager.d';
import { NeuronAddress, ParticleCid } from 'src/types/base';

import {
  importParticle,
  importParicleContent,
} from '../../services/dataSource/ipfs/ipfsSource';
import { importTransactions } from './importers_legacy/transactions';
import { exposeWorkerApi } from '../factoryMethods';
import { SyncService } from '../../services/sync/sync';
import { SyncServiceParams } from '../../services/sync/type';
import DbApiWrapper from '../../services/dataSource/indexedDb/dbApiWrapper';

const backendApiFactory = () => {
  let ipfsNode: CybIpfsNode | undefined;
  let dbApi: CozoDbWorkerApi | undefined;
  const dbApiWrapper = DbApiWrapper;

  const ipfsQueue = new QueueManager<IPFSContentMaybe>();
  const channel = new BcChannel();
  // service to sync updates about cyberlinks, transactions, swarm etc.

  const fetchIpfsContent = async (cid: ParticleCid) =>
    ipfsQueue.enqueueAndWait(cid, { postProcessing: true });

  const syncService = new SyncService(fetchIpfsContent);

  const postServiceStatus = (
    name: ServiceName,
    status: ServiceStatus,
    error?: string
  ) =>
    channel.post({
      type: 'service_status',
      value: { name, status, error },
    });

  const postWorkerStatus = (status: WorkerStatus, lastError?: string) =>
    channel.post({ type: 'worker_status', value: { status, lastError } });

  const postEntrySyncStatus = (entry: SyncEntry, state: SyncProgress) => {
    channel.post({ type: 'sync_entry', value: { entry, state } });
  };

  // TODO: fix wrong type is used
  const installDbApi = async (dbApiProxy: CozoDbWorkerApi) => {
    // proxy to worker with db
    dbApi = dbApiProxy;
    dbApiWrapper.init(dbApi);
    syncService.initDb(dbApiWrapper, postEntrySyncStatus);
    postServiceStatus('sync', 'started');
    postWorkerStatus('idle');
  };

  // TODO: refact, params need to be synced with main thread
  const syncDrive = async (
    address: string | null,
    cyberIndexUrl: string
  ): Promise<void> => {
    try {
      if (!address) {
        postWorkerStatus('error', 'Wallet is not connected');
        return;
      }
      if (!ipfsNode) {
        postWorkerStatus('error', 'IPFS node is not initialized');
        return;
      }

      if (!dbApi) {
        postWorkerStatus('error', 'CozoDb is not initialized');
        return;
      }

      postWorkerStatus('syncing');

      ['transaction', 'pin', 'particle'].forEach((entry) =>
        postEntrySyncStatus(entry as SyncEntry, {
          progress: 0,
          done: false,
          error: undefined,
        })
      );

      const importIpfs = async () => {
        throw new Error('Legacy - not maintaned anymore due backgroun sync');
        console.log('-----import ipfs');
        // await importPins(
        //   ipfsNode!,
        //   dbApi!,
        //   async (progress) => postEntrySyncStatus('pin', { progress }),
        //   async () => postEntrySyncStatus('pin', { done: true })
        // );
        // const pinsData = await dbApi!.executeGetCommand(
        //   'pin',
        //   ['cid'],
        //   [`type = ${PinTypeMap.recursive}`]
        // );
        // if (pinsData.ok === false) {
        //   postWorkerStatus('error', pinsData.message);
        //   return;
        // }

        // const cids = pinsData.rows.map((row) => row[0]) as string[];

        // await importParticles(
        //   ipfsNode!,
        //   cids,
        //   dbApi!,
        //   async (progress) => postEntrySyncStatus('particle', { progress }),
        //   async () => postEntrySyncStatus('particle', { done: true })
        // );
        // console.log('-----import ipfs done');
      };

      const transactionPromise = importTransactions(
        dbApi,
        address,
        cyberIndexUrl,
        async (progress) => postEntrySyncStatus('transaction', { progress }),
        async (total) => postEntrySyncStatus('transaction', { done: true })
      );
      // const transactionPromise = Promise.resolve();
      const ipfsPromise = importIpfs();
      //
      await Promise.all([transactionPromise, ipfsPromise]);

      postWorkerStatus('idle');
    } catch (e) {
      console.error('syncDrive', e);
      postWorkerStatus('error', e.toString());
    }
  };

  const importApi = {
    importParicleContent: async (particle: IPFSContent) =>
      importParicleContent(particle, dbApiWrapper!),
    importCyberlinks: async (links: LinkDbEntity[]) => {
      dbApiWrapper.putCyberlinks(links);
    },
    importParticle: async (cid: string) =>
      importParticle(cid, ipfsNode!, dbApiWrapper!),
  };

  const stopIpfs = async () => {
    if (ipfsNode) {
      await ipfsNode.stop();
    }
    postServiceStatus('ipfs', 'inactive');
  };

  const startIpfs = async (ipfsOpts: IpfsOptsType) => {
    try {
      if (ipfsNode) {
        console.log('Ipfs node already started!');
        await ipfsNode.stop();
      }
      postServiceStatus('ipfs', 'starting');
      ipfsNode = await initIpfsNode(ipfsOpts);

      ipfsQueue.setNode(ipfsNode);

      // add post processor to queue manager
      ipfsQueue.setPostProcessor(async (content) => {
        content &&
          importApi.importParicleContent({ ...content, result: undefined });
        return content;
      });

      syncService.initIpfs(ipfsNode);

      postServiceStatus('ipfs', 'started');
      return proxy(ipfsNode);
    } catch (err) {
      console.log('----ipfs node init error ', err);
      const msg = err instanceof Error ? err.message : (err as string);
      postServiceStatus('ipfs', 'error', msg);
      throw Error(msg);
    }
  };

  const ipfsApi = {
    start: startIpfs,
    stop: stopIpfs,
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
  };

  const senseApi = {
    getSummary: () => dbApiWrapper.getSenseSummary(),
    getList: () => dbApiWrapper.getSenseList(),
    markAsRead: (id: NeuronAddress | ParticleCid) =>
      dbApiWrapper.senseMarkAsRead(id),
  };

  return {
    installDbApi,
    syncDrive,
    ipfsApi: proxy(ipfsApi),
    importApi: proxy(importApi),
    senseApi: proxy(senseApi),
    // dbWrapperApi: proxy(dbApiWrapper),
    setParams: (params: Partial<SyncServiceParams>) =>
      syncService.setParams(params),
  };
};

const backendWorkerApi = backendApiFactory();

export type BackendWorkerApi = typeof backendWorkerApi;

// Expose the API to the main thread as shared/regular worker
exposeWorkerApi(self, backendWorkerApi);

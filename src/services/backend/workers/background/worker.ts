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

import { DbWorkerApi } from 'src/services/backend/workers/db/worker';

import { PinTypeMap } from 'src/services/CozoDb/types';

import BcChannel from 'src/services/backend/channels/BroadcastChannel';

import {
  SyncEntry,
  SyncProgress,
  WorkerStatus,
} from 'src/services/backend/types';

import {
  importParticles,
  importPins,
  importParicleContent as importParicleContent_,
  importParticle as importParticle_,
} from './importers/ipfs';
import { importTransactions } from './importers/transactions';
import {
  PlainCyberLink,
  importCyberlinks as importCyberlinks_,
} from './importers/links';
import { exposeWorkerApi } from '../factoryMethods';
import {
  QueueItemCallback,
  QueueItemOptions,
} from 'src/services/QueueManager/QueueManager.d';

const backendApiFactory = () => {
  let ipfsNode: CybIpfsNode | undefined;
  let dbApi: DbWorkerApi | undefined;
  const ipfsQueue = new QueueManager<IPFSContentMaybe>();
  const channel = new BcChannel();

  console.log('----backendApi worker constructor!');

  const postWorkerStatus = (status: WorkerStatus, lastError?: string) =>
    channel.post({ type: 'worker_status', value: { status, lastError } });

  const postEntrySyncStatus = (entry: SyncEntry, state: SyncProgress) =>
    channel.post({ type: 'sync_entry', value: { entry, state } });

  const loadDbApi = async (dbApiProxy: DbWorkerApi) => {
    // proxy to worker with db
    dbApi = dbApiProxy;

    // add post processor to queue manager
    ipfsQueue.setPostProcessor(async (content) => {
      content && importParicleContent({ ...content, result: undefined });
      return content;
    });

    postWorkerStatus('idle');
  };

  const startIpfs = async (ipfsOpts: IpfsOptsType) => {
    try {
      if (ipfsNode) {
        await ipfsNode.stop();
      }
      ipfsNode = await initIpfsNode(ipfsOpts);
      ipfsQueue.setNode(ipfsNode);
      return proxy(ipfsNode);
    } catch (err) {
      console.log('----ipfs node init error ', err);
      throw Error(err instanceof Error ? err.message : (err as string));
    }
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
        console.log('-----import ipfs');
        await importPins(
          ipfsNode!,
          dbApi!,
          async (progress) => postEntrySyncStatus('pin', { progress }),
          async () => postEntrySyncStatus('pin', { done: true })
        );
        const pinsData = await dbApi!.executeGetCommand(
          'pin',
          [`type = ${PinTypeMap.recursive}`],
          ['cid']
        );
        if (pinsData.ok === false) {
          postWorkerStatus('error', pinsData.message);
          return;
        }

        const cids = pinsData.rows.map((row) => row[0]) as string[];

        await importParticles(
          ipfsNode!,
          cids,
          dbApi!,
          async (progress) => postEntrySyncStatus('particle', { progress }),
          async () => postEntrySyncStatus('particle', { done: true })
        );
        console.log('-----import ipfs done');
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

  const importParicleContent = async (particle: IPFSContent) =>
    importParicleContent_(particle, dbApi!);

  const importCyberlinks = async (links: PlainCyberLink[]) =>
    importCyberlinks_(links, dbApi!);

  const importParticle = async (cid: string) =>
    importParticle_(cid, ipfsNode!, dbApi!);

  const ipfsQueueFetch = async (
    cid: string,
    callback: QueueItemCallback<IPFSContentMaybe>,
    options: QueueItemOptions
  ) => ipfsQueue!.enqueue(cid, callback, options);

  // cancel: ipfsQueue ? (cid: string) => ipfsQueue.cancel(cid) : undefined,
  // clear: ipfsQueue ? async () => ipfsQueue.clear() : undefined,

  const ipfsQueueFetchAsync = async (cid: string, options?: QueueItemOptions) =>
    ipfsQueue!.enqueueAndWait(cid, options);

  const ipfsQueueClear = async () => ipfsQueue.clear();

  const ipfsQueueCancel = async (cid: string) => ipfsQueue.cancel(cid);

  const ipfsQueueCancelByParent = async (parent: string) =>
    ipfsQueue.cancelByParent(parent);

  const ipfsInfo = async () => ipfsNode?.info();

  const ipfsFetchWithDetails = async (cid: string, parseAs?: IpfsContentType) =>
    ipfsNode?.fetchWithDetails(cid, parseAs);

  return {
    loadDbApi,
    syncDrive,
    importParicleContent,
    importCyberlinks,
    importParticle,
    startIpfs,
    ipfsQueueFetch,
    ipfsQueueFetchAsync,
    ipfsQueueCancelByParent,
    ipfsQueueClear,
    ipfsQueueCancel,
    ipfsInfo,
    ipfsFetchWithDetails,
  };
};

const backendApi = backendApiFactory();

export type BackendWorkerApi = typeof backendApi;

// Expose the API to the main thread as shared/regular worker
exposeWorkerApi(self, backendApi);

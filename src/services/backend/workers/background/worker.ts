import { AppIPFS, IPFSContent } from 'src/utils/ipfs/ipfs';
import { IpfsOptsType } from 'src/contexts/ipfs';

import { DbWorkerApi } from 'src/services/backend/workers/db/worker';

import { PinTypeMap } from 'src/services/CozoDb/types';

import { initIpfsClient, destroyIpfsClient } from 'src/utils/ipfs/init';

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
import { exposeWorker, onConnect } from '../workerUtils';

const backendApiFactory = () => {
  let ipfsNode: AppIPFS | undefined;
  let dbApi: DbWorkerApi | undefined;
  console.log('----backendApi worker constructor!');
  const channel = new BcChannel();

  const postWorkerStatus = (status: WorkerStatus, lastError?: string) =>
    channel.post({ type: 'worker_status', value: { status, lastError } });

  const postEntrySyncStatus = (entry: SyncEntry, state: SyncProgress) =>
    channel.post({ type: 'sync_entry', value: { entry, state } });

  const init = async (ipfsOpts: IpfsOptsType, dbApiProxy: DbWorkerApi) => {
    console.log('----backendApi worker init! ');

    // proxy to worker with db
    dbApi = dbApiProxy;

    ipfsNode = await initIpfsClient(ipfsOpts);
    postWorkerStatus('idle');
  };

  // TODO: refact, params need to be synced with main thread
  const syncDrive = async (
    address: string | null,
    cyberIndexUrl: string
  ): Promise<void> => {
    ['transaction', 'pin', 'particle'].forEach((entry) =>
      postEntrySyncStatus(entry as SyncEntry, {
        progress: 0,
        done: false,
        error: undefined,
      })
    );

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
        console.log('-----import ipfs pinsData', pinsData);

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

      const ipfsPromise = importIpfs();

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

  return {
    init,
    syncDrive,
    importParicleContent,
    importCyberlinks,
    importParticle,
  };
};

const backendApi = backendApiFactory();

export type BackendWorkerApi = typeof backendApi;

// Expose the API to the main thread as shared/regular worker
exposeWorker(self, backendApi);

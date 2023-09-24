import { expose, proxy } from 'comlink';
import { AppIPFS } from 'src/utils/ipfs/ipfs';
import { IpfsOptsType } from 'src/contexts/ipfs';

import { importParticles, importPins } from './importers/ipfs';
// import dbService from '../CozoDb/db.service';
import { DbWorkerApi } from 'src/services/backend/workers/db/worker';

import { PinTypeMap } from 'src/services/CozoDb/types';
import { initIpfsClient, destroyIpfsClient } from 'src/utils/ipfs/init';

import BcChannel from 'src/services/backend/channels/BroadcastChannel';
import {
  SyncEntry,
  SyncProgress,
  WorkerStatus,
} from 'src/services/backend/types';
import { importTransactions } from './importers/transactions';

const backendApiFactory = () => {
  let ipfsNode: AppIPFS | undefined;
  let dbService: DbWorkerApi | undefined;

  const channel = new BcChannel();

  const postWorkerStatus = (status: WorkerStatus, lastError?: string) =>
    channel.post({ type: 'worker_status', value: { status, lastError } });
  const postEntrySyncStatus = (entry: SyncEntry, state: SyncProgress) =>
    channel.post({ type: 'sync_entry', value: { entry, state } });

  const init = async (ipfsOpts: IpfsOptsType, dbServiceProxy: DbWorkerApi) => {
    // proxy to worker with db
    dbService = dbServiceProxy;

    ipfsNode = await initIpfsClient(ipfsOpts);
    postWorkerStatus('idle');
  };

  // TODO: refact, params need to be synced with main thread
  const syncIPFS = async (
    address: string | null,
    cyberIndexUrl: string
  ): Promise<void> => {
    try {
      if (!address) {
        postWorkerStatus('error', 'Connect your wallet');
        return;
      }
      if (!ipfsNode) {
        postWorkerStatus('error', 'IPFS node is not initialized');
        return;
      }

      if (!dbService) {
        postWorkerStatus('error', 'CozoDb is not initialized');
        return;
      }

      console.log('----sync start', ipfsNode, dbService);
      postWorkerStatus('syncing');
      await importTransactions(
        dbService,
        address,
        cyberIndexUrl,
        async (progress) => postEntrySyncStatus('transaction', { progress }),
        async (total) => postEntrySyncStatus('transaction', { done: true })
      );

      await importPins(
        ipfsNode,
        dbService,
        async (progress) => postEntrySyncStatus('pin', { progress }),
        async (total) => postEntrySyncStatus('pin', { done: true })
      );
      const pinsData = await dbService.executeGetCommand(
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
        ipfsNode,
        cids,
        dbService,
        async (progress) => postEntrySyncStatus('particle', { progress }),
        async (total) => postEntrySyncStatus('particle', { done: true })
      );

      postWorkerStatus('idle');
    } catch (e) {
      console.error('syncIPFS', e);
      postWorkerStatus('error', e.toString());
    }
  };

  // const syncTransactions = async (address: string, cyberIndexHttps: string) => {
  //   const res = await importTransactions(address, cyberIndexHttps);
  //   console.log('-----data', res);
  // };

  return {
    init,
    syncIPFS,
  };
};

const backendApi = backendApiFactory();

export type BackendWorkerApi = typeof backendApi;

// Expose the API to the main thread
// expose(backendApi);
onconnect = (e) => expose(backendApi, e.ports[0]);

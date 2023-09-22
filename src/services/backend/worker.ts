import { expose, proxy } from 'comlink';
import { AppIPFS } from 'src/utils/ipfs/ipfs';
import { IpfsOptsType } from 'src/contexts/ipfs';

import { importParticles, importPins } from '../CozoDb/importers/ipfs';
import dbService from '../CozoDb/db.service';
import { PinTypeMap } from '../CozoDb/types';
import { initIpfsClient, destroyIpfsClient } from 'src/utils/ipfs/init';

import { importTransactions } from '../CozoDb/importers/transactions';
import BcChannel from './BroadcastChannel';
import { SyncEntry, SyncProgress, WorkerStatus } from './types';

const api = () => {
  let ipfsNode: AppIPFS | undefined;

  const channel = new BcChannel();

  const postWorkerStatus = (status: WorkerStatus, lastError?: string) =>
    channel.post({ type: 'worker_status', value: { status, lastError } });
  const postEntrySyncStatus = (entry: SyncEntry, state: SyncProgress) =>
    channel.post({ type: 'sync_entry', value: { entry, state } });

  const init = async (ipfsOpts: IpfsOptsType) => {
    await dbService.init().then(() => console.log('⚙️ CozoDb initialized'));

    ipfsNode = await initIpfsClient(ipfsOpts);
    console.log('----bg worker', ipfsNode, ipfsOpts);
    postWorkerStatus('idle');
  };

  const getDbApi = async () => proxy(dbService);

  const syncIPFS = async (): Promise<void> => {
    try {
      const t0 = performance.now();
      if (!ipfsNode) {
        postWorkerStatus('error', 'IPFS node is not initialized');
        return;
      }
      console.log('----sync ipfs start', ipfsNode);
      postWorkerStatus('syncing');

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
      // const pinsResult = withColIndex(pinsData);

      // const { cid: cidIdx } = pinsResult.index;

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

  const syncTransactions = async (address: string, cyberIndexHttps: string) => {
    const res = await importTransactions(address, cyberIndexHttps);
    console.log('-----data', res);
  };

  return { init, syncIPFS, syncTransactions, getDbApi };
};

const backendApi = api();

export type BackendWorkerApi = typeof backendApi;

// Expose the API to the main thread
expose(backendApi);

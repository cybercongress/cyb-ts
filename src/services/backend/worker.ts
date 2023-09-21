import { expose } from 'comlink';
import { AppIPFS } from 'src/utils/ipfs/ipfs';
import { IpfsOptsType } from 'src/contexts/ipfs';

import { importParticles, importPins } from '../CozoDb/importers/ipfs';
import dbService from '../CozoDb/db.service';
import { withColIndex } from '../CozoDb/utils';
import { PinTypeMap } from '../CozoDb/cozoDb.d';
// import { SyncState, WorkerStatus, SyncEntryUpdate } from './types';
import { initIpfsClient, destroyIpfsClient } from 'src/utils/ipfs/init';

import { importTransactions } from '../CozoDb/importers/transactions';
import { DualChannelSyncState } from './DualChannel';

const api = () => {
  // const channel = new BroadcastChannel('cyb-broadcast-channel');
  let ipfsNode: AppIPFS | undefined;
  const state = new DualChannelSyncState('sender', 'cyb-broadcast-channel');

  const init = async (ipfsOpts: IpfsOptsType) => {
    await dbService.init();
    ipfsNode = await initIpfsClient(ipfsOpts);
    console.log('----bg worker', ipfsNode, ipfsOpts);
    state.syncStatusUpdate('idle');
  };

  const syncIPFS = async (): Promise<void> => {
    try {
      const t0 = performance.now();
      if (!ipfsNode) {
        state.syncStatusUpdate('error', 'IPFS node is not initialized');
        return;
      }
      console.log('----sync ipfs start', ipfsNode);
      state.syncStatusUpdate('syncing');

      await importPins(
        ipfsNode,
        async (progress) =>
          state.syncEntryUpdate({
            entry: 'pin',
            state: { progress },
          }),
        async (total) =>
          state.syncEntryUpdate({
            entry: 'pin',
            state: { done: true },
          })
      );
      const pinsData = await dbService.executeGetCommand(
        'pin',
        [`type = ${PinTypeMap.recursive}`],
        ['cid']
      );

      if (pinsData.ok === false) {
        state.syncStatusUpdate('error', pinsData.message);

        return;
      }
      // const pinsResult = withColIndex(pinsData);

      // const { cid: cidIdx } = pinsResult.index;

      const cids = pinsData.rows.map((row) => row[0]) as string[];

      await importParticles(
        ipfsNode,
        cids,
        async (progress) =>
          state.syncEntryUpdate({
            entry: 'particle',
            state: { progress },
          }),
        async (total) =>
          state.syncEntryUpdate({
            entry: 'particle',
            state: { done: true },
          })
      );

      state.syncStatusUpdate('idle');
    } catch (e) {
      console.error('syncIPFS', e);
      state.syncStatusUpdate('error');
    }
  };

  const syncTransactions = async (address: string, cyberIndexHttps: string) => {
    const res = await importTransactions(address, cyberIndexHttps);
    console.log('-----data', res);
  };

  return { init, syncIPFS, syncTransactions };
};

const workerApi = api();

export type BackgroundWorkerApi = typeof workerApi;

// Expose the API to the main thread
expose(workerApi);

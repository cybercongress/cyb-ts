import { BehaviorSubject } from 'rxjs';

import QueueManager from 'src/services/QueueManager/QueueManager';
import {
  QueueItemCallback,
  QueueItemOptions,
} from 'src/services/QueueManager/types';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { initIpfsNode } from 'src/services/ipfs/node/factory';

import {
  CybIpfsNode,
  IpfsContentType,
  IpfsOptsType,
} from 'src/services/ipfs/types';
import { asyncIterableBatchProcessor } from 'src/utils/async/iterable';

import { LsResult } from 'ipfs-core-types/src/pin';
import { P2PApi } from './p2p/p2pApi';

// eslint-disable-next-line import/prefer-default-export
const createIpfsApi = (
  p2pApi: P2PApi,
  broadcastApi: BroadcastChannelSender
) => {
  const ipfsInstance$ = new BehaviorSubject<CybIpfsNode | undefined>(undefined);

  const ipfsQueue = new QueueManager(ipfsInstance$, {});

  const stop = async () => {
    const ipfsNode = ipfsInstance$.getValue();

    if (ipfsNode) {
      await ipfsNode.stop();
    }
    ipfsInstance$.next(undefined);
    broadcastApi.postServiceStatus('ipfs', 'inactive');
  };

  const start = async (ipfsOpts: IpfsOptsType) => {
    try {
      if (ipfsInstance$.getValue()) {
        broadcastApi.postServiceStatus('ipfs', 'started');
      } else {
        broadcastApi.postServiceStatus('ipfs', 'starting');
        console.time('🔋 ipfs initialized');
        const libp2p = await p2pApi.start(ipfsOpts);
        const ipfsNode = await initIpfsNode(ipfsOpts, libp2p);
        console.timeEnd('🔋 ipfs initialized');

        ipfsInstance$.next(ipfsNode);
        setTimeout(() => broadcastApi.postServiceStatus('ipfs', 'started'), 0);
      }
    } catch (err) {
      console.log('----ipfs node init error ', err);
      const msg = err instanceof Error ? err.message : (err as string);
      broadcastApi.postServiceStatus('ipfs', 'error', msg);
      throw Error(msg);
    }
  };

  const getIpfsNode = async (): Promise<CybIpfsNode> =>
    new Promise((resolve) => {
      const ipfsNode = ipfsInstance$.getValue();
      if (ipfsNode) {
        resolve(ipfsNode);
      }
      ipfsInstance$.subscribe((node) => {
        if (node) {
          resolve(node);
        }
      });
    });

  const pins = async () => {
    const pins: LsResult[] = [];
    await asyncIterableBatchProcessor(
      (await getIpfsNode()).ls(),
      async (pinsBatch) => {
        // filter only root pins
        pins.push(
          ...pinsBatch.filter(
            (p) => p.type === 'direct' || p.type === 'recursive'
          )
        );
      },
      10
    );

    return pins;
  };

  const api = {
    start,
    stop,
    config: async () => (await getIpfsNode()).config,
    info: async () => (await getIpfsNode()).info(),
    pins,
    fetchWithDetails: async (
      cid: string,
      parseAs?: IpfsContentType,
      controller?: AbortController
    ) => (await getIpfsNode()).fetchWithDetails(cid, parseAs, controller),
    addContent: async (content: string | File) =>
      (await getIpfsNode()).addContent(content),
    enqueue: async (
      cid: string,
      callback: QueueItemCallback,
      options: QueueItemOptions
    ) => ipfsQueue.enqueue(cid, callback, options),
    enqueueAndWait: async (cid: string, options?: QueueItemOptions) =>
      ipfsQueue!.enqueueAndWait(cid, options),
    dequeue: async (cid: string) => ipfsQueue.cancel(cid),
    dequeueByParent: async (parent: string) => ipfsQueue.cancelByParent(parent),
    clearQueue: async () => ipfsQueue.clear(),
  };

  return { ipfsInstance$, ipfsQueue, api };
};

export type IpfsApi = ReturnType<typeof createIpfsApi>['api'];

export default createIpfsApi;

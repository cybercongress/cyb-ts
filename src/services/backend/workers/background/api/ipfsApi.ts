import { BehaviorSubject } from 'rxjs';
import { proxy } from 'comlink';

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
import { RuneEngine } from 'src/services/scripting/engine';
import { P2PApi } from './p2pApi';

export const DEFAUL_P2P_TOPIC = 'cyber';

// eslint-disable-next-line import/prefer-default-export
export const createIpfsApi = (
  p2pApi: P2PApi,
  broadcastApi: BroadcastChannelSender
) => {
  const ipfsInstance$ = new BehaviorSubject<CybIpfsNode | undefined>(undefined);
  const ipfsQueue = new QueueManager(ipfsInstance$, {});
  const stopIpfs = async () => {
    const ipfsNode = ipfsInstance$.getValue();

    if (ipfsNode) {
      await ipfsNode.stop();
    }
    ipfsInstance$.next(undefined);
    broadcastApi.postServiceStatus('ipfs', 'inactive');
  };

  const startIpfs = async (ipfsOpts: IpfsOptsType) => {
    try {
      const ipfsNode = ipfsInstance$.getValue();
      if (ipfsNode) {
        // console.log('Ipfs node already started!');
        setTimeout(() => broadcastApi.postServiceStatus('ipfs', 'started'), 0);
        return Promise.resolve();
        // await ipfsNode.stop();
      }
      broadcastApi.postServiceStatus('ipfs', 'starting');
      console.time('🔋 ipfs initialized');
      const libp2p = await p2pApi.start(ipfsOpts);
      const newIpfsNode = await initIpfsNode(ipfsOpts, libp2p);
      // p2pApi.connectPeer
      console.timeEnd('🔋 ipfs initialized');

      ipfsInstance$.next(newIpfsNode);
      setTimeout(() => broadcastApi.postServiceStatus('ipfs', 'started'), 0);
      return true;
    } catch (err) {
      console.log('----ipfs node init error ', err);
      const msg = err instanceof Error ? err.message : (err as string);
      broadcastApi.postServiceStatus('ipfs', 'error', msg);
      throw Error(msg);
    }
  };

  const getIpfsNode = async (): CybIpfsNode =>
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

  const api = {
    start: startIpfs,
    stop: stopIpfs,
    config: async () => ipfsInstance$.getValue()?.config,
    info: async () => ipfsInstance$.getValue()?.info(),
    p2pApi: proxy(p2pApi),
    fetchWithDetails: async (
      cid: string,
      parseAs?: IpfsContentType,
      controller?: AbortController
    ) =>
      getIpfsNode().then((node) =>
        node.fetchWithDetails(cid, parseAs, controller)
      ),
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
    addContent: async (content: string | File) =>
      getIpfsNode().then((node) => node.addContent(content)),
  };

  return { ipfsInstance$, ipfsQueue, api };
};

export type IpfsApi = ReturnType<typeof createIpfsApi>['api'];

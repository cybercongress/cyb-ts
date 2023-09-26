/* eslint-disable import/no-unused-modules */
import { multiaddr } from '@multiformats/multiaddr';
import { concat as uint8ArrayConcat } from 'uint8arrays/concat';
import { toString as uint8ArrayToAsciiString } from 'uint8arrays/to-string';

import { Option } from 'src/types';
import {
  getIpfsUserGatewanAndNodeType,
  IPFSContentMaybe,
  IPFSContentMeta,
  CallBackFuncStatus,
  IpfsContentSource,
  AppIPFS,
} from './ipfs.d';

import {
  toReadableStreamWithMime,
  getMimeFromUint8Array,
} from './stream-utils';

import { getIpfsContentFromDb, addIpfsContentToDb } from './db-utils';
import { convertTimeToMilliseconds } from '../helpers';
import { addToIpfsCluster } from './cluster-utils';
import { contentToUint8Array } from './content-utils';

// import { CYBER } from '../config';

// TODO: fix to get working inside web worker, REFACTOR
const CYBER_GATEWAY = 'https://gateway.ipfs.cybernode.ai';

const FILE_SIZE_DOWNLOAD = 20 * 10 ** 6;

const getTextPreview = (firstChunk: Uint8Array | undefined, mime?: string) => {
  return firstChunk && mime && mime === 'text/plain'
    ? uint8ArrayToAsciiString(firstChunk).slice(0, 150)
    : undefined;
};
// Get IPFS node from local storage
// TODO: refactor
const getIpfsUserGatewanAndNode = (): getIpfsUserGatewanAndNodeType => {
  const LS_IPFS_STATE = localStorage.getItem('ipfsState');

  if (LS_IPFS_STATE !== null) {
    const lsTypeIpfsData = JSON.parse(LS_IPFS_STATE);
    if (lsTypeIpfsData?.userGateway) {
      const { userGateway, ipfsNodeType } = lsTypeIpfsData;
      return { userGateway, ipfsNodeType };
    }
  }

  return { ipfsNodeType: undefined, userGateway: undefined };
};

// Get data by CID from local storage
const loadIPFSContentFromDb = async (
  cid: string
): Promise<IPFSContentMaybe> => {
  // TODO: enable, disabled for tests
  // return undefined;

  // TODO: use cursor
  const data = await getIpfsContentFromDb(cid);
  if (data && data.length) {
    // TODO: use cursor
    const mime = await getMimeFromUint8Array(data);
    const textPreview = getTextPreview(data, mime);

    const meta: IPFSContentMeta = {
      type: 'file', // dir support ?
      size: data.length,
      sizeLocal: data.length,
      mime,
    };
    return { result: data, cid, meta, source: 'db', textPreview };
  }

  return undefined;
};

const emptyMeta: IPFSContentMeta = {
  type: 'file',
  size: -1,
  local: undefined,
  sizeLocal: -1,
};

const fetchIPFSContentMeta = async (
  node: AppIPFS | undefined | null,
  cid: string,
  signal?: AbortSignal
): Promise<IPFSContentMeta> => {
  if (node) {
    const path = `/ipfs/${cid}`;

    const { type, size, sizeLocal, local, blocks } = await node.files.stat(
      path,
      {
        signal,
        withLocal: true,
        size: true,
      }
    );
    return {
      type,
      size: size || -1,
      sizeLocal: sizeLocal || -1,
      local,
      blocks,
    };
  }
  return emptyMeta;
};

const fetchIPFSContentFromNode = async (
  node: AppIPFS | undefined | null,
  cid: string,
  controller?: AbortController
): Promise<IPFSContentMaybe> => {
  const controllerLegacy = controller || new AbortController();
  const { signal } = controllerLegacy;
  let timer: NodeJS.Timeout | undefined;

  if (!node) {
    console.log('--------fetchIPFSContentFromNode NO NODE INTIALIZED--------');
    return undefined;
  }

  if (!controller) {
    timer = setTimeout(() => {
      controllerLegacy.abort();
    }, 1000 * 60 * 1);
  } // 1 min

  // TODO: cover ipns case
  const path = `/ipfs/${cid}`;

  try {
    // const stat = await node.files.stat(path, { signal });
    const startTime = Date.now();
    const meta = await fetchIPFSContentMeta(node, cid, signal);
    const statsDoneTime = Date.now();
    meta.statsTime = statsDoneTime - startTime;
    const allowedSize = meta.size < FILE_SIZE_DOWNLOAD;
    timer && clearTimeout(timer);

    switch (meta.type) {
      case 'directory': {
        // TODO: return directory structure
        return { cid, availableDownload: true, source: 'node', meta };
      }
      default: {
        // Get sample of content
        const { value: firstChunk, done } = await node
          .cat(path, { signal, length: 2048, offset: 0 })
          [Symbol.asyncIterator]()
          .next();

        const mime = await getMimeFromUint8Array(firstChunk);
        const fullyDownloaded =
          meta.size > -1 || firstChunk.length >= meta.size;

        const textPreview = getTextPreview(firstChunk, mime);

        // If all content fits in first chunk return byte-array instead iterable
        const stream = fullyDownloaded
          ? firstChunk
          : allowedSize
          ? node.cat(path, { signal })
          : undefined;

        meta.catTime = Date.now() - statsDoneTime;

        // TODO: add to db flag that content is pinned TO local node
        // if already pinned skip pin
        if (!meta.local && allowedSize) {
          node.pin.add(cid);

          meta.pinTime = Date.now() - meta.catTime;
        } else {
          meta.pinTime = -1;
        }

        return {
          result: stream,
          textPreview,
          cid,
          meta: { ...meta, mime },
          source: 'node',
        };
        // }
      }
    }
  } catch (error) {
    console.log('error fetch stat', error);
    return { cid, availableDownload: true, source: 'node', meta: emptyMeta };
  }
};

const fetchIPFSContentFromGateway = async (
  node: AppIPFS | undefined | null,
  cid: string,
  controller?: AbortController
): Promise<IPFSContentMaybe> => {
  // TODO: Should we use Cyber Gateway?
  // const { userGateway } = getIpfsUserGatewanAndNode();

  // fetch META only from external node(toooo slow), TODO: fetch meta from cybernode
  const isExternalNode = node?.nodeType === 'external';
  const meta = isExternalNode
    ? await fetchIPFSContentMeta(node, cid, controller?.signal)
    : emptyMeta;

  const contentUrl = `${CYBER_GATEWAY}/ipfs/${cid}`;
  const response = await fetch(contentUrl, {
    method: 'GET',
    signal: controller?.signal,
  });

  if (response && response.body) {
    // fetch doesn't provide any headers in our case :(

    // const contentLength = parseInt(
    //   response.headers['content-length'] || '-1',
    //   10
    // );
    // const contentType = response.headers['content-type'];

    // Extract meta if ipfs prob/node not started yet
    // if (!meta.mime) {
    //   meta = { ...meta, mime: contentType };
    // }

    // TODO: fix
    const flushResults = (chunks, mime) =>
      !isExternalNode
        ? addIpfsContentToDb(cid, uint8ArrayConcat(chunks))
        : Promise.resolve();

    const { mime, result, firstChunk } = await toReadableStreamWithMime(
      response.body,
      flushResults
    );

    const textPreview = getTextPreview(firstChunk, mime);
    return {
      cid,
      textPreview,
      meta: { ...meta, mime },
      result,
      source: 'gateway',
      contentUrl,
    };
  }

  return undefined;
};

type fetchContentOptions = {
  controller?: AbortController;
  node?: AppIPFS;
};

async function fetchIpfsContent<T>(
  cid: string,
  source: IpfsContentSource,
  options: fetchContentOptions
): Promise<T | undefined> {
  const { node, controller } = options;

  try {
    switch (source) {
      case 'db':
        return loadIPFSContentFromDb(cid) as T;
      case 'node':
        return fetchIPFSContentFromNode(node, cid, controller) as T;
      case 'gateway':
        return fetchIPFSContentFromGateway(node, cid, controller) as T;
      default:
        return undefined;
    }
  } catch (e) {
    console.log('----fetchIpfsContent error', e);
    return undefined;
  }
}

const getIPFSContent = async (
  node: AppIPFS | null,
  cid: string,
  controller?: AbortController,
  callBackFuncStatus?: CallBackFuncStatus
): Promise<IPFSContentMaybe> => {
  const dataRsponseDb = await loadIPFSContentFromDb(cid);
  if (dataRsponseDb !== undefined) {
    return dataRsponseDb;
  }

  if (node) {
    callBackFuncStatus && callBackFuncStatus('trying to get with a node');
    // console.log('----Fetch from node', cid);
    const ipfsContent = await fetchIPFSContentFromNode(node, cid, controller);

    return ipfsContent;
  }

  callBackFuncStatus && callBackFuncStatus('trying to get with a gatway');
  // console.log('----Fetch from gateway', cid);
  const respnseGateway = await fetchIPFSContentFromGateway(
    node,
    cid,
    controller
  );

  return respnseGateway;
};

const catIPFSContentFromNode = (
  node: AppIPFS,
  cid: string,
  offset: number,
  controller?: AbortController
): AsyncIterable<Uint8Array> | undefined => {
  if (!node) {
    console.log(
      '--------fetchIPFSContentFromNode NO NODE INTIALIZED TODO: cover case--------'
    );
    return undefined;
  }

  // TODO: cover ipns case
  const path = `/ipfs/${cid}`;

  return node.cat(path, { offset, signal: controller?.signal });
};

// const nodeContentFindProvs = async (
//   node: AppIPFS,
//   cid: string,
//   offset: number,
//   controller?: AbortController
// ): AsyncIterable<number> | undefined => {
//   if (!node) {
//     console.log(
//       '--------fetchIPFSContentFromNode NO NODE INTIALIZED TODO: cover case--------'
//     );
//     return undefined;
//   }

//   // TODO: cover ipns case
//   const path = `/ipfs/${cid}`;

//   const providers = node.dht.findProvs(path, {
//     signal: controller?.signal,
//   });

//   let count = 0;
//   for await (const provider of providers) {
//     //  console.log(provider.id.toString())
//     //  id: PeerId
//     // multiaddrs: Multiaddr[]
//     // protocols: string[]
//     count++;
//   }

//   return count;
// };

const addContenToIpfs = async (
  node: AppIPFS,
  content: File | string
): Promise<Option<string>> => {
  // let arrayBuffer: Buffer | ArrayBuffer | undefined;
  let addResult;
  if (node) {
    addResult = await node.add(content, { pin: true });
  }
  const pinResponse = await addToIpfsCluster(content);

  const cid = addResult?.path || pinResponse?.cid;

  await addIpfsContentToDb(cid, await contentToUint8Array(content));

  return cid;
};

const CYBER_NODE_SWARM_PEER_ID =
  'QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB';
const CYBERNODE_SWARM_ADDR_WSS =
  '/dns4/swarm.io.cybernode.ai/tcp/443/wss/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB';

const CYBERNODE_SWARM_ADDR_TCP =
  '/ip4/88.99.105.146/tcp/4001/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB';
// '/dns4/swarm.io.cybernode.ai/tcp/4001/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB';

const connectToSwarm = async (node, address) => {
  const multiaddrSwarm = multiaddr(address);
  // console.log(`Connecting to swarm ${address}`, node);
  await node.bootstrap.add(multiaddrSwarm);

  node?.swarm
    .connect(multiaddrSwarm)
    .then((resp) => {
      console.log(`Welcome to swarm ${address} 🐝🐝🐝`);
      // node.swarm.peers().then((peers) => console.log('---peeers', peers));
    })
    .catch((err) => {
      console.log(
        'Error object properties:',
        Object.getOwnPropertyNames(err),
        err.stack,
        err.errors,
        err.message
      );
      console.log(`Can't connect to swarm ${address}: ${err.message}`);
    });
};

// const connectToCyberSwarm = async (node: AppIPFS) => {
//   const cyberNodeAddr =
//     node.nodeType === 'embedded'
//       ? CYBERNODE_SWARM_ADDR_WSS
//       : CYBERNODE_SWARM_ADDR_TCP;
//   await connectToSwarm(node, cyberNodeAddr);
// };

const reconnectToCyberSwarm = async (node?: AppIPFS, lastCallTime: number) => {
  if (!node) {
    return;
  }

  const cyberNodeAddr =
    node.nodeType === 'embedded'
      ? CYBERNODE_SWARM_ADDR_WSS
      : CYBERNODE_SWARM_ADDR_TCP;
  const peers = await node.swarm.peers();

  // console.log('autoDialTime', await getNodeAutoDialInterval(node));
  // console.log('lastCallTime', lastCallTime, Date.now() - lastCallTime);
  const isConnected =
    Date.now() - lastCallTime < node.connMgrGracePeriod ||
    peers.find((p) => p.peer.toString() === CYBER_NODE_SWARM_PEER_ID);

  // console.log('---isConnected', true, peers.length);

  if (!isConnected) {
    await connectToSwarm(node, cyberNodeAddr);
  }
};

const DEFAULT_AUTO_DIAL_INTERVAL = 10000;
const GET_CONFIG_TIMEOUT = 3000;

const getNodeAutoDialInterval = async (node: AppIPFS) => {
  try {
    const autoDialTime = convertTimeToMilliseconds(
      ((await node.config.get('Swarm.ConnMgr.GracePeriod', {
        timeout: GET_CONFIG_TIMEOUT,
      })) as string) || DEFAULT_AUTO_DIAL_INTERVAL
    );

    return autoDialTime;
  } catch {
    return DEFAULT_AUTO_DIAL_INTERVAL;
  }
};

const getIpfsGatewayUrl = async (node: AppIPFS, cid: string) => {
  if (node.nodeType === 'embedded') {
    return `${CYBER_GATEWAY}/ipfs/${cid}`;
  }

  const response = await node.config.get('Addresses.Gateway');
  const address = multiaddr(response).nodeAddress();

  try {
    return `http://${address.address}:${address.port}/ipfs/${cid}`;
  } catch (error) {
    return `${CYBER_GATEWAY}/ipfs/${cid}`;
  }
};

export {
  getIPFSContent,
  getIpfsUserGatewanAndNode,
  catIPFSContentFromNode,
  fetchIpfsContent,
  addContenToIpfs,
  reconnectToCyberSwarm,
  getIpfsGatewayUrl,
  getNodeAutoDialInterval,
};

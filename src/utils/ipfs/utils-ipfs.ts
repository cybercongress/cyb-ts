/* eslint-disable import/no-unused-modules */
import { multiaddr } from '@multiformats/multiaddr';
import { concat as uint8ArrayConcat } from 'uint8arrays/concat';

import { AddResult } from 'kubo-rpc-client/types';

import { ImportCandidate } from 'ipfs-core-types/src/utils';
import { Option } from 'src/types';
import {
  IPFSContentMaybe,
  IPFSContentMeta,
  CallBackFuncStatus,
  IpfsContentSource,
  AppIPFS,
  IPFSContent,
} from './ipfs.d';

import {
  toReadableStreamWithMime,
  getMimeFromUint8Array,
} from './stream-utils';

import { CYBER } from '../config';

// import { addDataChunksToIpfsCluster, pinToIpfsCluster } from './cluster-utils';
import { getIpfsContentFromDb, addIpfsContentToDb } from './db-utils';
import { addDataChunksToIpfsCluster } from './cluster-utils';
import { detectCybContentType, parseRawIpfsData } from './content-utils';

const FILE_SIZE_DOWNLOAD = 20 * 10 ** 6;

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
    const chunk = data.slice(0, 2048);
    const mime = await getMimeFromUint8Array(chunk);
    const contentType = detectCybContentType(mime, chunk);

    const meta: IPFSContentMeta = {
      // type: 'file', // dir support ?
      size: data.length,
      mime,
    };
    return { result: data, cid, meta, source: 'db', contentType };
  }

  return undefined;
};

const emptyMeta: IPFSContentMeta = {
  size: -1,
  local: undefined,
};

const fetchIPFSContentMeta = async (
  node: AppIPFS | undefined | null,
  cid: string,
  signal?: AbortSignal
): Promise<IPFSContentMeta> => {
  if (node) {
    const path = `/ipfs/${cid}`;

    const { type, size, local, blocks } = await node.files.stat(path, {
      signal,
      withLocal: true,
      size: true,
    });
    return {
      type,
      size: size || -1,
      local,
      blocks,
    };
  }
  return emptyMeta;
};

const fetchIPFSContentMetaFromGateway = async (
  contentUrl: string,
  controller?: AbortController
): Promise<IPFSContentMeta> => {
  try {
    const response = await fetch(contentUrl, {
      method: 'HEAD',
      signal: controller?.signal,
    });
    // 'cache-control', 'content-length', 'content-type', 'x-ipfs-path', 'x-ipfs-roots'
    return {
      // type: 'file',
      mime: response.headers.get('content-type') || undefined,
      size: parseInt(response.headers.get('content-length') || '-1', 10),
    };
  } catch (e) {
    console.error('fetchIPFSContentMetaFromGateway error', e, contentUrl);
    return emptyMeta;
  }
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
        return {
          cid,
          availableDownload: false,
          source: 'node',
          meta,
          contentType: 'directory',
        };
      }
      default: {
        // Get sample of content
        const { value: firstChunk, done } = await node
          .cat(path, { signal, length: 2048, offset: 0 })
          [Symbol.asyncIterator]()
          .next();

        const mime = await getMimeFromUint8Array(firstChunk);
        const fullyDownloaded =
          meta.size !== -1 && firstChunk.length >= meta.size;

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

        const contentType = detectCybContentType(mime, firstChunk);

        return {
          result: stream,
          cid,
          meta: { ...meta, mime },
          source: 'node',
          contentType,
        };
        // }
      }
    }
  } catch (error) {
    console.log('error fetch stat', error);
    return {
      cid,
      availableDownload: true,
      source: 'node',
      meta: emptyMeta,
      contentType: 'unknown',
    };
  }
};

const fetchIPFSContentFromGateway = async (
  node: AppIPFS | undefined | null,
  cid: string,
  controller?: AbortController
): Promise<IPFSContentMaybe> => {
  // fetch META only from external node(toooo slow), TODO: fetch meta from cybernode
  const isExternalNode = node?.nodeType === 'external';
  const contentUrl = `${CYBER.CYBER_GATEWAY}/ipfs/${cid}`;

  // const meta = isExternalNode
  //   ? await fetchIPFSContentMeta(node, cid, controller?.signal)
  //   : await fetchIPFSContentMetaFromGateway(contentUrl, controller);

  const response = await fetch(contentUrl, {
    method: 'GET',
    signal: controller?.signal,
  });

  if (response && response.body) {
    const meta = {
      mime: response.headers.get('content-type') || undefined,
      size: parseInt(response.headers.get('content-length') || '-1', 10),
    };

    // TODO: fix
    const flushResults = (chunks, mime) =>
      !isExternalNode
        ? addIpfsContentToDb(cid, uint8ArrayConcat(chunks))
        : Promise.resolve();

    const { mime, result, firstChunk } = await toReadableStreamWithMime(
      response.body,
      flushResults
    );
    const contentType = detectCybContentType(mime, firstChunk);

    const fullyDownloaded =
      meta.size !== -1 && firstChunk && firstChunk.length >= meta.size;

    // If all content fits in first chunk return byte-array instead ReadableStream
    const stream = fullyDownloaded ? firstChunk : result;

    return {
      cid,
      meta: { ...meta, mime },
      result: stream,
      source: 'gateway',
      contentUrl,
      contentType,
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
  let promise;
  try {
    switch (source) {
      case 'db':
        promise = loadIPFSContentFromDb(cid) as T;
        break;
      case 'node':
        promise = fetchIPFSContentFromNode(node, cid, controller) as T;
        break;
      case 'gateway':
        promise = fetchIPFSContentFromGateway(node, cid, controller) as T;
        break;
      default:
        return undefined;
    }
    const content = (await promise) as IPFSContent;

    return content;
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
  content: ImportCandidate
): Promise<Option<string>> => {
  let cid: AddResult;
  let arrayBuffer: Buffer | ArrayBuffer | undefined;

  if (node) {
    if (typeof content === 'string') {
      cid = await node.add(Buffer.from(content), { pin: true });
      arrayBuffer = Buffer.from(content);
    } else {
      cid = await node.add(content, { pin: true });
      if (content instanceof File) {
        arrayBuffer = await content.arrayBuffer();
      }
    }

    if (arrayBuffer) {
      const raw = new Uint8Array(arrayBuffer);
      const result = await addDataChunksToIpfsCluster(
        cid.cid.toString(),
        raw,
        node.nodeType === 'embedded'
      );

      console.log('result', result);
    }
    return cid.path;
  }
  return undefined;
};

const CYBER_NODE_SWARM_PEER_ID =
  'QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB';
const CYBERNODE_SWARM_ADDR_WSS =
  '/dns4/swarm.io.cybernode.ai/tcp/443/wss/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB';

const CYBERNODE_SWARM_ADDR_TCP =
  '/ip4/88.99.105.146/tcp/4001/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB';
// '/dns4/swarm.io.cybernode.ai/tcp/4001/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB';

const connectToSwarm = async (node: AppIPFS, address: string) => {
  const multiaddrSwarm = multiaddr(address);
  // console.log(`Connecting to swarm ${address}`, node);
  await node.bootstrap.add(multiaddrSwarm);

  node?.swarm
    .connect(multiaddrSwarm)
    .then(() => {
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

const reconnectToCyberSwarm = async (node?: AppIPFS, lastCallTime?: number) => {
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
    !lastCallTime ||
    Date.now() - lastCallTime < node.swarmConnTimeout ||
    peers.find((p) => p.peer.toString() === CYBER_NODE_SWARM_PEER_ID);

  // console.log('---isConnected', true, peers.length);

  if (!isConnected) {
    await connectToSwarm(node, cyberNodeAddr);
  }
};

const DEFAULT_AUTO_DIAL_INTERVAL = 20000;
const GET_CONFIG_TIMEOUT = 3000;
const IPFS_CONFIG_SWARM_CONN_TIMEOUT = 'Swarm.ConnMgr.GracePeriod';
const IPFS_CONFIG_GATEWAY_URL = 'Addresses.Gateway';

const getIpfsConfigSwarmConnTimeout = async (node: AppIPFS) =>
  getIpfsConfig(
    node,
    IPFS_CONFIG_SWARM_CONN_TIMEOUT,
    DEFAULT_AUTO_DIAL_INTERVAL
  );

const getIpfsConfigGatewayAddr = async (node: AppIPFS) =>
  getIpfsConfig(node, IPFS_CONFIG_GATEWAY_URL);

const getIpfsConfig = async (
  node: AppIPFS,
  name: string,
  defaultValue?: string | number
) => {
  try {
    const response = await node.config.get(name, {
      timeout: GET_CONFIG_TIMEOUT,
    });
    return response;
  } catch (error) {
    return defaultValue;
  }
};

const getIpfsGatewayUrl = async (node?: AppIPFS, cid: string) => {
  if (!node || node.nodeType === 'embedded') {
    return `${CYBER.CYBER_GATEWAY}/ipfs/${cid}`;
  }

  try {
    const address = multiaddr(node.gatewayAddr).nodeAddress();
    return `http://${address.address}:${address.port}/ipfs/${cid}`;
  } catch (error) {
    return `${CYBER.CYBER_GATEWAY}/ipfs/${cid}`;
  }
};

export {
  getIPFSContent,
  catIPFSContentFromNode,
  fetchIpfsContent,
  addContenToIpfs,
  reconnectToCyberSwarm,
  getIpfsGatewayUrl,
  getIpfsConfigSwarmConnTimeout,
  getIpfsConfigGatewayAddr,
};

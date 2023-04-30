/* eslint-disable import/no-unused-modules */
import { IPFS, IPFSPath } from 'kubo-rpc-client/types';

import {
  getIpfsUserGatewanAndNodeType,
  IPFSContentMaybe,
  IPFSContentMeta,
  CallBackFuncStatus,
  IpfsContentSource,
} from './ipfs.d';

import {
  asyncGeneratorToReadableStream,
  toReadableStreamWithMime,
  getMimeFromUint8Array,
  toAsyncIterableWithMime,
} from './stream-utils';

import { CYBER } from '../config';

import { addDataChunksToIpfsCluster } from './cluster-utils';
import { getIpfsContentFromDb } from './db-utils';

// import RestIpfsNode from './restIpfsNode';

const FILE_SIZE_DOWNLOAD = 15 * 10 ** 6;

// Get IPFS node from local storage
// TODO: refactor
const getIpfsUserGatewanAndNodeType = (): getIpfsUserGatewanAndNodeType => {
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
  cid: IPFSPath
): Promise<IPFSContentMaybe> => {
  // TODO: use cursor
  const data = await getIpfsContentFromDb(cid.toString());
  if (data && data.length) {
    // TODO: use cursor
    const mime = await getMimeFromUint8Array(data);
    // const { mime, data: stream } = await arrayToReadableStream(data);

    const meta: IPFSContentMeta = {
      type: 'file', // dir support ?
      size: data.length,
      mime,
    };
    return { result: data, cid, meta, source: 'db' };
  }

  return undefined;
};

const emptyMeta: IPFSContentMeta = {
  type: 'file',
  size: -1,
  local: undefined,
};
const fetchIPFSContentMeta = async (
  node: IPFS | undefined | null,
  cid: IPFSPath,
  signal?: AbortSignal
): Promise<IPFSContentMeta> => {
  if (node) {
    const path = `/ipfs/${cid}`;

    const { type, size, local, blocks } = await node.files.stat(path, {
      signal,
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

const fetchIPFSContentFromNode = async (
  node: IPFS | undefined | null,
  cid: IPFSPath,
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
    const meta = await fetchIPFSContentMeta(node, cid, signal);

    timer && clearTimeout(timer);

    switch (meta.type) {
      case 'directory': {
        // TODO: return directory structure
        return { cid, availableDownload: true, source: 'node', meta };
      }
      default: {
        // if (!meta.size || meta.size < FILE_SIZE_DOWNLOAD) {
        const flushResults = (chunks, mime) =>
          addDataChunksToIpfsCluster(cid, chunks, mime);

        const { mime, result: stream } = await toAsyncIterableWithMime(
          node.cat(path, { signal }),
          flushResults
        );

        console.log('------ fetch node', meta, stream, mime);

        return { result: stream, cid, meta: { ...meta, mime }, source: 'node' };
        // }
      }
    }
  } catch (error) {
    console.log('error fetch stat', error);
    return { cid, availableDownload: true, source: 'node', meta: emptyMeta };
  }
};

const fetchIPFSContentFromGateway = async (
  node: IPFS | undefined | null,
  cid: string,
  controller?: AbortController
): Promise<IPFSContentMaybe> => {
  // TODO: Should we use Cyber Gateway?
  // const { userGateway } = getIpfsUserGatewanAndNodeType();

  // console.log('-----fetch gateway', node);
  // let meta: IPFSContentMeta | undefined;
  // if (node) {
  //   // const stat = await node.files.stat(path, { signal: controller?.signal });

  //   // console.log('headResponse meta', meta);
  // }
  const meta = await fetchIPFSContentMeta(node, cid, controller?.signal);
  const contentUrl = `${CYBER.CYBER_GATEWAY}/ipfs/${cid}`;
  const response = await fetch(contentUrl, {
    method: 'GET',
    signal: controller?.signal,
  });

  if (response && response.body) {
    // fetch don't provide any headers

    // const contentLength = parseInt(
    //   response.headers['content-length'] || '-1',
    //   10
    // );
    // const contentType = response.headers['content-type'];

    // Extract meta if ipfs prob/node not started yet
    // if (!meta.mime) {
    //   meta = { ...meta, mime: contentType };
    // }

    const flushResults = (chunks, mime) =>
      addDataChunksToIpfsCluster(cid, chunks, mime);

    const { mime, result } = await toReadableStreamWithMime(
      response.body,
      flushResults
    );

    // pin to local ipfs node
    // TODO: use node?.add to add to node, move to separate func
    node?.pin?.add(cid);

    return {
      cid,
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
  node?: IPFS;
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
  node: IPFS,
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
  node: IPFS | undefined | null,
  cid: IPFSPath,
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

export {
  getIPFSContent,
  getIpfsUserGatewanAndNodeType,
  catIPFSContentFromNode,
  fetchIpfsContent
};

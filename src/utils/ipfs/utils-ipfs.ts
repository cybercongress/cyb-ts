/* eslint-disable import/no-unused-modules */
import axios from 'axios';

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
  arrayToReadableStream,
  readableStreamToAsyncGenerator,
} from './stream-utils';

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
    const { mime, stream } = await arrayToReadableStream(data);

    const meta: IPFSContentMeta = {
      type: 'file', // dir support ?
      size: data.length,
      mime,
    };

    return { stream, cid, meta };
  }
  return undefined;
};

const fetchIPFSContentFromNode = async (
  node: IPFS,
  cid: IPFSPath,
  controller?: AbortController
): Promise<IPFSContentMaybe> => {
  const controllerLegacy = controller || new AbortController();
  const { signal } = controllerLegacy;
  let timer: NodeJS.Timeout | undefined;
  if (!controller) {
    timer = setTimeout(() => {
      controllerLegacy.abort();
    }, 1000 * 60 * 1);
  } // 1 min

  // TODO: cover ipns case
  const path = `/ipfs/${cid}`;

  try {
    const stat = await node.files.stat(path, { signal });

    timer && clearTimeout(timer);

    switch (stat.type) {
      case 'directory': {
        // TODO: return directory structure
        return { cid, availableDownload: true };
      }
      default: {
        if (!stat.size || stat.size < FILE_SIZE_DOWNLOAD) {
          const { mime, stream } = await asyncGeneratorToReadableStream(
            node.cat(path),node.id()
            (chunks, mime) => addDataChunksToIpfsCluster(cid, chunks, mime)
          );
          const meta: IPFSContentMeta = {
            type: stat.type,
            size: stat.size || -1,
            mime,
          };

          return { stream, cid, meta };
        }
      }
    }

    return { cid, availableDownload: true };
  } catch (error) {
    console.log('error fetch stat', error);
    return undefined;
  }
};

const fetchIPFSContentFromGateway = async (
  node: IPFS,
  cid: string,
  controller?: AbortController
): Promise<IPFSContentMaybe> => {
  // TODO: Should we use Cyber Gateway?
  const { userGateway } = getIpfsUserGatewanAndNodeType();

  const response = await axios.get(`${userGateway}/ipfs/${cid}`, {
    signal: controller?.signal,
    responseType: 'stream',
  });

  if (response) {
    const contentLength = parseInt(
      response.headers['content-length'] || '-1',
      10
    );

    const isReadableStream = typeof response.data.read === 'function';

    // In case if axios return cached value,
    // convert it to buffer->readablestream
    const { mime, stream } = await (isReadableStream
      ? asyncGeneratorToReadableStream(
          readableStreamToAsyncGenerator(response.data),
          (chunks, mime) => addDataChunksToIpfsCluster(cid, chunks, mime, true)
        )
      : arrayToReadableStream(Buffer.from(response.data)));

    // pin to local ipfs node
    node?.pin?.add(cid);

    const meta: IPFSContentMeta = {
      type: 'file', // TODO: can be directory?
      size: contentLength,
      mime,
    };

    return {
      stream,
      cid,
      meta,
    };
  }

  return undefined;
};

type fetchContentOptions = {
  controller?: AbortController;
  node?: IPFS;
};

export async function fetchIpfsContent<T>(
  cid: string,
  source: IpfsContentSource,
  options: fetchContentOptions
): Promise<T | undefined> {
  const { node, controller } = options;
  switch (source) {
    case 'db':
      return loadIPFSContentFromDb(cid) as T;
    case 'node':
    case 'gateway':
      if (node) {
        return source === 'gateway'
          ? (fetchIPFSContentFromGateway(node, cid, controller) as T)
          : (fetchIPFSContentFromNode(node, cid, controller) as T);
      }
      return undefined;
    default:
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
    console.log('----Fetch from node', cid);
    const ipfsContent = await fetchIPFSContentFromNode(node, cid, controller);

    return ipfsContent;
  }

  callBackFuncStatus && callBackFuncStatus('trying to get with a gatway');
  console.log('----Fetch from gateway', cid);
  const respnseGateway = await fetchIPFSContentFromGateway(
    node,
    cid,
    controller
  );

  return respnseGateway;
};

export { getIPFSContent, getIpfsUserGatewanAndNodeType };

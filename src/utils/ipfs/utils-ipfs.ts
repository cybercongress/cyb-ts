import axios from 'axios';

import { IPFS, IPFSPath } from 'kubo-rpc-client/types';

import {
  getIpfsUserGatewanAndNodeType,
  IPFSContentMaybe,
  IPFSContentMeta,
  CallBackFuncStatus,
} from './ipfs.d';

import db from '../../db';

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

// const toUint8ArrayWithMime = async (
//   source: AsyncIterable<Uint8Array>
// ): Promise<Uint8ArrayWithMime> => {
//   const iterator = source[Symbol.asyncIterator]();
//   const firstChunk = await iterator.next();
//   const chunks: Array<Uint8Array> = [firstChunk.value];
//   const mime = await getUint8ArrayMime(firstChunk.value);

//   // TODO: should be wrapped as ReadableStream
//   // eslint-disable-next-line no-restricted-syntax
//   for await (const chunk of source) {
//     chunks.push(chunk);
//   }

//   return { mime, rawData: uint8ArrayConcat(chunks) };
// };

// Get data by CID from local storage
const loadIPFSContentFromDb = async (
  cid: IPFSPath
): Promise<IPFSContentMaybe> => {
  // TODO: use cursor
  const data = await getIpfsContentFromDb(cid.toString());

  if (data) {
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
        // return await fetchIPFSFile(ipfs, path);

        if (!stat.size || stat.size < FILE_SIZE_DOWNLOAD) {
          const { mime, stream } = await asyncGeneratorToReadableStream(
            node.cat(path),
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
  userGateway?: string | undefined,
  controller?: AbortController
): Promise<IPFSContentMaybe> => {
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

    // In case if axios return cached value convert it to buffer->readablestream
    const { mime, stream } = await (isReadableStream
      ? asyncGeneratorToReadableStream(
          readableStreamToAsyncGenerator(response.data),
          (chunks, mime) => addDataChunksToIpfsCluster(cid, chunks, mime, true)
        )
      : arrayToReadableStream(Buffer.from(response.data)));

    node?.pin?.add(cid); // pin to local ipfs node

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

    const ipfsContent = await fetchIPFSContentFromNode(node, cid, controller);

    return ipfsContent;
  }

  callBackFuncStatus && callBackFuncStatus('trying to get with a gatway');
  console.log('----Fetch from gateway', cid);
  const { userGateway } = getIpfsUserGatewanAndNodeType();
  const respnseGateway = await fetchIPFSContentFromGateway(
    node,
    cid,
    userGateway,
    controller
  );

  return respnseGateway;
};

export { getIPFSContent, getIpfsUserGatewanAndNodeType };

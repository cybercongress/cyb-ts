/* eslint-disable import/no-unused-modules */
import axios from 'axios';
import { fromString } from 'uint8arrays/from-string';

import { IPFS, IPFSPath } from 'kubo-rpc-client/types';

import {
  getIpfsUserGatewanAndNodeType,
  IPFSContentMaybe,
  IPFSContentMeta,
  CallBackFuncStatus,
  IpfsContentSource,
  IPFSContent,
} from './ipfs.d';

import {
  asyncGeneratorToReadableStream,
  readableStreamToAsyncGenerator,
  toReadableStreamWithMime,
  getMimeFromUint8Array,
} from './stream-utils';

import { CYBER } from '../config';

import { addDataChunksToIpfsCluster } from './cluster-utils';
import { getIpfsContentFromDb } from './db-utils';
import all from 'it-all';

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
    return { result: data, cid, meta };
  }

  return undefined;
};

const fetchIPFSContentFromNode = async (
  node?: IPFS,
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
    const stat = await node.files.stat(path, { signal });

    timer && clearTimeout(timer);

    switch (stat.type) {
      case 'directory': {
        // TODO: return directory structure
        return { cid, availableDownload: true };
      }
      default: {
        if (!stat.size || stat.size < FILE_SIZE_DOWNLOAD) {
          const { mime, result: stream } = await asyncGeneratorToReadableStream(
            node.cat(path, { signal }),
            (chunks, mime) => addDataChunksToIpfsCluster(cid, chunks, mime)
          );

          console.log('------ fetch node', mime, stream);

          const meta: IPFSContentMeta = {
            type: stat.type,
            size: stat.size || -1,
            mime,
          };

          return { result: stream, cid, meta };
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
  node?: IPFS,
  cid: string,
  controller?: AbortController
): Promise<IPFSContentMaybe> => {
  // TODO: Should we use Cyber Gateway?
  // const { userGateway } = getIpfsUserGatewanAndNodeType();

  // const response = await axios.get(`${CYBER.CYBER_GATEWAY}/ipfs/${cid}`, {
  //   signal: controller?.signal,
  //   responseType: 'stream', // TODO: tmp disabled //arraybuffer
  // });

  const response = await fetch(`${CYBER.CYBER_GATEWAY}/ipfs/${cid}`, {
    method: 'GET',
    signal: controller?.signal,
  });

  if (response && response.body) {
    const contentLength = parseInt(
      response.headers['content-length'] || '-1',
      10
    );
    const contentType = response.headers['content-type'];
    const meta: IPFSContentMeta = {
      type: 'file', // TODO: can be directory?
      size: contentLength,
      mime: contentType,
    };

    const { mime, result } = await toReadableStreamWithMime(
      response.body,
      (chunks, mime) => addDataChunksToIpfsCluster(cid, chunks, mime)
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    meta.mime = mime;
    // fetchResult.result = result;

    //
    // const isReadableStream = typeof response.data.read === 'function';
    // console.log('----fetchIPFSContentFromGateway', response, isReadableStream);

    // // In case if axios return cached value,
    // // convert it to buffer->readablestream
    // if (isReadableStream) {
    //   const { mime, result: data } = await asyncGeneratorToReadableStream(
    //     readableStreamToAsyncGenerator(response.data),
    //     (chunks, mime) => addDataChunksToIpfsCluster(cid, chunks, mime, true)
    //   );
    //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //   // fetchResult.meta.mime = mime;
    //   fetchResult.result = data;
    // } else {
    //   // const uint8Array = new TextEncoder().encode(response.data);
    //   // const uint8Array = new Blob([response.data], {
    //   //   type: contentType,
    //   // });
    //   console.log(
    //     '----fetchResult1',
    //     fetchResult,
    //     new TextEncoder().encode(response.data),
    //     new Uint8Array(
    //       await new Blob([response.data], { type: contentType }).arrayBuffer()
    //     )
    //   );
    //   fetchResult.result = new Uint8Array(
    //     await new Blob([response.data], { type: contentType }).arrayBuffer()
    //   );
    // }

    // pin to local ipfs node
    node?.pin?.add(cid);

    return { cid, meta, result };
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

export { getIPFSContent, getIpfsUserGatewanAndNodeType };

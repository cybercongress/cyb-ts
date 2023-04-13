import axios from 'axios';
import { Cluster } from '@nftstorage/ipfs-cluster';

import { $TsFixMe } from 'src/types/tsfix';
import { IPFS, IPFSPath } from 'kubo-rpc-client/types';

import {
  AddResponse,
  PinResponse,
} from '@nftstorage/ipfs-cluster/dist/src/interface';

import {
  getIpfsUserGatewanAndNodeType,
  IPFSContentMaybe,
  IPFSContentMeta,
  IPFSMaybe,
  CallBackFuncStatus,
} from './ipfs.d';

import db from '../../db';

import {
  asyncGeneratorToReadableStream,
  arrayToReadableStream,
  readableStreamToAsyncGenerator,
} from './stream-utils';

// import RestIpfsNode from './restIpfsNode';

const FILE_SIZE_DOWNLOAD = 15 * 10 ** 6;
const CYBERNODE_URL = 'https://io.cybernode.ai';
// const cyberNodeCluster = new RestIpfsNode(CYBERNODE_URL);

const cluster = new Cluster(CYBERNODE_URL);

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
const getIPFSContentFromDb = async (
  cid: IPFSPath
): Promise<IPFSContentMaybe> => {
  // TODO: use cursor
  const dataIndexdDb = await db.table('cid').get({ cid });

  // backward compatibility
  const data = dataIndexdDb.data || dataIndexdDb.content;

  if (dataIndexdDb !== undefined && data) {
    // TODO: use cursor
    const { mime, stream } = await arrayToReadableStream(data);
    const meta = dataIndexdDb.meta || {
      type: 'file',
      size: -1,
      mime,
    };
    // backward compatibility
    meta.mime = mime;

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
    // const response = await all(node.ls(cid, { signal }));
    const stat = await node.files.stat(path, { signal });
    // console.log('---stat', stat);
    timer && clearTimeout(timer);

    switch (stat.type) {
      case 'directory': {
        // TODO: return directory structure
        return { cid, availableDownload: true };
      }
      default: {
        // return await fetchIPFSFile(ipfs, path);

        if (!stat.size || stat.size < FILE_SIZE_DOWNLOAD) {
          // const dataWithMime = await toUint8ArrayWithMime(node.cat(path));
          // return { details: parseRawIpfsData(dataWithMime, cid), cid, meta };
          const { mime, stream } = await asyncGeneratorToReadableStream(
            node.cat(path)
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
  cid: string,
  userGateway?: string | undefined,
  controller?: AbortController
): Promise<IPFSContentMaybe> => {
  // const response = await getIpfsDataFromGatway(
  //   cid,
  //   'arraybuffer',
  //   userGateway,
  //   controller
  // );

  const response = await axios.get(`${userGateway}/ipfs/${cid}`, {
    signal: controller?.signal,
    responseType: 'stream',
  });

  if (response) {
    const contentLength = parseInt(
      response.headers['content-length'] || '-1',
      10
    );
    // const dataUint8Array = new Uint8Array(response as ArrayBufferLike);

    const isReadableStream = typeof response.data.read === 'function';

    // In case if axios return cached value convert it to buffer->readablestream
    const { mime, stream } = await (isReadableStream
      ? asyncGeneratorToReadableStream(
          readableStreamToAsyncGenerator(response.data)
        )
      : arrayToReadableStream(Buffer.from(response.data)));

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

    // if (dataUint8Array.length < FILE_SIZE_DOWNLOAD) {
    //   const mime = await getUint8ArrayMime(dataUint8Array);

    //   return {
    //     details: parseRawIpfsData({ mime, rawData: dataUint8Array }, cid),
    //     cid,
    //     meta,
    //   };
  }

  // return 'availableDownload';
  // }

  return undefined;
};

const getIPFSContent = async (
  node: IPFS,
  cid: string,
  controller?: AbortController,
  callBackFuncStatus?: CallBackFuncStatus
): Promise<IPFSContentMaybe> => {
  const dataRsponseDb = await getIPFSContentFromDb(cid);

  if (dataRsponseDb !== undefined) {
    return dataRsponseDb;
  }

  if (node) {
    callBackFuncStatus && callBackFuncStatus('trying to get with a node');

    const ipfsContent = await fetchIPFSContentFromNode(node, cid, controller);

    // TODO: disabled TMP
    // if (ipfsContent !== undefined) {
    //   pinContentToDbAndIpfs(node, ipfsContent, cid);
    //   return ipfsContent;
    // }
    return ipfsContent;
  }

  callBackFuncStatus && callBackFuncStatus('trying to get with a gatway');

  const { userGateway } = getIpfsUserGatewanAndNodeType();
  const respnseGateway = await fetchIPFSContentFromGateway(
    cid,
    userGateway,
    controller
  );

  return respnseGateway;

  // TODO: tmp disabled
  // if (respnseGateway !== undefined) {
  //   pinContentToDbAndIpfs(null, respnseGateway, cid);

  //   return respnseGateway;
  // }

  // return undefined;
};
// TODO: remove
// const getIpfsDataFromGatway = async (
//   cid: string,
//   type: ResponseType = 'json',
//   userGateway = config.CYBER.CYBER_GATEWAY,
//   controller?: AbortController
// ): Promise<IPFSData | undefined> => {
//   try {
//     const abortControllerLegacy = controller || new AbortController();
//     setTimeout(() => {
//       abortControllerLegacy.abort();
//     }, 1000 * 60 * 1); // 1 min

//     // Read object from IPFS gateway
//     // Object size can be infinite?

//     const response = await axios.get(`${userGateway}/ipfs/${cid}`, {
//       signal: abortControllerLegacy.signal,
//       responseType: 'stream',
//     });

//     return response.data;
//   } catch (error) {
//     console.log('error getIpfsDataFromGatway', error);
//     return undefined;
//   }
// };

const pinContentToDbAndIpfs = async (
  node: IPFSMaybe,
  content: IPFSContentMaybe,
  cid: string
): Promise<void> => {
  if (node && node !== null) {
    node.pin.add(cid); // pin to local ipfs node
  }

  if (content && !content.availableDownload && content.stream) {
    const { stream: data } = content;

    const blob = new Blob([data.content], { type: data.type });

    await pinToIpfsCluster(cid, blob); // pin to cluster

    const dataIndexdDb = await db.table('cid').get({ cid });
    if (dataIndexdDb === undefined) {
      db.table('cid').add(content); // pin to IndexedDB
    }
  }
};

const addFileToIpfsCluster = async (
  cid: string,
  file: File | Blob | string
): Promise<AddResponse | PinResponse> => {
  let dataFile: $TsFixMe = null;

  // TODO: unclear logic
  // if (cid === file) {
  //   return cyberNode.pin(cid);
  // }

  if (file instanceof Blob) {
    dataFile = file;
  } else if (typeof file === 'string') {
    dataFile = new File([file], 'file.txt');
  }
  // TODO: unclear type
  // } else if (file.name && file.size < 8 * 10 ** 6) {
  //   dataFile = new File([file], file.name);
  // }
  else if (dataFile !== null) {
    return cluster.add(dataFile);
  }

  return cluster.pin(cid);
};

// check if the file is pinned to cybernode,
// if not, add&pin it to cluster
// file can be .... text/blob and ???
const pinToIpfsCluster = async (
  cid: string,
  file: $TsFixMe
): Promise<PinResponse | AddResponse | undefined> => {
  try {
    const cidStatus = await cluster.status(cid);

    const pinInfoValues = Object.values(cidStatus.peerMap);
    if (pinInfoValues.length > 0) {
      // already pinned
      if (pinInfoValues.find((p) => p.status !== 'unpinned')) {
        return undefined;
      }

      // add to cluster and pin
      if (file !== undefined) {
        return await addFileToIpfsCluster(cid, file);
      }

      return await cluster.pin(cid);
    }

    return undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export { getIPFSContent, pinToIpfsCluster, getIpfsUserGatewanAndNodeType };

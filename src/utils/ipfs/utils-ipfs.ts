import { concat as uint8ArrayConcat } from 'uint8arrays/concat';
import axios, { ResponseType } from 'axios';
import { fileTypeFromBuffer } from 'file-type';
import { Cluster } from '@nftstorage/ipfs-cluster';
import { toString as uint8ArrayToAsciiString } from 'uint8arrays/to-string';
import isSvg from 'is-svg';

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
  IPFSData,
  IPFSContentWithType,
} from './ipfs.d';

import db from '../../db';

import * as config from '../config';
import { CYBER, PATTERN_HTTP, PATTERN_IPFS_HASH } from '../../utils/config';

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

type Uint8ArrayWithMime = {
  mime: string;
  rawData: Uint8Array;
};

const getUint8ArrayMime = async (raw: Uint8Array): Promise<string> =>
  (await fileTypeFromBuffer(raw))?.mime || 'text/plain';

const toUint8ArrayWithMime = async (
  source: AsyncIterable<Uint8Array>
): Promise<Uint8ArrayWithMime> => {
  const iterator = source[Symbol.asyncIterator]();
  const firstChunk = await iterator.next();
  const chunks: Array<Uint8Array> = [firstChunk.value];
  const mime = await getUint8ArrayMime(firstChunk.value);

  // TODO: should be wrapped as ReadableStream
  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of source) {
    chunks.push(chunk);
  }

  return { mime, rawData: uint8ArrayConcat(chunks) };
};

// eslint-disable-next-line import/no-unused-modules
export const parseRawIpfsData = (
  data: Uint8ArrayWithMime,
  cid: IPFSPath
): IPFSContentWithType => {
  const { mime, rawData } = data;
  const response: IPFSContentWithType = {
    text: '',
    type: undefined,
    content: '',
    link: `/ipfs/${cid}`,
    gateway: false,
  };

  if (data.mime === 'text/plain') {
    if (isSvg(rawData as Buffer)) {
      response.type = 'image';
      response.content = `data:image/svg+xml;base64,${uint8ArrayToAsciiString(
        rawData,
        'base64'
      )}`;
    } else {
      const dataBase64 = uint8ArrayToAsciiString(rawData);
      // TODO: search can bel longer for 42???!
      // also cover ipns links
      response.link =
        dataBase64.length > 42 ? `/ipfs/${cid}` : `/search/${dataBase64}`;

      if (dataBase64.match(PATTERN_IPFS_HASH)) {
        response.gateway = true;
        response.type = 'link';
        response.content = `${CYBER.CYBER_GATEWAY}ipfs/${dataBase64}`;
      } else if (dataBase64.match(PATTERN_HTTP)) {
        response.type = 'link';
        response.gateway = false;
        response.content = dataBase64;
        response.link = `/ipfs/${cid}`;
      } else {
        response.type = 'text';
        response.text =
          dataBase64.length > 300
            ? `${dataBase64.slice(0, 300)}...`
            : dataBase64;
      }
    }
  } else if (mime.indexOf('image') !== -1) {
    const imgBase64 = uint8ArrayToAsciiString(rawData, 'base64');
    const file = `data:${mime};base64,${imgBase64}`;
    response.type = 'image';
    response.content = file;
    response.gateway = false;
  } else if (mime.indexOf('application/pdf') !== -1) {
    const file = `data:${mime};base64,${uint8ArrayToAsciiString(rawData)}`;
    response.type = 'application/pdf';
    response.content = file;
    response.gateway = true; // ???
  } else {
    // TODO: support more file types
    response.text = cid.toString();
    response.gateway = true; // ???
  }

  return response;
};

// Get data by CID from local storage
const getIPFSContentFromDb = async (
  cid: IPFSPath
): Promise<IPFSContentMaybe> => {
  const dataIndexdDb = await db.table('cid').get({ cid });
  if (dataIndexdDb !== undefined && dataIndexdDb.content) {
    const data = await toUint8ArrayWithMime(dataIndexdDb.content);
    console.log('getIPFSContentFromDb data', data);
    const meta = dataIndexdDb.meta || {
      type: 'file',
      size: 0,
      blockSizes: [],
      data: null,
    };

    return { details: parseRawIpfsData(data, cid), cid, meta };
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
        return 'availableDownload';
      }
      default: {
        // return await fetchIPFSFile(ipfs, path);
        const meta: IPFSContentMeta = {
          type: stat.type,
          size: stat.size || 0,
          blockSizes: [],
          data: null,
        };

        if (!stat.size || stat.size < FILE_SIZE_DOWNLOAD) {
          const dataWithMime = await toUint8ArrayWithMime(node.cat(path));
          return { details: parseRawIpfsData(dataWithMime, cid), cid, meta };
        }
      }
    }

    return 'availableDownload';
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
  const response = await getIpfsDataFromGatway(
    cid,
    'arraybuffer',
    userGateway,
    controller
  );
  if (response !== null) {
    const dataUint8Array = new Uint8Array(response as ArrayBufferLike);
    const meta: IPFSContentMeta = {
      type: 'file',
      size: dataUint8Array.length,
      blockSizes: [],
      data: '',
    };

    if (dataUint8Array.length < FILE_SIZE_DOWNLOAD) {
      const mime = await getUint8ArrayMime(dataUint8Array);

      return {
        details: parseRawIpfsData({ mime, rawData: dataUint8Array }, cid),
        cid,
        meta,
      };
    }

    return 'availableDownload';
  }

  return undefined;
};

const pinContentToDbAndIpfs = async (
  node: IPFSMaybe,
  content: IPFSContentMaybe,
  cid: string
): Promise<void> => {
  if (node && node !== null) {
    node.pin.add(cid); // pin to local ipfs node
  }

  if (content && content !== 'availableDownload' && content.details) {
    const { details: data } = content;

    const blob = new Blob([data.content], { type: data.type });

    await pinToIpfsCluster(cid, blob); // pin to cluster

    const dataIndexdDb = await db.table('cid').get({ cid });
    if (dataIndexdDb === undefined) {
      db.table('cid').add(content); // pin to IndexedDB
    }
  }
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
    if (ipfsContent !== undefined) {
      pinContentToDbAndIpfs(node, ipfsContent, cid);
      return ipfsContent;
    }
    return ipfsContent;
  }

  callBackFuncStatus && callBackFuncStatus('trying to get with a gatway');

  const { userGateway } = getIpfsUserGatewanAndNodeType();
  const respnseGateway = await fetchIPFSContentFromGateway(
    cid,
    userGateway,
    controller
  );

  if (respnseGateway !== undefined) {
    pinContentToDbAndIpfs(null, respnseGateway, cid);

    return respnseGateway;
  }

  return undefined;
};

const getIpfsDataFromGatway = async (
  cid: string,
  type: ResponseType = 'json',
  userGateway = config.CYBER.CYBER_GATEWAY,
  controller?: AbortController
): Promise<IPFSData | undefined> => {
  try {
    const abortControllerLegacy = controller || new AbortController();
    setTimeout(() => {
      abortControllerLegacy.abort();
    }, 1000 * 60 * 1); // 1 min

    // Read object from IPFS gateway
    // Object size can be infinite?

    const response = await axios.get(`${userGateway}/ipfs/${cid}`, {
      signal: abortControllerLegacy.signal,
      responseType: type,
    });

    return response.data;
  } catch (error) {
    console.log('error getIpfsDataFromGatway', error);
    return undefined;
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
    console.log(`Blob`);
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

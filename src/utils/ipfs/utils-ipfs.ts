import all from 'it-all';
import { concat as uint8ArrayConcat } from 'uint8arrays/concat';
import axios, { ResponseType } from 'axios';
import FileType from 'file-type';
import { Cluster } from '@nftstorage/ipfs-cluster';

import { $TsFixMe } from 'src/types/tsfix';
import { IPFS, IPFSPath, IPFSEntry } from 'kubo-rpc-client/types';

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
} from './ipfs.d';

import db from '../../db';

import * as config from '../config';

// import RestIpfsNode from './restIpfsNode';

const FILE_SIZE_DOWNLOAD = 15 * 10 ** 6;
const CYBERNODE_URL = 'https://io.cybernode.ai';
// const cyberNodeCluster = new RestIpfsNode(CYBERNODE_URL);

const cluster = new Cluster(CYBERNODE_URL);

// Get IPFS node from local storage
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
const getIPFSContentFromDb = async (
  cid: IPFSPath
): Promise<IPFSContentMaybe> => {
  const dataIndexdDb = await db.table('cid').get({ cid });
  if (dataIndexdDb !== undefined && dataIndexdDb.content) {
    const contentCidDB = Buffer.from(dataIndexdDb.content);

    const meta = dataIndexdDb.meta || {
      type: 'file',
      size: 0,
      blockSizes: [],
      data: null,
    };

    return { data: contentCidDB, cid, meta };
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
  let ipfsNodeLs: IPFSEntry[];
  // Try to read directory

  try {
    const response = await all(node.ls(cid, { signal }));
    ipfsNodeLs = response;
    clearTimeout(timer);
  } catch (error) {
    console.log('error fetchIPFSContentFromNode', error);
    return undefined;
  }

  // If content is directory
  if (ipfsNodeLs.length > 1) {
    return 'availableDownload';
  }

  const meta: IPFSContentMeta = {
    type: ipfsNodeLs[0].type,
    size: ipfsNodeLs[0].size || 0,
    blockSizes: [],
    data: null,
  };

  // If content is file read it
  if (ipfsNodeLs[0].size === undefined) {
    const responseCat = uint8ArrayConcat(await all(node.cat(cid)));

    return { data: responseCat, cid, meta };
  }

  // If content is not big file read it
  if (ipfsNodeLs[0].size < FILE_SIZE_DOWNLOAD) {
    const responseCat = uint8ArrayConcat(await all(node.cat(cid)));

    return { data: responseCat, cid, meta };
  }

  return 'availableDownload';
};

const fetchIPFSContentFromGateway = async (
  cid: string,
  userGateway?: string | undefined,
  controller?: AbortController
): Promise<IPFSContentMaybe> => {
  const respnseGateway = await getIpfsDataFromGatway(
    cid,
    'arraybuffer',
    userGateway,
    controller
  );
  if (respnseGateway !== null) {
    const dataUint8Array = new Uint8Array(respnseGateway as ArrayBufferLike);
    const meta: IPFSContentMeta = {
      type: 'file',
      size: dataUint8Array.length,
      blockSizes: [],
      data: '',
    };

    if (dataUint8Array.length < FILE_SIZE_DOWNLOAD) {
      return { data: dataUint8Array, cid, meta };
    }

    return 'availableDownload';
  }

  return undefined;
};

const pinContentToDbAndIpfs = async (
  node: IPFSMaybe,
  content: $TsFixMe,
  cid: string
): Promise<void> => {
  if (node && node !== null) {
    node.pin.add(cid); // pin to local ipfs node
  }

  if (content !== 'availableDownload') {
    const { data } = content;

    const dataFileType = await FileType.fromBuffer(data);

    const mimeType = dataFileType !== undefined ? dataFileType.mime : '';

    const blob = new Blob([data], { type: mimeType });

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
  //TODO: DISABLED TMP
  // const dataRsponseDb = await getIPFSContentFromDb(cid);
  const dataRsponseDb = undefined;
  if (dataRsponseDb !== undefined) {
    return dataRsponseDb;
  }

  if (node) {
    callBackFuncStatus && callBackFuncStatus('trying to get with a node');

    const dataResponseIpfs = await fetchIPFSContentFromNode(
      node,
      cid,
      controller
    );

    if (dataResponseIpfs !== undefined) {
      pinContentToDbAndIpfs(node, dataResponseIpfs, cid);
      return dataResponseIpfs;
    }
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

    // TODO: unclear type
  } else if (file.name && file.size < 8 * 10 ** 6) {
    dataFile = new File([file], file.name);
  }

  if (dataFile !== null) {
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

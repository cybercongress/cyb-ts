import all from 'it-all';
import { concat as uint8ArrayConcat } from 'uint8arrays/concat';
import axios from 'axios';
import { ResponseType } from 'axios';
import FileType from 'file-type';
import db from '../../db';
import * as config from '../config';
import { IPFS, IPFSPath, IPFSEntry } from 'kubo-rpc-client/types';

import { $TsFixMe } from 'src/types/tsfix';

import {
  CheckIpfsState,
  IPFSContentMaybe,
  IPFSContentMeta,
  IPFSMaybe,
  CallBackFuncStatus,
} from './ipfs.d';

import { RestIpfsNode } from './restIpfsNode';

const FILE_SIZE_DOWNLOAD = 15 * 10 ** 6;
const CYBERNODE_URL = 'https://io.cybernode.ai';
const cyberNode = new RestIpfsNode(CYBERNODE_URL);

// Get IPFS node from local storage
const checkIpfsState = (): CheckIpfsState => {
  let userGatewayUrl = undefined;
  let ipfsNodeTypeTemp = undefined;

  const LS_IPFS_STATE = localStorage.getItem('ipfsState');

  if (LS_IPFS_STATE !== null) {
    const lsTypeIpfsData = JSON.parse(LS_IPFS_STATE);
    if (Object.prototype.hasOwnProperty.call(lsTypeIpfsData, 'userGateway')) {
      const { userGateway, ipfsNodeType } = lsTypeIpfsData;
      userGatewayUrl = userGateway;
      ipfsNodeTypeTemp = ipfsNodeType;
    }
  }

  return { ipfsNodeType: ipfsNodeTypeTemp, userGateway: userGatewayUrl };
};

// Get data by CID from local storage
const checkCidInDB = async (cid: IPFSPath): Promise<IPFSContentMaybe> => {
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

const checkCidByIpfsNode = async (
  node: IPFS,
  cid: IPFSPath
): Promise<IPFSContentMaybe> => {
  const controller = new AbortController();
  const { signal } = controller;
  const timer = setTimeout(() => {
    controller.abort();
  }, 1000 * 60 * 1); // 1 min
  let ipfsNodeLs: IPFSEntry[];
  // Try to read directory

  try {
    const response = await all(node.ls(cid, { signal }));
    ipfsNodeLs = response;
    clearTimeout(timer);
  } catch (error) {
    console.log('error checkCidByIpfsNode', error);
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

const checkIpfsGatway = async (
  cid: string,
  userGateway?: string | undefined
): Promise<IPFSContentMaybe> => {
  const respnseGateway = await getIpfsGatway(cid, 'arraybuffer', userGateway);
  if (respnseGateway !== null) {
    const dataUint8Array = new Uint8Array(respnseGateway);
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
  content: any,
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

    await getPinsCid(cid, blob); // pin to cluster

    const dataIndexdDb = await db.table('cid').get({ cid });
    if (dataIndexdDb === undefined) {
      db.table('cid').add(content); // pin to IndexedDB
    }
  }
};

async function replicateToLocalDb(cid: string): Promise<IPFSContentMaybe> {
  const respnseGateway = await checkIpfsGatway(cid);
  if (respnseGateway !== undefined) {
    pinContentToDbAndIpfs(null, respnseGateway, cid);
    return respnseGateway;
  }
}

const getContentByCid = async (
  node: IPFS,
  cid: string,
  callBackFuncStatus?: CallBackFuncStatus
): Promise<IPFSContentMaybe> => {
  const dataRsponseDb = await checkCidInDB(cid);

  if (dataRsponseDb !== undefined) {
    return dataRsponseDb;
  }

  if (!node) {
    callBackFuncStatus && callBackFuncStatus('trying to get with a node');

    const dataResponseIpfs = await checkCidByIpfsNode(node, cid);

    if (dataResponseIpfs !== undefined) {
      pinContentToDbAndIpfs(node, dataResponseIpfs, cid);
      return dataResponseIpfs;
    }
    callBackFuncStatus && callBackFuncStatus('trying to get with a gatway');

    const { ipfsNodeType, userGateway } = checkIpfsState();

    if (ipfsNodeType !== null && ipfsNodeType === 'external') {
      const respnseGateway = await checkIpfsGatway(cid, userGateway);

      if (respnseGateway !== undefined) {
        return respnseGateway;
      }
    }

    return replicateToLocalDb(cid);
  } else {
    callBackFuncStatus && callBackFuncStatus('trying to get with a gatway');
    return replicateToLocalDb(cid);
  }
};

const getIpfsGatway = async (
  cid: string,
  type: ResponseType = 'json',
  userGateway = config.CYBER.CYBER_GATEWAY
) => {
  try {
    const abortController = new AbortController();
    setTimeout(() => {
      abortController.abort();
    }, 1000 * 60 * 1); // 1 min

    //Read object from IPFS gateway
    //Object size can be infinite?

    const response = await axios.get(`${userGateway}/ipfs/${cid}`, {
      signal: abortController.signal,
      responseType: type,
    });

    return response.data;
  } catch (error) {
    console.log('error getIpfsGatway', error);
    return undefined;
  }
};

const addFileToCluster = async (
  cid: string,
  file: $TsFixMe | Blob | string
) => {
  console.log(`addFileToCluster`);
  let dataFile: $TsFixMe = null;

  // TODO: unclear logic
  if (cid === file) {
    return await cyberNode.pin(cid);
  }

  if (file instanceof Blob) {
    console.log(`Blob`);
    dataFile = file;
  } else if (typeof file === 'string') {
    dataFile = new File([file], 'file.txt');
  } else if (file.name && file.size < 8 * 10 ** 6) {
    dataFile = new File([file], file.name);
  }

  if (dataFile !== null) {
    const formData = new FormData();
    formData.append('file', dataFile);

    if (!cyberNode.add(formData)) {
      //TODO: add method also pin automatically ?????
      // return cyberNode.pin(cid);
    }
  } else {
    return await cyberNode.pin(cid);
  }
};

// check if the file is pinned to cybernode,
// if not, add&pin it to cluster
// file can be .... text/blob and ???
const getPinsCid = async (cid: string, file: $TsFixMe) => {
  try {
    const responseGetPinsCidGet = await cyberNode.pinInfo(cid);

    if (
      responseGetPinsCidGet.peer_map &&
      Object.keys(responseGetPinsCidGet.peer_map).length > 0
    ) {
      const { peer_map: peerMap } = responseGetPinsCidGet;
      for (const key in peerMap) {
        if (Object.hasOwnProperty.call(peerMap, key)) {
          const element = peerMap[key];
          if (element.status !== 'unpinned') {
            return null;
          }
        }
      }

      if (file !== undefined) {
        return await addFileToCluster(cid, file);
      }
      // TODO: secondary pin to cybernode after pinning to cluster. why???
      return await cyberNode.pin(cid);
    }

    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export { getContentByCid, getPinsCid, checkIpfsState };

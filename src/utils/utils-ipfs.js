import all from 'it-all';
import { concat as uint8ArrayConcat } from 'uint8arrays/concat';
import axios from 'axios';
import FileType from 'file-type';
import db from '../db';
import * as config from './config';

const FILE_SIZE_DOWNLOAD = 15 * 10 ** 6;

const checkIpfsState = () => {
  let userGatewayUrl = null;
  let ipfsNodeTypeTemp = null;

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

const checkCidInDB = async (cid) => {
  const dataIndexdDb = await db.table('cid').get({ cid });
  if (dataIndexdDb !== undefined && dataIndexdDb.content) {
    const contentCidDB = Buffer.from(dataIndexdDb.content);
    let meta = {
      type: 'file',
      size: 0,
      blockSizes: [],
      data: '',
    };

    if (dataIndexdDb.meta) {
      meta = { ...dataIndexdDb.meta };
    }
    return { data: contentCidDB, cid, meta };
  }

  return undefined;
};

// TODO: bad code -> refactor
const checkCidByIpfsNode = async (node, cid) => {
  const controller = new AbortController();
  const { signal } = controller;
  const timer = setTimeout(() => {
    controller.abort();
  }, 1000 * 60 * 1); // 1 min

  let ipfsNodeLs = null;
  try {
    const response = await all(node.ls(cid, { signal }));
    ipfsNodeLs = response;
    clearTimeout(timer);
  } catch (error) {
    console.log('error checkCidByIpfsNode', error);
    return undefined;
  }

  // console.log('ipfsNodeLs', ipfsNodeLs)

  if (ipfsNodeLs !== null && ipfsNodeLs.length > 1) {
    return 'availableDownload';
  }

  if (ipfsNodeLs !== null) {
    const meta = {
      type: ipfsNodeLs[0].type,
      size: ipfsNodeLs[0].size || 0,
      blockSizes: [],
      data: '',
    };

    if (ipfsNodeLs[0].size === undefined) {
      const responseCat = uint8ArrayConcat(await all(node.cat(cid)));

      return { data: responseCat, cid, meta };
    }

    if (ipfsNodeLs[0].size < FILE_SIZE_DOWNLOAD) {
      const responseCat = uint8ArrayConcat(await all(node.cat(cid)));

      return { data: responseCat, cid, meta };
    }
    return 'availableDownload';
  }
};

const checkIpfsGatway = async (cid, userGateway) => {
  const respnseGateway = await getIpfsGatway(cid, 'arraybuffer', userGateway);
  if (respnseGateway !== null) {
    const dataUint8Array = new Uint8Array(respnseGateway);
    const meta = {
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

const pinContentToDbAndIpfs = async (node, content, cid) => {
  if (node && node !== null) {
    node.pin.add(cid); // pin to local ipfs node
  }

  if (content !== 'availableDownload') {
    const { data } = content;

    const dataFileType = await FileType.fromBuffer(data);

    let mimeType = '';
    if (dataFileType !== undefined) {
      const { mime } = dataFileType;
      mimeType = mime;
    }

    const blob = new Blob([data], { type: mimeType });

    await getPinsCid(cid, blob); // pin to cluster

    const dataIndexdDb = await db.table('cid').get({ cid });
    if (dataIndexdDb === undefined) {
      db.table('cid').add(content); // pin to IndexedDB
    }
  }
};

const getContentByCid = async (node, cid, callBackFuncStatus) => {
  const dataRsponseDb = await checkCidInDB(cid);

  if (dataRsponseDb !== undefined) {
    return dataRsponseDb;
  }

  if (node !== undefined && node !== null) {
    if (callBackFuncStatus) {
      callBackFuncStatus('trying to get with a node');
    }
    const dataResponseIpfs = await checkCidByIpfsNode(node, cid);
    if (dataResponseIpfs !== undefined) {
      pinContentToDbAndIpfs(node, dataResponseIpfs, cid);
      return dataResponseIpfs;
    }
    if (callBackFuncStatus) {
      callBackFuncStatus('trying to get with a gatway');
    }

    const { ipfsNodeType, userGateway } = checkIpfsState();

    if (ipfsNodeType !== null && ipfsNodeType === 'external') {
      const respnseGateway = await checkIpfsGatway(cid, userGateway);
      if (respnseGateway !== undefined) {
        return respnseGateway;
      }
    }

    const respnseGateway = await checkIpfsGatway(cid);
    if (respnseGateway !== undefined) {
      pinContentToDbAndIpfs(null, respnseGateway, cid);
      return respnseGateway;
    }
  } else {
    if (callBackFuncStatus) {
      callBackFuncStatus('trying to get with a gatway');
    }

    const respnseGateway = await checkIpfsGatway(cid);
    if (respnseGateway !== undefined) {
      pinContentToDbAndIpfs(null, respnseGateway, cid);
      return respnseGateway;
    }
    return undefined;
  }

  return undefined;
};

const getIpfsGatway = async (
  cid,
  type = 'json',
  userGateway = config.CYBER.CYBER_GATEWAY
) => {
  try {
    const abortController = new AbortController();
    setTimeout(() => {
      abortController.abort();
    }, 1000 * 60 * 1); // 1 min

    const response = await axios.get(`${userGateway}/ipfs/${cid}`, {
      signal: abortController.signal,
      responseType: type,
    });

    return response.data;
  } catch (error) {
    console.log('error getIpfsGatway', error);
    return null;
  }
};

const getPinsCidPost = async (cid) => {
  console.log(`getPinsCidPost`);
  try {
    const response = await axios({
      method: 'post',
      url: `https://io.cybernode.ai/pins/${cid}`,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getPinsCidGet = async (cid) => {
  try {
    const response = await axios({
      method: 'get',
      url: `https://io.cybernode.ai/pins/${cid}`,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const addFileToCluster = async (cid, file) => {
  console.log(`addFileToCluster`);
  let dataFile = null;
  if (cid === file) {
    const responseGetPinsCidPost = await getPinsCidPost(cid);
    return responseGetPinsCidPost;
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
    try {
      const response = await axios({
        method: 'post',
        url: 'https://io.cybernode.ai/add',
        data: formData,
      });
      return response;
    } catch (error) {
      const responseGetPinsCidPost = await getPinsCidPost(cid);
      return responseGetPinsCidPost;
    }
  } else {
    const responseGetPinsCidPost = await getPinsCidPost(cid);
    return responseGetPinsCidPost;
  }
};

const getPinsCid = async (cid, file) => {
  try {
    const responseGetPinsCidGet = await getPinsCidGet(cid);
    if (
      responseGetPinsCidGet.peer_map &&
      Object.keys(responseGetPinsCidGet.peer_map).length > 0
    ) {
      const { peer_map: peerMap } = responseGetPinsCidGet;
      // eslint-disable-next-line no-restricted-syntax
      for (const key in peerMap) {
        if (Object.hasOwnProperty.call(peerMap, key)) {
          const element = peerMap[key];
          if (element.status !== 'unpinned') {
            return null;
          }
        }
      }

      if (file !== undefined) {
        const responseGetPinsCidPost = await addFileToCluster(cid, file);
        return responseGetPinsCidPost;
      }
      const responseGetPinsCidPost = await getPinsCidPost(cid);
      return responseGetPinsCidPost;
    }
    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export { getContentByCid, getPinsCid, checkIpfsState };

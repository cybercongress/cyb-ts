import all from 'it-all';
import { concat as uint8ArrayConcat } from 'uint8arrays/concat';
import db from '../db';
import { getPinsCid, getIpfsGatway } from './search/utils';

const FileType = require('file-type');

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

const checkCidByIpfsNode = async (node, cid) => {
  let timer;
  const controller = new AbortController();
  const { signal } = controller;
  timer = setTimeout(() => {
    controller.abort();
  }, 1000 * 60 * 1); // 1 min

  let ipfsNodeLs = null;
  try {
    const response = await all(await node.ls(cid, { signal }));
    ipfsNodeLs = response;
    clearTimeout(timer);
  } catch (error) {
    console.log('error checkCidByIpfsNode', error);
    return undefined;
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

    if (ipfsNodeLs[0].size < 15 * 10 ** 6) {
      const responseCat = uint8ArrayConcat(await all(node.cat(cid)));

      return { data: responseCat, cid, meta };
    }
    return 'availableDownload';
  }
};

const checkIpfsGatway = async (cid) => {
  const respnseGateway = await getIpfsGatway(cid, 'arraybuffer');
  if (respnseGateway !== null) {
    const dataUint8Array = new Uint8Array(respnseGateway);
    const meta = {
      type: 'file',
      size: dataUint8Array.length,
      blockSizes: [],
      data: '',
    };
    return { data: dataUint8Array, cid, meta };
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

  if (node !== null) {
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

export { getContentByCid };

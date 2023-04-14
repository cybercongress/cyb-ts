import {
  AddResponse,
  PinResponse,
} from '@nftstorage/ipfs-cluster/dist/src/interface';
import { $TsFixMe } from 'src/types/tsfix';

import { chunksToBlob } from 'src/utils/ipfs/content-utils';
import { addIpfsContentToDb } from './db-utils';

import db from 'src/db';

import { Cluster } from '@nftstorage/ipfs-cluster';
import { IPFSPath } from 'kubo-rpc-client/types';

const CYBERNODE_URL = 'https://io.cybernode.ai';

const cluster = new Cluster(CYBERNODE_URL);

// eslint-disable-next-line import/no-unused-modules, import/prefer-default-export
export const addDataChunksToIpfsCluster = async (
  cid: IPFSPath,
  chunks: Array<Uint8Array>,
  mime: string | undefined,
  saveToDb?: boolean
): Promise<AddResponse | undefined> => {
  if (chunks.length > 0) {
    const blob = chunksToBlob(chunks, mime);

    const result = await cluster.add(blob);

    // result.cid is cidV1 - can we use that?
    if (saveToDb) {
      addIpfsContentToDb(cid.toString(), blob);
    }

    return result;
  }

  return undefined;
};

// TODO: ****** Legacy code
const addFileToIpfsCluster = async (
  // cid: string,
  file: File | Blob | string
): Promise<AddResponse | PinResponse | undefined> => {
  let dataFile: $TsFixMe = null;

  // TODO: unclear logic
  // if (cid === file) {
  //   return cyberNode.pin(cid);
  // }

  if (file instanceof Blob) {
    cluster.add(file);
  } else if (typeof file === 'string') {
    // Why need this, can we use blob?
    dataFile = new File([file], 'file.txt');
    cluster.add(dataFile);
  }
  // TODO: unclear type
  // } else if (file.name && file.size < 8 * 10 ** 6) {
  //   dataFile = new File([file], file.name);
  // }

  return undefined;
  // dublicated
  // return cluster.pin(cid);
};

// check if the file is pinned to cybernode,
// if not, add&pin it to cluster
// file can be .... text/blob and ???
// eslint-disable-next-line import/no-unused-modules
// TODO: ****** Legacy code
// TODO: !!!!!!!!!! Should be tested all the parts wheire it is used
// eslint-disable-next-line import/no-unused-modules
export const pinToIpfsCluster = async (
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
      // TODO: UNCOMMENT
      if (file) {
        return await addFileToIpfsCluster(file);
      }

      return await cluster.pin(cid);
    }

    return undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

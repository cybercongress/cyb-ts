import {
  AddResponse,
  PinResponse,
} from '@nftstorage/ipfs-cluster/dist/src/interface';
import { $TsFixMe } from 'src/types/tsfix';

import { chunksToBlob } from 'src/utils/ipfs/content-utils';

import { Cluster } from '@nftstorage/ipfs-cluster';
import { IPFSPath } from 'kubo-rpc-client/types';
import { addIpfsContentToDb } from './db-utils';

const CYBERNODE_URL = 'https://io.cybernode.ai';

const cluster = new Cluster(CYBERNODE_URL);

// eslint-disable-next-line import/no-unused-modules, import/prefer-default-export
export const addDataChunksToIpfsCluster = async (
  cid: IPFSPath,
  chunks: Array<Uint8Array>,
  mime: string | undefined,
  saveToDb?: boolean
): Promise<AddResponse | undefined> => {
  try {
    if (chunks.length > 0) {
      const blob = chunksToBlob(chunks, mime);

      // result.cid is cidV1 - can we use that?
      if (saveToDb) {
        addIpfsContentToDb(cid.toString(), blob);
      }
      // console.log('----cluster:', await cluster.info());
      // TODO: ERROR on DEV ENV
      // Access to fetch at 'https://io.cybernode.ai/add?stream-channels=false&raw-leaves=true&cid-version=1'
      // from origin 'https://localhost:3001'
      // has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present .....
      return await cluster.add(blob, { cidVersion: 0 });
    }
  } catch (error) {
    console.log('error addDataChunksToIpfsCluster', cid, error);
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
    cluster.add(file, { cidVersion: 0 });
  } else if (typeof file === 'string') {
    // Why need this, can we use blob?
    dataFile = new File([file], 'file.txt');
    cluster.add(dataFile, { cidVersion: 0 });
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

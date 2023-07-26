import {
  AddResponse,
  PinResponse,
  StatusResponse,
} from '@nftstorage/ipfs-cluster/dist/src/interface';
import { $TsFixMe } from 'src/types/tsfix';

import { chunksToBlob } from 'src/utils/ipfs/content-utils';

import { Cluster } from '@nftstorage/ipfs-cluster';
import { addIpfsContentToDb } from './db-utils';
import { getMimeFromUint8Array } from './stream-utils';

const CYBERNODE_URL = 'https://io.cybernode.ai';

const cluster = new Cluster(CYBERNODE_URL);

// eslint-disable-next-line import/no-unused-modules, import/prefer-default-export
// export const addDataChunksToIpfsCluster = async (
//   cid: string,
//   chunks: Uint8Array,
//   saveToDb?: boolean
// ): Promise<AddResponse | undefined> => {
//   try {
//     if (chunks.length > 0) {
//       const mime = await getMimeFromUint8Array(chunks);
//       const blob = chunksToBlob([chunks], mime);

//       if (saveToDb) {
//         addIpfsContentToDb(cid, chunks);
//       }
//       console.log('----cluster add:', saveToDb, mime, cid);
//       // TODO: ERROR on DEV ENV
//       // Access to fetch at 'https://io.cybernode.ai/add?stream-channels=false&raw-leaves=true&cid-version=1'
//       // from origin 'https://localhost:3001'
//       // has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present .....
//       return await pinToIpfsCluster(cid.toString(), blob);
//     }
//   } catch (error) {
//     console.log('error addDataChunksToIpfsCluster', cid, error);
//   }

//   return undefined;
// };

export const addToIpfsCluster = async (
  file: File | string
): Promise<AddResponse | PinResponse | undefined> => {
  const dataFile =
    typeof file === 'string' ? new File([file], 'file.txt') : file;
  return cluster.add(dataFile, { cidVersion: 0, rawLeaves: false });
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
  file?: $TsFixMe
): Promise<PinResponse | AddResponse | undefined> => {
  try {
    const cidStatus = await cluster.status(cid);
    console.log('----cluster pin:', cid, cidStatus);
    const pinInfoValues = Object.values(cidStatus.peerMap);
    if (pinInfoValues.length > 0) {
      // already pinned
      if (pinInfoValues.find((p) => p.status !== 'unpinned')) {
        return undefined;
      }

      // add to cluster and pin
      if (file) {
        return await addToIpfsCluster(file);
      }

      const result = await cluster.pin(cid);
      console.log('----cluster pin result:', cid, result);
    }

    return undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export const clusterPinStatus = async (
  cid: string
): Promise<StatusResponse> => {
  return cluster.status(cid);
};

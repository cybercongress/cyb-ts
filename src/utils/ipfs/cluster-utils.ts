import {
  AddResponse,
  PinResponse,
  StatusResponse,
} from '@nftstorage/ipfs-cluster/dist/src/interface';

import { Cluster } from '@nftstorage/ipfs-cluster';

const CYBERNODE_URL = 'https://io.cybernode.ai';

const cluster = new Cluster(CYBERNODE_URL);

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
  file?: File | string
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

import Unixfs from 'ipfs-unixfs';
import { DAGNode, util as DAGUtil } from 'ipld-dag-pb';
import { isString } from 'lodash';
import { IpfsApi } from 'src/services/backend/workers/background/worker';
import { ParticleCid } from 'src/types/base';
import { PATTERN_IPFS_HASH } from 'src/constants/patterns';

// eslint-disable-next-line import/prefer-default-export
export const getIpfsHash = (string: string): Promise<ParticleCid> =>
  new Promise((resolve, reject) => {
    const unixFsFile = new Unixfs('file', Buffer.from(string));

    const buffer = unixFsFile.marshal();
    DAGNode.create(buffer, (err, dagNode) => {
      if (err) {
        reject(new Error('Cannot create ipfs DAGNode'));
      }

      DAGUtil.cid(dagNode, (error, cid) => {
        resolve(cid.toBaseEncodedString());
      });
    });
  });
export const addIfpsMessageOrCid = async (
  message: string | ParticleCid | File,
  { ipfsApi }: { ipfsApi: IpfsApi | null }
) => {
  if (!ipfsApi) {
    throw Error('IpfsApi is not initialized');
  }

  return (
    isString(message) && message.match(PATTERN_IPFS_HASH)
      ? message
      : ((await ipfsApi!.addContent(message)) as string)
  ) as ParticleCid;
};

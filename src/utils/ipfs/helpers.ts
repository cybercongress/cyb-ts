import Unixfs from 'ipfs-unixfs';
import { DAGNode, util as DAGUtil } from 'ipld-dag-pb';
import { ParticleCid } from 'src/types/base';

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

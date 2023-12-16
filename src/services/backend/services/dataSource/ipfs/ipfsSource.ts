import { getIPFSContent } from 'src/services/ipfs/utils/utils-ipfs';
import { IpfsNode, IPFSContent } from 'src/services/ipfs/ipfs';
import {
  asyncIterableBatchProcessor,
  arrayToAsyncIterable,
} from 'src/utils/async/iterable';

import { mapParticleToEntity } from 'src/services/CozoDb/mapping';

import { LsResult } from 'ipfs-core-types/src/pin';

import { onProgressCallback, onCompleteCallback } from '../types';

import type { DbApi } from '../indexedDb/dbApiWrapper';

const fetchPins = async (node: IpfsNode) => {
  const pins: LsResult[] = [];
  await asyncIterableBatchProcessor(
    node.ls(),
    async (pinsBatch) => {
      // filter only root pins
      pins.push(
        ...pinsBatch.filter(
          (p) => p.type === 'direct' || p.type === 'recursive'
        )
      );
    },
    10
  );

  return pins;
};

// const importParticles = async (
//   node: IpfsNode,
//   cids: string[],
//   dbApi: DbApi,
//   onProgress?: onProgressCallback,
//   onComplete?: onCompleteCallback
// ) => {
//   let conter = 0;
//   await asyncIterableBatchProcessor(
//     arrayToAsyncIterable(cids),
//     async (cidsBatch) => {
//       const contents = await Promise.all(
//         cidsBatch.map((cid) => getIPFSContent(cid, node))
//       );
//       const pinsEntities = contents
//         .filter((c) => !!c)
//         .map((content) => mapParticleToEntity(content as IPFSContent));
//       conter += pinsEntities.length;

//       await dbApi.putParticles(pinsEntities);

//       onProgress && onProgress(conter);
//     },
//     10
//   );
//   onComplete && onComplete(conter);
// };

// const importParticle = async (cid: string, node: IpfsNode, dbApi: DbApi) => {
//   return getIPFSContent(cid, node).then((content) =>
//     content ? importParicleContent(content, dbApi) : false
//   );
// };

const importParicleContent = async (particle: IPFSContent, dbApi: DbApi) => {
  try {
    const entity = mapParticleToEntity(particle);
    const result = await dbApi!.putParticles(entity);
    return result;
  } catch (e) {
    console.error('importParicleContent', e.toString(), !!dbApi);
    return false;
  }
};

export { fetchPins, importParicleContent };

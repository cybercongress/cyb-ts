import { getIPFSContent } from 'src/services/ipfs/utils/utils-ipfs';
import { IpfsNode, IPFSContent } from 'src/services/ipfs/ipfs';
import {
  asyncIterableBatchProcessor,
  arrayToAsyncIterable,
} from 'src/utils/async/iterable';

import { mapParticleToEntity } from 'src/services/CozoDb/mapping';

import { DbWorkerApi } from 'src/services/backend/workers/db/worker';

import { onProgressCallback, onCompleteCallback } from '../types';
import { LsResult } from 'ipfs-core-types/src/pin';

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

const importParticles = async (
  node: IpfsNode,
  cids: string[],
  dbApi: DbWorkerApi,
  onProgress?: onProgressCallback,
  onComplete?: onCompleteCallback
) => {
  let conter = 0;
  await asyncIterableBatchProcessor(
    arrayToAsyncIterable(cids),
    async (cidsBatch) => {
      const contents = await Promise.all(
        cidsBatch.map((cid) => getIPFSContent(cid, node))
      );
      const pinsEntities = contents
        .filter((c) => !!c)
        .map((content) => mapParticleToEntity(content as IPFSContent));
      conter += pinsEntities.length;
      await dbApi.executeBatchPutCommand(
        'particle',
        pinsEntities,
        pinsEntities.length
        //   (counter) => onProgress(`⏳ Imported ${counter}/${pins.length} pins.`)
      );
      onProgress && onProgress(conter);
    },
    10
  );
  onComplete && onComplete(conter);
};

const importParticle = async (
  cid: string,
  node: IpfsNode,
  dbApi: DbWorkerApi
) => {
  return getIPFSContent(cid, node).then((content) =>
    content ? importParicleContent(content, dbApi) : false
  );
};

const importParicleContent = async (
  particle: IPFSContent,
  dbApi: DbWorkerApi
) => {
  try {
    const entity = mapParticleToEntity(particle);
    const result = await dbApi!.executePutCommand('particle', [entity]);
    return result;
  } catch (e) {
    console.error('importParicleContent', e.toString(), !!dbApi);
    return false;
  }
};

export { fetchPins, importParticles, importParicleContent, importParticle };

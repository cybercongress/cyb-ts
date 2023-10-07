import { getIPFSContent } from 'src/services/ipfs/utils/utils-ipfs';
import { IpfsNode, IPFSContent } from 'src/utils/ipfs/ipfs';
import {
  asyncIterableBatchProcessor,
  arrayToAsyncIterable,
} from 'src/utils/async/iterable';

import {
  mapParticleToEntity,
  mapPinToEntity,
} from 'src/services/CozoDb/mapping';

import { DbWorkerApi } from 'src/services/backend/workers/db/worker';

import { onProgressCallback, onCompleteCallback } from './types';

const importPins = async (
  node: IpfsNode,
  dbApi: DbWorkerApi,
  onProgress?: onProgressCallback,
  onComplete?: onCompleteCallback
) => {
  let conter = 0;
  await asyncIterableBatchProcessor(
    node.ls(),
    async (pinsBatch) => {
      // console.log('----importPins ', pinsBatch);

      const pinsEntities = pinsBatch.map(mapPinToEntity);
      conter += pinsBatch.length;
      await dbApi.executeBatchPutCommand(
        'pin',
        pinsEntities,
        pinsBatch.length
        //   (counter) => onProgress(`⏳ Imported ${counter}/${pins.length} pins.`)
      );
      onProgress && onProgress(conter);
    },
    10
  );
  onComplete && onComplete(conter);
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
  return getIPFSContent(cid, node).then((content) => {
    if (content) {
      return importParicleContent(content, dbApi);
    }
    return false;
  });
};

const importParicleContent = async (
  particle: IPFSContent,
  dbApi: DbWorkerApi
) => {
  try {
    const entity = mapParticleToEntity(particle);
    const result = (await dbApi!.executePutCommand('particle', [entity])).ok;
    return result;
  } catch (e) {
    console.error('importParicleContent', e);
    return false;
  }
};

export { importPins, importParticles, importParicleContent, importParticle };

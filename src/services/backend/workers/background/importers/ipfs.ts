import { getIPFSContent } from 'src/utils/ipfs/utils-ipfs';
import { AppIPFS, IPFSContent } from 'src/utils/ipfs/ipfs';
import {
  asyncIterableBatchProcessor,
  arrayToAsyncIterable,
} from 'src/utils/async/iterable';

import {
  mapParticleToCozoEntity as mapParticleToEntity,
  mapPinToEntity,
} from 'src/services/CozoDb/mapping';

// import dbService from '../db.service';
import { DbWorkerApi } from 'src/services/backend/workers/db/worker';
import { onProgressCallback, onCompleteCallback } from './types';

const importPins = async (
  node: AppIPFS,
  dbService: DbWorkerApi,
  onProgress?: onProgressCallback,
  onComplete?: onCompleteCallback
) => {
  let conter = 0;
  await asyncIterableBatchProcessor(
    node.pin.ls({ type: 'recursive' }),
    async (pinsBatch) => {
      const pinsEntities = pinsBatch.map(mapPinToEntity);
      conter += pinsBatch.length;
      await dbService.executeBatchPutCommand(
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
  node: AppIPFS,
  cids: string[],
  dbService: DbWorkerApi,
  onProgress?: onProgressCallback,
  onComplete?: onCompleteCallback
) => {
  let conter = 0;
  await asyncIterableBatchProcessor(
    arrayToAsyncIterable(cids),
    async (cidsBatch) => {
      const contents = await Promise.all(
        cidsBatch.map((cid) => getIPFSContent(node, cid))
      );
      const pinsEntities = contents
        .filter((c) => !!c)
        .map((content) => mapParticleToEntity(content as IPFSContent));
      conter += pinsEntities.length;
      await dbService.executeBatchPutCommand(
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

const importParicle = async (particle: IPFSContent, dbService: DbWorkerApi) => {
  try {
    const entity = mapParticleToEntity(particle);
    const result = (await dbService.executePutCommand('particle', entity)).ok;
    // console.log('importParicle', result, entity);
    return result;
  } catch (e) {
    console.error('importParicle', e);
    return false;
  }
};

export { importPins, importParticles, importParicle };

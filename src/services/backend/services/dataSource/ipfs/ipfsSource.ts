import { IpfsNode, IPFSContent } from 'src/services/ipfs/ipfs';
import { asyncIterableBatchProcessor } from 'src/utils/async/iterable';

import { mapParticleToEntity } from 'src/services/CozoDb/mapping';

import { LsResult } from 'ipfs-core-types/src/pin';

import DbApi from '../indexedDb/dbApiWrapper';

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

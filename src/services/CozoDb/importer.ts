import { mapParticleToCozoEntity } from './utils';
import cozoDb from './cozoDb';
import { from } from 'apollo-link';

export const importParicle = async (particle: IPFSContent) => {
  try {
    const entity = mapParticleToCozoEntity(particle);
    const result = await cozoDb.executePutCommand('particle', entity)?.ok;
    // console.log('importParicle', result, entity);
    return result;
  } catch (e) {
    console.error('importParicle', e);
  }
};

export const importCyberlink = async ({
  from,
  to,
  neuronAddress = '',
}: {
  from: string;
  to: string;
  neuronAddress: string;
}) => {
  try {
    const entity = { from, to, neuron_address: neuronAddress };
    const result = await cozoDb.executePutCommand('link', entity)?.ok;
    console.log('importCyberlink', result, entity);
    return result;
  } catch (e) {
    console.error('importCyberlink', e);
  }
};

type PlainCyberLink = {
  from: string;
  to: string;
};
export const importCyberlinks = async (links: PlainCyberLink[]) => {
  try {
    await cozoDb.executeBatchPutCommand(
      'link',
      links.map((l) => ({ ...l, neuron_address: '' })),
      100
    );
  } catch (e) {
    console.error('importCyberlinks', e);
  }
};

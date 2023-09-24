import { DbWorkerApi } from 'src/services/backend/workers/db/worker';

type PlainCyberLink = {
  from: string;
  to: string;
  neuronAddress?: string;
};

export const importCyberlink = async ({
  dbService,
  link,
}: {
  dbService: DbWorkerApi;
  link: PlainCyberLink;
}) => {
  try {
    const { from, to, neuronAddress } = link;
    const entity = { from, to, neuron_address: neuronAddress };
    const result = (await dbService.executePutCommand('link', [entity])).ok;
    console.log('importCyberlink', result, entity);
    return result;
  } catch (e) {
    console.error('importCyberlink', e);
  }
};

export const importCyberlinks = async (
  dbService: DbWorkerApi,
  links: PlainCyberLink[]
) => {
  try {
    await dbService.executeBatchPutCommand(
      'link',
      links.map((l) => ({ ...l, neuron_address: '' })),
      100
    );
  } catch (e) {
    console.error('importCyberlinks', e);
  }
};

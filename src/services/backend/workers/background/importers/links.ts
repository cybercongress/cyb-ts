import { DbWorkerApi } from 'src/services/backend/workers/db/worker';

export type PlainCyberLink = {
  from: string;
  to: string;
  neuronAddress?: string;
};

const importCyberlink = async ({
  dbApi,
  link,
}: {
  dbApi: DbWorkerApi;
  link: PlainCyberLink;
}) => {
  try {
    const { from, to, neuronAddress } = link;
    const entity = { from, to, neuron_address: neuronAddress };
    const result = (await dbApi!.executePutCommand('link', [entity])).ok;
    return result;
  } catch (e) {
    console.error('importCyberlink', e);
    return false;
  }
};

const importCyberlinks = async (
  links: PlainCyberLink[],
  dbApi: DbWorkerApi
) => {
  try {
    await dbApi.executeBatchPutCommand(
      'link',
      links.map((l) => ({ ...l, neuron_address: '' })),
      100
    );
  } catch (e) {
    console.error('importCyberlinks', e);
  }
};

export { importCyberlink, importCyberlinks };

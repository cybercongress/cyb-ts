import { DbWorkerApi } from 'src/services/backend/workers/db/worker';
import { request } from 'graphql-request';
import gql from 'graphql-tag';
import { Cyberlink, CyberLinkNeuron, ParticleCid } from 'src/types/base';
import { dateToNumber, numberToDate } from 'src/utils/date';

const cyberlinksByParticle = gql(`
query Cyberlinks($limit: Int, $offset: Int, $orderBy: [cyberlinks_order_by!], $where: cyberlinks_bool_exp) {
  cyberlinks(limit: $limit, offset: $offset, order_by: $orderBy, where: $where) {
    from: particle_from
    to: particle_to
    timestamp
    neuron
  }
}
`);

const cyberlinksAgregateInfo = gql(`
  query Cyberlinks($where: cyberlinks_bool_exp) {
    cyberlinks_aggregate(where: $where) {
      aggregate {
        count
      }
    }
    firstTimestamp: cyberlinks(limit: 1, order_by: { timestamp: asc }, where: $where) {
      timestamp
    }
    lastTimestamp: cyberlinks(limit: 1, order_by: { timestamp: desc }, where: $where) {
      timestamp
    }
  }
`);

const BATCH_LIMIT = '100';

type CyberlinksAgregateInfoResponse = {
  cyberlinks_aggregate: {
    aggregate: {
      count: number;
    };
  };
  firstTimestamp: {
    timestamp: string;
  }[];
  lastTimestamp: {
    timestamp: string;
  }[];
};

type CyberlinksByParticleResponse = {
  cyberlinks: Cyberlink[];
};

// const mapCyberlinkToEntity = ()

export const fetchCyberlinkAggregateInfo = async (
  particleCid: ParticleCid,
  cyberIndexUrl: string,
  timestampFrom: number
) => {
  const res = await request<CyberlinksAgregateInfoResponse>(
    cyberIndexUrl,
    cyberlinksAgregateInfo,
    {
      where: {
        _or: [
          {
            particle_to: {
              _eq: particleCid,
            },
          },
          {
            particle_from: {
              _eq: particleCid,
            },
          },
        ],
        timestamp: {
          _gt: numberToDate(timestampFrom),
        },
      },
    }
  );

  console.log(
    '-----fetchCyberlinkAggregateInfo',
    particleCid,
    timestampFrom,
    res
  );

  const {
    firstTimestamp,
    lastTimestamp,
    cyberlinks_aggregate: {
      aggregate: { count },
    },
  } = res;
  return {
    firstTimestamp:
      firstTimestamp.length > 0 ? dateToNumber(firstTimestamp[0].timestamp) : 0,
    lastTimestamp:
      lastTimestamp.length > 0 ? dateToNumber(lastTimestamp[0].timestamp) : 0,
    count,
  };
};

const fetchCyberlinks = async (
  particleCid: ParticleCid,
  cyberIndexUrl: string,
  timestampFrom: number,
  offset = 0
) => {
  const res = await request<CyberlinksByParticleResponse>(
    cyberIndexUrl,
    cyberlinksByParticle,
    {
      limit: BATCH_LIMIT,
      offset,
      orderBy: [
        {
          timestamp: 'desc',
        },
      ],
      where: {
        _or: [
          {
            particle_to: {
              _eq: particleCid,
            },
          },
          {
            particle_from: {
              _eq: particleCid,
            },
          },
        ],
        timestamp: {
          _gt: numberToDate(timestampFrom),
        },
      },
    }
  );
  return res.cyberlinks;
};

export async function* fetchCyberlinksAsyncIterable(
  cyberIndexUrl: string,

  particleCid: ParticleCid,
  timestamp: number
): AsyncIterable<Cyberlink[]> {
  let offset = 0;
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const items = await fetchCyberlinks(
      particleCid,
      cyberIndexUrl,
      timestamp,
      offset
    );

    if (items.length === 0) {
      break;
    }

    yield items;

    offset += items.length;
  }
}

const importCyberlink = async ({
  dbApi,
  link,
}: {
  dbApi: DbWorkerApi;
  link: CyberLinkNeuron;
}) => {
  try {
    const { from, to, neuron } = link;
    const entity = { from, to, neuron };
    const result = await dbApi!.executePutCommand('link', [entity]);
    return result;
  } catch (e) {
    console.error('importCyberlink', e);
    return false;
  }
};

const importCyberlinks = async (
  links: CyberLinkNeuron[],
  dbApi: DbWorkerApi
) => {
  try {
    await dbApi.executeBatchPutCommand(
      'link',
      links.map((l) => ({ ...l, neuron: '' })),
      100
    );
  } catch (e) {
    console.error('importCyberlinks', e);
  }
};

export { importCyberlink, importCyberlinks };

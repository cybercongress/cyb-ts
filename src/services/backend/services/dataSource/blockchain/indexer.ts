/* eslint-disable import/no-unused-modules */
import { request } from 'graphql-request';

import { gql } from '@apollo/client';

import { Cyberlink, ParticleCid, NeuronAddress } from 'src/types/base';
import { dateToUtcNumber, numberToUtcDate } from 'src/utils/date';
import { CYBER_INDEX_HTTPS } from 'src/constants/config';

import { CYBERLINKS_BATCH_LIMIT } from './consts';
import { fetchIterable } from './utils/fetch';
import { createIndexerClient } from '../../indexer/utils';

type CyberlinksCountResponse = {
  cyberlinks_aggregate: {
    aggregate: {
      count: number;
    };
  };
};

type CyberlinksSyncStatsResponse = {
  cyberlinks_aggregate: {
    aggregate: {
      count: number;
    };
  };
  first: {
    timestamp: string;
  }[];
  last: {
    timestamp: string;
    to: ParticleCid;
    from: ParticleCid;
  }[];
};

export type CyberlinksByParticleResponse = {
  cyberlinks: (Omit<Cyberlink, 'timestamp'> & {
    timestamp: string;
    neuron: NeuronAddress;
    transaction_hash: string;
  })[];
};
const cyberlinksByParticle = gql(`
query Cyberlinks($limit: Int, $offset: Int, $orderBy: [cyberlinks_order_by!], $where: cyberlinks_bool_exp) {
  cyberlinks(limit: $limit, offset: $offset, order_by: $orderBy, where: $where) {
    from: particle_from
    to: particle_to
    timestamp
    neuron
    transaction_hash
  }
}
`);

const cyberlinksSyncStats = gql(`
  query Cyberlinks($where: cyberlinks_bool_exp) {
    cyberlinks_aggregate(where: $where) {
      aggregate {
        count
      }
    }
    first: cyberlinks(limit: 1, order_by: { timestamp: asc }, where: $where) {
      timestamp
    }
    last: cyberlinks(limit: 1, order_by: { timestamp: desc }, where: $where) {
      timestamp,
      to: particle_to,
      from: particle_from
    }
  }
`);

const cyberlinksCountByNeuron = gql(`
  query MyQuery($address: String, $particles_from: [String!], $timestamp: timestamp) {
    cyberlinks_aggregate(where: {
        _and: [
          { neuron: {_eq: $address}},
          { particle_from: {_in: $particles_from}},
          { timestamp: {_gt: $timestamp}}
        ]
      }) {
      aggregate {
        count
      }
    }
  }
  `);

const fetchCyberlinks = async ({
  particleCid,
  timestampFrom,
  offset = 0,
  abortSignal,
}: {
  particleCid: ParticleCid;
  timestampFrom: number;
  offset?: number;
  abortSignal: AbortSignal;
}) => {
  const res = await createIndexerClient(
    abortSignal
  ).request<CyberlinksByParticleResponse>(cyberlinksByParticle, {
    limit: CYBERLINKS_BATCH_LIMIT,
    offset,
    orderBy: [
      {
        timestamp: 'asc',
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
        _gt: numberToUtcDate(timestampFrom),
      },
    },
  });
  return res.cyberlinks;
};

const fetchCyberlinksCount = async (
  address: NeuronAddress,
  particlesFrom: ParticleCid[],
  timestampFrom: number,
  abortSignal?: AbortSignal
) => {
  const res = await createIndexerClient(
    abortSignal
  ).request<CyberlinksCountResponse>(cyberlinksCountByNeuron, {
    address,
    particles_from: particlesFrom,
    timestamp: numberToUtcDate(timestampFrom),
  });

  return res?.cyberlinks_aggregate.aggregate.count;
};

const fetchCyberlinksByNeroun = async ({
  neuron,
  particlesFrom,
  timestampFrom,
  batchSize,
  offset = 0,
  abortSignal,
}: {
  neuron: NeuronAddress;
  particlesFrom: ParticleCid[];
  timestampFrom: number;
  batchSize: number;
  offset?: number;
  abortSignal?: AbortSignal;
}) => {
  const where = {
    _and: [
      {
        timestamp: {
          _gt: numberToUtcDate(timestampFrom),
        },
      },
      {
        neuron: {
          _eq: neuron,
        },
      },
      { particle_from: { _in: particlesFrom } },
    ],
  };

  const res = await createIndexerClient(
    abortSignal
  ).request<CyberlinksByParticleResponse>(cyberlinksByParticle, {
    limit: batchSize,
    offset,
    orderBy: [
      {
        timestamp: 'asc',
      },
    ],
    where,
  });

  return res.cyberlinks;
};

export const fetchCyberlinksByNerounIterable = async (
  neuron: NeuronAddress,
  particlesFrom: ParticleCid[],
  timestampFrom: number,
  batchSize: number,
  abortSignal?: AbortSignal
) =>
  fetchIterable(fetchCyberlinksByNeroun, {
    neuron,
    particlesFrom,
    timestampFrom,
    batchSize,
    abortSignal,
  });

const fetchCyberlinksIterable = (
  particleCid: ParticleCid,
  timestampFrom: number,
  abortSignal: AbortSignal
) =>
  fetchIterable(fetchCyberlinks, { particleCid, timestampFrom, abortSignal });

export { fetchCyberlinksIterable, fetchCyberlinksCount };

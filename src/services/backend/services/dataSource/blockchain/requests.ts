import { request } from 'graphql-request';
import gql from 'graphql-tag';
import { Cyberlink, ParticleCid, NeuronAddress } from 'src/types/base';
import { dateToNumber, numberToDate } from 'src/utils/date';
import { Transaction } from './types';

import { TRANSACTIONS_BATCH_LIMIT, CYBERLINKS_BATCH_LIMIT } from './consts';
import { fetchIterable } from './utils';

type TransactionsByAddressResponse = {
  messages_by_address: Transaction[];
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
  }[];
};

type CyberlinksByParticleResponse = {
  cyberlinks: Cyberlink[];
};

const messagesByAddress = gql(`
  query MyQuery($address: _text, $limit: bigint, $offset: bigint, $timestamp_from: timestamp) {
  messages_by_address(
    args: {addresses: $address, limit: $limit, offset: $offset, types: "{}"},
    order_by: {transaction: {block: {timestamp: desc}}},
    where: {transaction: {block: {timestamp: {_gt: $timestamp_from}}}}
    ) {
    transaction_hash
    value
    transaction {
      success
      block {
        timestamp,
        height
      }
    }
    type
  }
}
`);

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
      timestamp
    }
  }
`);

const fetchTransactions = async (
  cyberIndexUrl: string,
  address: NeuronAddress,
  timestampFrom: number,
  offset = 0
) => {
  const res = await request<TransactionsByAddressResponse>(
    cyberIndexUrl,
    messagesByAddress,
    {
      address: `{${address}}`,
      limit: TRANSACTIONS_BATCH_LIMIT,
      timestamp_from: numberToDate(timestampFrom),
      offset,
    }
  );
  return res.messages_by_address;
};

const fetchCyberlinks = async (
  cyberIndexUrl: string,
  particleCid: ParticleCid,
  timestampFrom: number,
  offset = 0
) => {
  const res = await request<CyberlinksByParticleResponse>(
    cyberIndexUrl,
    cyberlinksByParticle,
    {
      limit: CYBERLINKS_BATCH_LIMIT,
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

const fetchTransactionsIterable = (
  cyberIndexUrl: string,
  neuronAddress: NeuronAddress,
  timestamp: number
) => fetchIterable(fetchTransactions, cyberIndexUrl, neuronAddress, timestamp);

const fetchCyberlinksIterable = (
  cyberIndexUrl: string,
  particleCid: ParticleCid,
  timestamp: number
) => fetchIterable(fetchCyberlinks, cyberIndexUrl, particleCid, timestamp);

const fetchCyberlinkSyncStats = async (
  cyberIndexUrl: string,
  particleCid: ParticleCid,
  timestampFrom: number
) => {
  const res = await request<CyberlinksSyncStatsResponse>(
    cyberIndexUrl,
    cyberlinksSyncStats,
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
    first,
    last,
    cyberlinks_aggregate: {
      aggregate: { count },
    },
  } = res;
  return {
    firstTimestamp: first.length > 0 ? dateToNumber(first[0].timestamp) : 0,
    lastTimestamp: last.length > 0 ? dateToNumber(last[0].timestamp) : 0,
    count,
  };
};

export {
  fetchTransactionsIterable,
  fetchCyberlinksIterable,
  fetchCyberlinkSyncStats,
};

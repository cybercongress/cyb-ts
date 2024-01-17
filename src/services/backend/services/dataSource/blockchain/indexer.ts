import { request } from 'graphql-request';
import gql from 'graphql-tag';
import { Cyberlink, ParticleCid, NeuronAddress } from 'src/types/base';
import { dateToNumber, numberToDate } from 'src/utils/date';
import { Transaction } from './types';

import { TRANSACTIONS_BATCH_LIMIT, CYBERLINKS_BATCH_LIMIT } from './consts';
import { fetchIterable } from './utils/fetch';

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

const messagesByAddress = gql(`
query MyQuery($address: _text, $limit: bigint, $offset: bigint, $timestamp_from: timestamp, $types: _text) {
  messages_by_address(
    args: {addresses: $address, limit: $limit, offset: $offset, types: $types},
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
      memo
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

const fetchTransactions = async (
  cyberIndexUrl: string,
  address: NeuronAddress,
  timestampFrom: number,
  offset = 0,
  types: Transaction['type'][] = []
) => {
  try {
    const res = await request<TransactionsByAddressResponse>(
      cyberIndexUrl,
      messagesByAddress,
      {
        address: `{${address}}`,
        limit: TRANSACTIONS_BATCH_LIMIT,
        timestamp_from: numberToDate(timestampFrom),
        offset,
        types: `{${types.map((t) => `"${t}"`).join(' ,')}}`,
      }
    );
    console.log('--- fetchTransactions:', res?.messages_by_address);

    return res?.messages_by_address;
  } catch (e) {
    console.log('--- fetchTransactions:', e);
    return [];
  }
};

const fetchCyberlinks = async (
  cyberIndexUrl: string,
  particleCid: ParticleCid,
  timestampFrom: number,
  offset = 0
) => {
  try {
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
  } catch (e) {
    console.log('--- fetchCyberlinks:', e);
    return [];
  }
};

export async function fetchAllCyberlinks(
  cyberIndexUrl: string,
  cid: ParticleCid,
  timestampFrom = 0
) {
  const cyberlinsIterable = fetchCyberlinksIterable(
    cyberIndexUrl,
    cid,
    timestampFrom
  );
  const links = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const batch of cyberlinsIterable) {
    links.push(...batch);
  }
  return links;
}

const fetchTransactionsIterable = (
  cyberIndexUrl: string,
  neuronAddress: NeuronAddress,
  timestamp: number,
  types: Transaction['type'][] = []
) =>
  fetchIterable(
    fetchTransactions,
    cyberIndexUrl,
    neuronAddress,
    timestamp,
    types
  );

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

  const {
    first,
    last,
    cyberlinks_aggregate: {
      aggregate: { count },
    },
  } = res;
  const lastCyberlink = last[0];
  if (!lastCyberlink) {
    return undefined;
  }

  const isFrom = lastCyberlink?.from === particleCid;
  const lastLinkedParticle =
    lastCyberlink &&
    (lastCyberlink.from === particleCid
      ? lastCyberlink.to
      : lastCyberlink.from);

  return {
    firstTimestamp: first.length > 0 ? dateToNumber(first[0].timestamp) : 0,
    lastTimestamp: lastCyberlink ? dateToNumber(lastCyberlink.timestamp) : 0,
    lastLinkedParticle,
    isFrom,
    count,
  };
};

export {
  fetchTransactionsIterable,
  fetchTransactions,
  fetchCyberlinksIterable,
  fetchCyberlinkSyncStats,
};

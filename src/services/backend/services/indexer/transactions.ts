import { NeuronAddress } from 'src/types/base';
import { GqlType, Transaction } from './types';

import gql, { gql } from 'graphql-tag';
import { numberToDate } from 'src/utils/date';
import {
  MessagesByAddressVariables,
  gqlMessagesByAddress,
} from '../../indexer/transactions';
import {
  TransactionsByAddressResponse,
  fetchTransactions,
} from './transactions';
import { createIndexerClient } from './utils';
import {
  MessagesByAddressVariables,
  gqlMessagesByAddress,
} from './transactions';
import { camelToSnake } from 'src/services/CozoDb/utils';
import { fetchIterable } from '../dataSource/blockchain/utils/fetch';

type OrderDirection = 'desc' | 'asc';
type Abortable = { abortSignal?: AbortSignal };

export type MessagesByAddressVariables = {
  neuron: NeuronAddress;
  timestampFrom: number;
  offset?: number;
  types: Transaction['type'][];
  orderDirection: OrderDirection;
  limit: number;
} & Abortable;

export const mapMessagesByAddressVariables = ({
  neuron,
  timestampFrom,
  offset = 0,
  types = [],
  orderDirection = 'desc',
  limit,
  abortSignal,
}: MessagesByAddressVariables) => ({
  address: `{${neuron}}`,
  limit,
  timestamp_from: numberToDate(timestampFrom),
  offset,
  types: `{${types.map((t) => `"${t}"`).join(' ,')}}`,
  order_direction: orderDirection,
});

export const gqlMessagesByAddress = (type: GqlType) =>
  gql(`
${type} MyQuery($address: _text, $limit: bigint, $offset: bigint, $timestamp_from: timestamp, $types: _text, $order_direction: order_by) {
  messages_by_address(
    args: {addresses: $address, limit: $limit, offset: $offset, types: $types},
    order_by: {transaction: {block: {timestamp: $order_direction}}},
    where: {transaction: {block: {timestamp: {_gt: $timestamp_from}}}}
    ) {
    transaction_hash
    index
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
export const fetchTransactions = async ({
  neuron,
  timestampFrom,
  offset = 0,
  types = [],
  orderDirection = 'desc',
  limit,
  abortSignal,
}: MessagesByAddressVariables) => {
  const res = await createIndexerClient(
    abortSignal
  ).request<TransactionsByAddressResponse>(
    gqlMessagesByAddress('query'),
    mapMessagesByAddressVariables({
      neuron,
      timestampFrom,
      offset,
      types,
      orderDirection,
      limit,
      abortSignal,
    })
  );

  return res?.messages_by_address;
};

export type TransactionsByAddressResponse = {
  messages_by_address: Transaction[];
};
type MessagesCountResponse = {
  messages_by_address_aggregate: {
    aggregate: {
      count: number;
    };
  };
};
const transactionsCountByNeuron = gql(`
  query MyQuery($address: _text, $timestamp: timestamp) {
    messages_by_address_aggregate(
      args: {addresses: $address, limit: "100000000", offset: "0", types: "{}"},
      where: {transaction: {block: {timestamp: {_gt: $timestamp}}}}) {
        aggregate {
          count
        }
      }
  }
  `);
export const fetchTransactionMessagesCount = async (
  address: NeuronAddress,
  timestampFrom: number,
  abortSignal: AbortSignal
) => {
  try {
    const res = await createIndexerClient(
      abortSignal
    ).request<MessagesCountResponse>(transactionsCountByNeuron, {
      address: `{${address}}`,
      timestamp: numberToDate(timestampFrom),
    });

    return res?.messages_by_address_aggregate.aggregate.count;
  } catch (e) {
    console.log('--- fetchTransactionMessagesCount:', e);
    return -1;
  }
};

export const fetchTransactionsIterable = ({
  neuron,
  timestampFrom,
  types,
  orderDirection,
  limit,
  abortSignal,
}: MessagesByAddressVariables) =>
  fetchIterable(fetchTransactions, {
    neuron,
    timestampFrom,
    types,
    orderDirection,
    limit,
    abortSignal,
  });

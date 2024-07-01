import { NeuronAddress } from 'src/types/base';
import { numberToUtcDate } from 'src/utils/date';
import { fetchIterableByOffset } from 'src/utils/async/iterable';
import {
  MessagesByAddressCountDocument,
  MessagesByAddressCountQuery,
  MessagesByAddressCountQueryVariables,
  MessagesByAddressSenseDocument,
  MessagesByAddressSenseQuery,
  MessagesByAddressSenseQueryVariables,
} from 'src/generated/graphql';

import { createIndexerClient } from './utils/graphqlClient';
import { Transaction } from './types';

type OrderDirection = 'desc' | 'asc';
type Abortable = { abortSignal: AbortSignal };

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
}: MessagesByAddressVariables) => ({
  address: `{${neuron}}`,
  limit,
  timestamp_from: numberToUtcDate(timestampFrom),
  offset,
  types: `{${types.map((t) => `"${t}"`).join(' ,')}}`,
  order_direction: orderDirection,
});

const fetchTransactions = async ({
  neuron,
  timestampFrom,
  offset = 0,
  types = [],
  orderDirection = 'desc',
  limit,
  abortSignal,
}: MessagesByAddressVariables) => {
  const res = await createIndexerClient(abortSignal).request<
    MessagesByAddressSenseQuery,
    MessagesByAddressSenseQueryVariables
  >(
    MessagesByAddressSenseDocument,
    mapMessagesByAddressVariables({
      neuron,
      timestampFrom,
      offset,
      types,
      orderDirection,
      limit,
      abortSignal,
    }) as MessagesByAddressSenseQueryVariables
  );

  return res?.messages_by_address as Transaction[];
};

export const fetchTransactionMessagesCount = async (
  address: NeuronAddress,
  timestampFrom: number,
  abortSignal: AbortSignal
) => {
  const res = await createIndexerClient(abortSignal).request<
    MessagesByAddressCountQuery,
    MessagesByAddressCountQueryVariables
  >(MessagesByAddressCountDocument, {
    address: `{${address}}`,
    timestamp: numberToUtcDate(timestampFrom),
  });

  return res?.messages_by_address_aggregate.aggregate?.count;
};

export const fetchTransactionsIterable = ({
  neuron,
  timestampFrom,
  types,
  orderDirection,
  limit,
  abortSignal,
}: MessagesByAddressVariables) =>
  fetchIterableByOffset(fetchTransactions, {
    neuron,
    timestampFrom,
    types,
    orderDirection,
    limit,
    abortSignal,
  });

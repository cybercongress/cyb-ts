import { request } from 'graphql-request';
import gql from 'graphql-tag';
import { CozoDbWorkerApi } from 'src/services/backend/workers/db/worker';
import { mapTransactionToEntity } from 'src/services/CozoDb/mapping';
import { numberToDate } from 'src/utils/date';
import { Transaction } from 'src/types/transaction';
import { NeuronAddress } from 'src/types/base';
import {
  onCompleteCallback,
  onProgressCallback,
} from '../../../services/dataSource/types';

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

const BATCH_LIMIT = '100';

type TransactionsByAddressResponse = {
  messages_by_address: Transaction[];
};

const fetchTransactions = async (
  address: NeuronAddress,
  cyberIndexUrl: string,
  timestampFrom: number,
  offset = 0
) => {
  const res = await request<TransactionsByAddressResponse>(
    cyberIndexUrl,
    messagesByAddress,
    {
      address: `{${address}}`,
      limit: BATCH_LIMIT,
      timestamp_from: numberToDate(timestampFrom),
      offset,
    }
  );
  return res.messages_by_address;
};

async function* fetchTransactionsAsyncIterable(
  address: NeuronAddress,
  cyberIndexUrl: string,
  timestamp: number
): AsyncIterable<ReturnType<typeof mapTransactionToEntity>[]> {
  let offset = 0;
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const items = await fetchTransactions(
      address,
      cyberIndexUrl,
      timestamp,
      offset
    );

    if (items.length === 0) {
      break;
    }

    const txEntries = items.map((t) => mapTransactionToEntity(address, t));
    yield txEntries;

    offset += txEntries.length;
  }
}

// eslint-disable-next-line import/prefer-default-export
const importTransactions = async (
  dbApi: CozoDbWorkerApi,
  address: NeuronAddress,
  cyberIndexUrl: string,
  onProgress?: onProgressCallback,
  onComplete?: onCompleteCallback
) => {
  console.log('---importTransactions');
  let conter = 0;
  const transactionsAsyncIterable = fetchTransactionsAsyncIterable(
    address,
    cyberIndexUrl
  );
  // eslint-disable-next-line no-restricted-syntax
  for await (const entries of transactionsAsyncIterable) {
    conter += entries.length;
    await dbApi.executeBatchPutCommand('transaction', entries, entries.length);
    onProgress && onProgress(conter);
  }
  onComplete && onComplete(conter);
};

export { fetchTransactionsAsyncIterable, importTransactions };

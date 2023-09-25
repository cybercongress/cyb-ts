import { request } from 'graphql-request';
import gql from 'graphql-tag';
import { DbWorkerApi } from 'src/services/backend/workers/db/worker';
import { mapTransactionToEntity } from 'src/services/CozoDb/mapping';
import { Transaction } from 'src/types/transaction';
import { onCompleteCallback, onProgressCallback } from './types';

const messagesByAddress = gql(`
  query MyQuery($address: _text, $limit: bigint, $offset: bigint) {
  messages_by_address(args: {addresses: $address, limit: $limit, offset: $offset, types: "{}"},
    order_by: {transaction: {block: {height: desc}}}) {
    transaction_hash
    value
    transaction {
      success
      block {
        timestamp
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
  address: string,
  cyberIndexUrl: string,
  offset = 0
) => {
  const res = await request<TransactionsByAddressResponse>(
    cyberIndexUrl,
    messagesByAddress,
    {
      address: `{${address}}`,
      limit: BATCH_LIMIT,
      offset,
    }
  );
  return res.messages_by_address;
};

async function* fetchTransactionsAsyncIterable(
  address: string,
  cyberIndexUrl: string
): AsyncIterable<ReturnType<typeof mapTransactionToEntity>[]> {
  let offset = 0;
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const items = await fetchTransactions(address, cyberIndexUrl, offset);
    if (items.length === 0) {
      break;
    }
    const txEntries = items
      .filter((t) => t.transaction.success)
      .map((t) => mapTransactionToEntity(t));
    yield txEntries;
    offset += txEntries.length;
  }
}

// eslint-disable-next-line import/prefer-default-export
const importTransactions = async (
  dbApi: DbWorkerApi,
  address: string,
  cyberIndexUrl: string,
  onProgress?: onProgressCallback,
  onComplete?: onCompleteCallback
) => {
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

export { importTransactions };

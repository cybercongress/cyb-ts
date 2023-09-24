import { request } from 'graphql-request';
import gql from 'graphql-tag';
import { DbWorkerApi } from 'src/services/backend/workers/db/worker';
import { mapTransactionToEntity } from 'src/services/CozoDb/mapping';
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

const limit = '100';

const fetchTransactions = async (
  address: string,
  cyberIndexUrl: string,
  offset = 0
) => {
  const res = await request(cyberIndexUrl, messagesByAddress, {
    address: `{${address}}`,
    limit,
    offset,
  });
  return res.messages_by_address;
};

async function* fetchTransactionsAsyncIterable(
  address: string,
  cyberIndexUrl: string
): AsyncIterable<any> {
  let offset = 0;
  while (true) {
    const items = await fetchTransactions(address, cyberIndexUrl, offset);
    if (items.length === 0) {
      break;
    }
    const txEntries = items.map((t) => mapTransactionToEntity(t));
    yield txEntries;
    offset += txEntries.length;
  }
}

export const importTransactions = async (
  dbService: DbWorkerApi,
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
  for await (const entries of transactionsAsyncIterable) {
    conter += transactionsEntities.length;
    await dbService.executeBatchPutCommand(
      'transaction',
      entries,
      entries.length
    );
    onProgress && onProgress(conter);
  }
  onComplete && onComplete(conter);
};

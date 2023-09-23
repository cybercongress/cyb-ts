// import BigNumber from 'bignumber.js';
import { request } from 'graphql-request';
import gql from 'graphql-tag';
import { asyncIterableBatchProcessor } from 'src/utils/async/iterable';

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

export const importTransactions = async (
  address: string,
  cyberIndexUrl: string
) => {
  const limit = '100';
  const page = 0;
  const res = await request(cyberIndexUrl, messagesByAddress, {
    address: `{${address}}`,
    limit,
    offset: 0, //new BigNumber(limit).multipliedBy(0).toString(),
  });
  console.log('---res', res);
  return res;
};

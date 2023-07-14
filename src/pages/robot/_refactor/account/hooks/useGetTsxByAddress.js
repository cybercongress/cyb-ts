import { request } from 'graphql-request';
import gql from 'graphql-tag';
import { useInfiniteQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { CYBER } from '../../../../../utils/config';

const { CYBER_INDEX_HTTPS } = CYBER;

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

function useGetTsxByAddress(address) {
  const { status, data, error, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteQuery(
      ['messagesByAddressGql', address],
      async ({ pageParam = 0 }) => {
        const res = await request(CYBER_INDEX_HTTPS, messagesByAddress, {
          address: `{${address}}`,
          limit,
          offset: new BigNumber(limit).multipliedBy(pageParam).toString(),
        });
        return { data: res.messages_by_address, page: pageParam };
      },
      {
        getNextPageParam: (lastPage) => {
          if (lastPage.data && lastPage.data.length === 0) {
            return undefined;
          }

          const nextPage = lastPage.page !== undefined ? lastPage.page + 1 : 0;
          return nextPage;
        },
      }
    );

  return { data, error, isFetching, fetchNextPage, hasNextPage, status };
}

export default useGetTsxByAddress;

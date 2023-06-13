import { request } from 'graphql-request';
import gql from 'graphql-tag';
import { useInfiniteQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { AccountValue } from 'src/types/defaultAccount';
import { Nullable, Option } from 'src/types';
import { CYBER } from '../../../utils/config';

const { CYBER_INDEX_HTTPS } = CYBER;

const messagesByAddress = gql(`
  query MyQuery($address: _text, $limit: bigint, $offset: bigint) {
  messages_by_address(args: {addresses: $address, limit: $limit, offset: $offset, types: "{cosmos.bank.v1beta1.MsgSend}"}, 
    order_by: {transaction: {block: {height: desc}}}) {
    transaction_hash
    value
    transaction {
        success
        block {
          timestamp
        }
        memo
      }
      type
  }
}
`);

const limit = '5';

function useGetSendTxsByAddress(address: Nullable<AccountValue>) {
  const [addressBech32, setAddressBech32] = useState<Option<string>>();
  const {
    status,
    data,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery(
    ['messagesByAddressGql', addressBech32],
    async ({ pageParam = 0 }) => {
      const res = await request(CYBER_INDEX_HTTPS, messagesByAddress, {
        address: `{${addressBech32}}`,
        limit,
        offset: new BigNumber(limit).multipliedBy(pageParam).toString(),
      });
      return { data: res.messages_by_address, page: pageParam };
    },
    {
      enabled: Boolean(addressBech32),
      getNextPageParam: (lastPage) => {
        if (lastPage.data && lastPage.data.length === 0) {
          return undefined;
        }

        const nextPage = lastPage.page !== undefined ? lastPage.page + 1 : 0;
        return nextPage;
      },
    }
  );

  useEffect(() => {
    if (address) {
      setAddressBech32(address.bech32);
    }
  }, [address]);

  return {
    data,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    status,
    refetch,
  };
}

export default useGetSendTxsByAddress;

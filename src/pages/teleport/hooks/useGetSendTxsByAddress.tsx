import { request } from 'graphql-request';
import { gql } from '@apollo/client';

import { useInfiniteQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { AccountValue } from 'src/types/defaultAccount';
import { Nullable, Option } from 'src/types';
import { Log } from '@cosmjs/stargate/build/logs';

import { INDEX_HTTPS } from 'src/constants/config';

const messagesByAddress = gql(`
  query MyQuery($address: _text, $limit: bigint, $offset: bigint, $type: _text) {
  messages_by_address(args: {addresses: $address, limit: $limit, offset: $offset, types: $type},
    order_by: {transaction: {block: {height: desc}}}) {
    transaction_hash
    value
    transaction {
        success
        height
        logs
        block {
          timestamp
        }
        memo
      }
      type
  }
}
`);

type Txs = {
  success: boolean;
  height: number;
  logs: Log[];
  memo: string;
  block: {
    timestamp: string;
  };
};

export type ResponseTxsByType = {
  transaction_hash: string;
  type: string;
  transaction: Txs;
  value: any;
};

const limit = '5';

function useGetSendTxsByAddressByType(
  address: Nullable<AccountValue>,
  type: string
) {
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
    ['messagesByAddressGql', addressBech32, type],
    async ({ pageParam = 0 }) => {
      const res = await request(INDEX_HTTPS, messagesByAddress, {
        address: `{${addressBech32}}`,
        limit,
        offset: new BigNumber(limit).multipliedBy(pageParam).toString(),
        type: `{${type}}`,
      });
      return {
        data: res.messages_by_address as ResponseTxsByType[],
        page: pageParam,
      };
    },
    {
      enabled: Boolean(addressBech32) && Boolean(type),
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

export default useGetSendTxsByAddressByType;

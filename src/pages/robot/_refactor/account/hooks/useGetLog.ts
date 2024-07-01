import { useInfiniteQuery } from '@tanstack/react-query';
import { GetTxsEventResponse } from 'cosmjs-types/cosmos/tx/v1beta1/service';
import { CID_TWEET } from 'src/constants/app';
import { useMemo } from 'react';
import { getTransactions } from 'src/utils/search/utils';

const LIMIT = 20;
// TO DO refactor: need to use soft3js
const request = async (address: string, offset: number, limit: number) => {
  const events = [
    {
      key: 'cyberlink.particleFrom',
      value: CID_TWEET,
    },
    {
      key: 'cyberlink.neuron',
      value: address,
    },
  ];
  const response = await getTransactions({
    events,
    pagination: { limit, offset },
    orderBy: 'ORDER_BY_DESC',
  });
  return response.data;
};

function useGetLog(address: string | null) {
  const { data, fetchNextPage, hasNextPage, refetch, error, isInitialLoading } =
    useInfiniteQuery(
      ['useGetLog', address],
      async ({ pageParam = 0 }: { pageParam?: number }) => {
        const offset = LIMIT * pageParam;
        const response = (await request(
          address,
          offset,
          LIMIT
        )) as GetTxsEventResponse;

        return { data: response, page: pageParam };
      },
      {
        enabled: Boolean(address),
        getNextPageParam: (lastPage) => {
          const {
            page,
            data: {
              pagination: { total },
            },
          } = lastPage;

          if (!total || (page + 1) * LIMIT > total) {
            return undefined;
          }

          return page + 1;
        },
      }
    );

  const memoData = useMemo(() => {
    return (
      (data?.pages?.reduce((acc, page) => {
        return acc.concat(page.data.tx_responses);
      }, []) as unknown as GetTxsEventResponse['txResponses']) || []
    );
  }, [data]);

  return {
    data: memoData,
    fetchNextPage,
    hasNextPage,
    refetch,
    error,
    isInitialLoading,
  };
}

export default useGetLog;

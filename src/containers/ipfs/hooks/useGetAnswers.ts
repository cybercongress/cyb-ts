import { useInfiniteQuery } from '@tanstack/react-query';
import { useQueryClient } from 'src/contexts/queryClient';
import { useState } from 'react';
import { reduceParticleArr } from './useGetBackLink';
import { searchByHash } from 'src/utils/search/utils';

function useGetAnswers(hash) {
  const queryClient = useQueryClient();
  const [total, setTotal] = useState(0);
  const {
    status,
    data,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery(
    ['useGetAnswers', hash],
    async ({ pageParam = 0 }) => {
      const response = await searchByHash(queryClient, hash, pageParam, {
        storeToCozo: true,
        callback: setTotal,
      });
      const reduceArr = response.result
        ? reduceParticleArr(response.result)
        : [];

      return { data: reduceArr, page: pageParam };
    },
    {
      enabled: Boolean(queryClient),
      getNextPageParam: (lastPage) => {
        if (lastPage.data && lastPage.data.length === 0) {
          return undefined;
        }

        const nextPage = lastPage.page !== undefined ? lastPage.page + 1 : 0;
        return nextPage;
      },
    }
  );

  return {
    status,
    data,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    total,
    refetch,
  };
}

export default useGetAnswers;

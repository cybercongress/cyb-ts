import { useInfiniteQuery } from '@tanstack/react-query';
import { useQueryClient } from 'src/contexts/queryClient';
import { useState } from 'react';
import { reduceParticleArr } from './useGetBackLink';

const search = async (client, hash, page, callBack) => {
  try {
    const responseSearchResults = await client.search(hash, page);
    if (page === 0 && callBack && responseSearchResults.pagination.total) {
      callBack(responseSearchResults.pagination.total);
    }
    return responseSearchResults.result || [];
  } catch (error) {
    return [];
  }
};

function useGetAnswers(hash) {
  const queryClient = useQueryClient();
  const [total, setTotal] = useState(0);
  const { status, data, error, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteQuery(
      ['search', hash],
      async ({ pageParam = 0 }) => {
        const response = await search(queryClient, hash, pageParam, setTotal);

        const reduceArr = reduceParticleArr(response);

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

  return { status, data, error, isFetching, fetchNextPage, hasNextPage, total };
}

export default useGetAnswers;

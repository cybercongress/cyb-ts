import { useInfiniteQuery } from '@tanstack/react-query';
import { useQueryClient } from 'src/contexts/queryClient';
import { useState } from 'react';
import { reduceParticleArr } from './useGetBackLink';
import { searchByHash } from 'src/utils/search/utils';
import { useBackend } from 'src/contexts/backend/backend';
import { mapLinkToLinkDto } from 'src/services/CozoDb/mapping';

function useGetAnswers(hash) {
  const queryClient = useQueryClient();
  const { defferedDbApi } = useBackend();
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
      const response = await searchByHash(queryClient, hash, pageParam);
      const result = response?.result || [];
      const reduceArr = result ? reduceParticleArr(result) : [];
      setTotal(pageParam === 0 && response.pagination.total);

      defferedDbApi?.importCyberlinks(
        result.map((l) => mapLinkToLinkDto(hash, l.particle))
      );

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

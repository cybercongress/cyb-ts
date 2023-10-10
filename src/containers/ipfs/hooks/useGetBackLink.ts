import { useInfiniteQuery } from '@tanstack/react-query';
import { useQueryClient } from 'src/contexts/queryClient';
import { CyberLink } from 'src/types/cyberLink';
import { coinDecimals } from 'src/utils/utils';

type BackLink = {
  particle: string;
  rank: string;
};

type PaginationData = {
  total: number;
};

type Res = {
  result: BackLink[];
  pagination: PaginationData;
};

export const reduceParticleArr = (data: BackLink[]) => {
  return data.reduce<CyberLink[]>(
    (acc, item) => [
      ...acc,
      { cid: item.particle, rank: coinDecimals(item.rank), type: 'to' },
    ],
    []
  );
};

const LIMIT = 20;

function useGetBackLink(cid: string, { skip = false } = {}) {
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isInitialLoading } =
    useInfiniteQuery(
      ['useGetBackLink', cid],
      async ({ pageParam = 0 }: { pageParam?: number }) => {
        const response = (await queryClient?.backlinks(
          cid,
          pageParam,
          LIMIT
        )) as Res;

        return { data: response, page: pageParam };
      },
      {
        enabled: Boolean(queryClient && cid) && !skip,
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

  // TODO: combine 2 reduce
  const d =
    data?.pages?.reduce((acc, page) => {
      return acc.concat(page.data.result);
    }, []) || [];

  const backlinks = reduceParticleArr(d);

  return {
    backlinks,
    total: data?.pages[0].data.pagination.total || 0,
    hasNextPage,
    isInitialLoading,
    fetchNextPage,
  };
}

export default useGetBackLink;

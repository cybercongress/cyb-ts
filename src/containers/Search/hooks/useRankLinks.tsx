import { useInfiniteQuery } from '@tanstack/react-query';
import useGetBackLink from 'src/containers/ipfs/hooks/useGetBackLink';
import { useQueryClient } from 'src/contexts/queryClient';
import { getRankGrade, searchByHash } from 'src/utils/search/utils';
import { LinksTypeFilter } from '../types';
import { coinDecimals } from 'src/utils/utils';
import { merge } from './shared';

const useSearch = (hash: string, { skip = false } = {}) => {
  const cid = hash;

  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    error,
    isFetching,
    refetch,
    hasNextPage,
    isInitialLoading,
  } = useInfiniteQuery(
    ['useSearch', cid],
    async ({ pageParam = 0 }: { pageParam?: number }) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const response = await searchByHash(queryClient, cid, pageParam, {
        storeToCozo: true,
      });

      return { data: response, page: pageParam };
    },
    {
      enabled: Boolean(queryClient && cid) && !skip,
      getNextPageParam: (lastPage) => {
        if (!lastPage.data.pagination?.total) {
          return undefined;
        }

        return lastPage.page + 1;
      },
    }
  );

  return {
    data:
      data?.pages
        .reduce((acc, page) => {
          return acc.concat(
            page.data.result?.map((item) => {
              return {
                cid: item.particle,
                rank: coinDecimals(item.rank),
                grade: getRankGrade(coinDecimals(item.rank)),
                type: 'from',
              };
            })
          );
        }, [])
        .filter(Boolean) || [],
    total: data?.pages[0].data.pagination?.total || 0,
    fetchNextPage,
    error,
    refetch,
    hasNextPage,
    isInitialLoading,
    isFetching,
  };
};

function useRankLinks(
  hash: string,
  type = LinksTypeFilter.from,
  { skip = false } = {}
) {
  const linkType = type;

  const searchRank = useSearch(hash, {
    skip,
  });

  const backlinksRank = useGetBackLink(hash, {
    skip,
  });

  return {
    data: (() => {
      switch (linkType) {
        case LinksTypeFilter.to:
          return backlinksRank.backlinks;
        case LinksTypeFilter.all:
          return merge(searchRank.data, backlinksRank.backlinks).sort(
            (a, b) => {
              return parseFloat(b.rank) - parseFloat(a.rank);
            }
          );
        case LinksTypeFilter.from:
        default:
          return searchRank.data || [];
      }
    })(),
    total: (() => {
      return {
        to: backlinksRank.total,
        from: searchRank.total,
      };
    })(),
    refetch: (() => {
      switch (linkType) {
        case LinksTypeFilter.to:
          return backlinksRank.refetch;
        case LinksTypeFilter.all:
          return () => {
            searchRank.refetch();
            backlinksRank.refetch();
          };
        case LinksTypeFilter.from:
        default:
          return searchRank.refetch;
      }
    })(),
    isInitialLoading: (() => {
      switch (linkType) {
        case LinksTypeFilter.to:
          return backlinksRank.isInitialLoading;
        case LinksTypeFilter.all:
          return backlinksRank.isInitialLoading || searchRank.isInitialLoading;
        case LinksTypeFilter.from:
        default:
          return searchRank.isInitialLoading;
      }
    })(),
    isFetching: (() => {
      switch (linkType) {
        case LinksTypeFilter.to:
          return backlinksRank.isFetching;
        case LinksTypeFilter.all:
          return backlinksRank.isFetching || searchRank.isFetching;
        case LinksTypeFilter.from:
        default:
          return searchRank.isFetching;
      }
    })(),
    error: (() => {
      switch (linkType) {
        case LinksTypeFilter.to:
          return backlinksRank.error;
        case LinksTypeFilter.all:
          return backlinksRank.error || searchRank.error;
        case LinksTypeFilter.from:
        default:
          return searchRank.error;
      }
    })(),
    hasMore: (() => {
      switch (linkType) {
        case LinksTypeFilter.to:
          return backlinksRank.hasNextPage;
        case LinksTypeFilter.all:
          return backlinksRank.hasNextPage || searchRank.hasNextPage;
        case LinksTypeFilter.from:
        default:
          return searchRank.hasNextPage;
      }
    })(),
    fetchNextPage: (() => {
      switch (linkType) {
        case LinksTypeFilter.to:
          return backlinksRank.fetchNextPage;
        case LinksTypeFilter.all:
          return () => {
            backlinksRank.fetchNextPage();
            searchRank.fetchNextPage();
          };
        case LinksTypeFilter.from:
        default:
          return searchRank.fetchNextPage;
      }
    })(),
  };
}

export default useRankLinks;

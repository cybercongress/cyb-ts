import { useInfiniteQuery } from '@tanstack/react-query';
import useGetBackLink from 'src/containers/ipfs/hooks/useGetBackLink';
import { useQueryClient } from 'src/contexts/queryClient';
import { getRankGrade, searchByHash } from 'src/utils/search/utils';
import { mapLinkToLinkDto } from 'src/services/CozoDb/mapping';
import { coinDecimals } from 'src/utils/utils';
import { useBackend } from 'src/contexts/backend/backend';

import { LinksTypeFilter } from '../types';
import { merge } from './shared';

const PER_PAGE_LIMIT = 10;

const useSearch = (hash: string, { skip = false } = {}) => {
  const cid = hash;
  const { defferedDbApi } = useBackend();

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
      const response = await searchByHash(
        queryClient,
        cid,
        pageParam,
        PER_PAGE_LIMIT
      );
      const result = response?.result || [];
      result &&
        defferedDbApi?.importCyberlinks(
          result.map((l) => mapLinkToLinkDto(hash, l.particle))
        );
      return { data: response, page: pageParam };
    },
    {
      enabled: Boolean(queryClient && cid) && !skip,
      getNextPageParam: (lastPage) => {
        const total = lastPage?.data?.pagination?.total || 0;
        if (total === 0 || lastPage.page >= total - 1) {
          return undefined;
        }

        return lastPage.page + 1;
      },
    }
  );

  return {
    data:
      (data?.pages || [])
        .reduce((acc, page) => {
          return acc.concat(
            (page.data?.result || []).map((item) => {
              const rank = coinDecimals(item.rank);
              return {
                cid: item.particle,
                rank,
                grade: getRankGrade(rank),
                type: 'from',
              };
            })
          );
        }, [])
        .filter(Boolean) || [],
    total: data?.pages?.[0].data?.pagination?.total || 0,
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

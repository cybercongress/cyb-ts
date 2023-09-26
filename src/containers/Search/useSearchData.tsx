import { useInfiniteQuery } from '@tanstack/react-query';
import { getRankGrade } from 'src/utils/search/utils';
import { coinDecimals } from 'src/utils/utils';
import useGetBackLink from '../ipfs/hooks/useGetBackLink';
import useGetDiscussion from '../ipfs/hooks/useGetDiscussion';
import { useQueryClient } from 'src/contexts/queryClient';
import { LinksTypeFilter, SortBy } from './types';
import { LIMIT } from './constants';

const useSearch = (hash: string, skip?: boolean) => {
  const cid = hash;

  const queryClient = useQueryClient();

  const { data, fetchNextPage, error, isLoading } = useInfiniteQuery(
    ['useSearch', cid],
    async ({ pageParam = 0 }: { pageParam?: number }) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const response = await queryClient!.search(cid, pageParam, LIMIT);

      return { data: response, page: pageParam };
    },
    {
      enabled: Boolean(queryClient && cid) && !skip,
      getNextPageParam: (lastPage) => {
        if (!lastPage.data.pagination.total) {
          return undefined;
        }

        return lastPage.page + 1;
      },
    }
  );

  return {
    data: data?.pages.reduce((acc, page) => {
      return acc.concat(
        page.data.result.map((item) => {
          return {
            cid: item.particle,
            rank: coinDecimals(item.rank),
            grade: getRankGrade(coinDecimals(item.rank)),
            type: 'outcoming',
          };
        })
      );
    }, []),
    total: data?.pages[0].data.pagination.total,
    next: fetchNextPage,
    error,
    loading: isLoading,
  };
};

const useSearchData = (
  hash: string,
  {
    sortBy = SortBy.rank,
    linksType = LinksTypeFilter.all,
  }: {
    sortBy?: SortBy;
    linksType?: LinksTypeFilter;
  }
) => {
  const sort = sortBy;
  const linkType = linksType;

  const search = useSearch(hash);
  const backlinksRank = useGetBackLink(hash, {
    skip: sort !== SortBy.rank && linkType !== LinksTypeFilter.from,
  });
  const data = useGetDiscussion(
    { hash },
    {
      skip: sort !== SortBy.date,
    }
  );

  const dataBacklinks = useGetDiscussion(
    { hash, type: 'to' },
    {
      skip: sort !== SortBy.date,
    }
  );

  console.log(dataBacklinks);

  function next() {
    if (sort === SortBy.rank) {
      switch (linkType) {
        case LinksTypeFilter.to:
          backlinksRank.fetchNextPage();
          break;
        case LinksTypeFilter.all:
          backlinksRank.fetchNextPage();
          search.next();
          break;
        case LinksTypeFilter.from:
        default:
          search.next();
          break;
      }
    } else if (sort === SortBy.date) {
      data.fetchNextPage();
    }
  }

  console.log(search);

  // const queryNull = '0';
  // keywordHashNull = await getIpfsHash(queryNull);

  return {
    data:
      (() => {
        // (search.data || []).concat(backlinks.backlinks);

        if (sort === SortBy.rank) {
          if (linkType === LinksTypeFilter.to) {
            return backlinksRank.backlinks;
          } else if (linkType === LinksTypeFilter.all) {
            return (search.data || [])
              .concat(backlinksRank.backlinks)
              .sort((a, b) => {
                return parseFloat(b.rank) - parseFloat(a.rank);
              });
          }
          return search.data || [];
          // eslint-disable-next-line no-else-return
        } else if (sort === SortBy.date) {
          if (linkType === LinksTypeFilter.to) {
            return (
              dataBacklinks.data?.pages.reduce((acc, item) => {
                return acc.concat(item.data);
              }, []) || []
            );
          }

          return (
            data.data?.pages.reduce((acc, item) => {
              return acc.concat(item.data);
            }, []) || []
          );
        }
      })() || [],
    total: (() => {
      if (sort === SortBy.rank) {
        return {
          to: backlinksRank.total,
          from: search.total,
        };
        // eslint-disable-next-line no-else-return
      } else if (sort === SortBy.date) {
        return {
          to: dataBacklinks.total,
          from: data.total,
        };
      }
    })(),
    next,
    loading: (() => {
      return false;
      //   if (sort === SortBy.rank) {
      //     return search.loading;
      //     // eslint-disable-next-line no-else-return
      //   } else if (sort === SortBy.date) {
      //     return data.isFetching;
      //   }
    })(),
    error: null,
  };
};

export default useSearchData;

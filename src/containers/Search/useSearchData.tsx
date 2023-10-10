import { useInfiniteQuery } from '@tanstack/react-query';
import { getRankGrade, searchByHash } from 'src/utils/search/utils';
import { coinDecimals } from 'src/utils/utils';
import useGetBackLink from '../ipfs/hooks/useGetBackLink';
import useGetDiscussion from '../ipfs/hooks/useGetDiscussion';
import { useQueryClient } from 'src/contexts/queryClient';
import { LinksTypeFilter, SearchItem, SortBy } from './types';

// module is bullshit
const useSearch = (hash: string, skip?: boolean) => {
  const cid = hash;

  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    error,
    isLoading,
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
    next: fetchNextPage,
    error,
    hasNextPage,
    isInitialLoading,
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

  const searchRank = useSearch(hash);

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

  function next() {
    if (sort === SortBy.rank) {
      switch (linkType) {
        case LinksTypeFilter.to:
          backlinksRank.fetchNextPage();
          break;
        case LinksTypeFilter.all:
          backlinksRank.fetchNextPage();
          searchRank.next();
          break;
        case LinksTypeFilter.from:
        default:
          searchRank.next();
          break;
      }
    } else if (sort === SortBy.date) {
      switch (linkType) {
        case LinksTypeFilter.to:
          dataBacklinks.fetchNextPage();
          break;
        case LinksTypeFilter.all:
          data.fetchNextPage();
          dataBacklinks.fetchNextPage();
          break;
        case LinksTypeFilter.from:
        default:
          data.fetchNextPage();
          break;
      }
    }
  }

  // const queryNull = '0';
  // keywordHashNull = await getIpfsHash(queryNull);

  function merge(fromArr: SearchItem[], toArr: SearchItem[]) {
    // maybe not good algorithm
    const fromCids = fromArr.map((item) => item.cid);
    const toCids = toArr.map((item) => item.cid);

    const allCids = fromCids.filter((item) => toCids.includes(item));

    const added: string[] = [];

    return fromArr.concat(toArr).reduce<SearchItem[]>((acc, item) => {
      if (added.includes(item.cid)) {
        return acc;
      }

      if (allCids.includes(item.cid)) {
        added.push(item.cid);

        return acc.concat({
          ...item,
          type: 'all',
        });
      }

      return acc.concat(item);
    }, []);
  }

  return {
    data:
      (() => {
        if (sort === SortBy.rank) {
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

          // eslint-disable-next-line no-else-return
        } else if (sort === SortBy.date) {
          switch (linkType) {
            case LinksTypeFilter.to:
              return dataBacklinks.data;

            case LinksTypeFilter.all:
              return merge(data.data, dataBacklinks.data).sort((a, b) => {
                return (
                  new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime()
                );
              });
            case LinksTypeFilter.from:
            default:
              return data.data;
          }
        }
      })() || [],
    total: (() => {
      if (sort === SortBy.rank) {
        return {
          to: backlinksRank.total,
          from: searchRank.total,
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
    hasMore: (() => {
      if (sort === SortBy.rank) {
        switch (linkType) {
          case LinksTypeFilter.to:
            return backlinksRank.hasNextPage;
          case LinksTypeFilter.all:
            return backlinksRank.hasNextPage || searchRank.hasNextPage;
          case LinksTypeFilter.from:
          default:
            return searchRank.hasNextPage;
        }
        // eslint-disable-next-line no-else-return
      } else if (sort === SortBy.date) {
        switch (linkType) {
          case LinksTypeFilter.to:
            return dataBacklinks.hasNextPage;
          case LinksTypeFilter.all:
            return dataBacklinks.hasNextPage || data.hasNextPage;
          case LinksTypeFilter.from:
          default:
            return data.hasNextPage;
        }
      }
    })(),
    isInitialLoading: (() => {
      if (sort === SortBy.rank) {
        switch (linkType) {
          case LinksTypeFilter.to:
            return backlinksRank.isInitialLoading;
          case LinksTypeFilter.all:
            return (
              backlinksRank.isInitialLoading || searchRank.isInitialLoading
            );
          case LinksTypeFilter.from:
          default:
            return searchRank.isInitialLoading;
        }
        // eslint-disable-next-line no-else-return
      } else if (sort === SortBy.date) {
        switch (linkType) {
          case LinksTypeFilter.to:
            return dataBacklinks.isInitialLoading;
          case LinksTypeFilter.all:
            return dataBacklinks.isInitialLoading || data.isInitialLoading;
          case LinksTypeFilter.from:
          default:
            return data.isInitialLoading;
        }
      }

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

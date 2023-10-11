import useGetDiscussion from '../../ipfs/hooks/useGetDiscussion';
import { LinksTypeFilter } from '../types';
import { merge } from './shared';

function useLinksByDate(
  hash: string,
  type: LinksTypeFilter,
  { skip = false } = {}
) {
  const data = useGetDiscussion(
    { hash },
    {
      skip: skip || type === LinksTypeFilter.to,
    }
  );

  const dataBacklinks = useGetDiscussion(
    { hash, type: 'to' },
    {
      skip: skip || type === LinksTypeFilter.from,
    }
  );

  return {
    data:
      (() => {
        switch (type) {
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
      })() || [],
    total: (() => {
      return {
        to: dataBacklinks.total,
        from: data.total,
      };
    })(),
    fetchNextPage: (() => {
      switch (type) {
        case LinksTypeFilter.to:
          return dataBacklinks.fetchNextPage;

        case LinksTypeFilter.all:
          return () => {
            data.fetchNextPage();
            dataBacklinks.fetchNextPage();
          };

        case LinksTypeFilter.from:
        default:
          return data.fetchNextPage;
          break;
      }
    })(),
    hasMore: (() => {
      switch (type) {
        case LinksTypeFilter.to:
          return dataBacklinks.hasNextPage;
        case LinksTypeFilter.all:
          return dataBacklinks.hasNextPage || data.hasNextPage;
        case LinksTypeFilter.from:
        default:
          return data.hasNextPage;
      }
    })(),
    isInitialLoading: (() => {
      switch (type) {
        case LinksTypeFilter.to:
          return dataBacklinks.isInitialLoading;
        case LinksTypeFilter.all:
          return dataBacklinks.isInitialLoading || data.isInitialLoading;
        case LinksTypeFilter.from:
        default:
          return data.isInitialLoading;
      }
    })(),
    error: (() => {
      switch (type) {
        case LinksTypeFilter.to:
          return dataBacklinks.error;
        case LinksTypeFilter.all:
          return dataBacklinks.error || data.error;
        case LinksTypeFilter.from:
        default:
          return data.error;
      }
    })(),
    refetch: (() => {
      switch (type) {
        case LinksTypeFilter.to:
          return dataBacklinks.refetch;
        case LinksTypeFilter.all:
          return () => {
            data.refetch();
            dataBacklinks.refetch();
          };
        case LinksTypeFilter.from:
        default:
          return data.refetch;
      }
    })(),
  };
}

export default useLinksByDate;

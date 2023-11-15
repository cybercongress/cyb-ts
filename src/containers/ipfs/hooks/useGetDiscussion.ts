import { useInfiniteQuery } from '@tanstack/react-query';
import { getGraphQLQuery } from 'src/utils/search/utils';
import useCyberlinksCount from 'src/features/cyberlinks/hooks/useCyberlinksCount';

export enum LinkType {
  to = 'to',
  from = 'from',
}

const limit = 15;

type Props = {
  hash: string;
  type: LinkType;
};

function useGetLinks(
  { hash, type = LinkType.from }: Props,
  { skip = false } = {}
) {
  const cyberlinksCountQuery = useCyberlinksCount(hash);
  const total = cyberlinksCountQuery.data[type];

  const {
    status,
    data,
    error,
    isInitialLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery(
    ['useGetDiscussion', hash + type],
    async ({ pageParam = 0 }) => {
      const res = await getGraphQLQuery(`
      query Query {
        cyberlinks(limit: ${limit}, offset: ${
        limit * pageParam
      }, order_by: {timestamp: desc}, where: {particle_${type}: {_eq: "${hash}"}}) {
          timestamp
          particle_${type === LinkType.from ? 'to' : 'from'}
        }
      }
      `);
      const data = res.data.cyberlinks;

      return { data, page: pageParam };
    },
    {
      enabled: !skip && Boolean(hash),
      getNextPageParam: (lastPage) => {
        const { page } = lastPage;

        if (!total || (page + 1) * limit >= total) {
          return undefined;
        }

        return page + 1;
      },
    }
  );

  return {
    status,
    data:
      data?.pages?.reduce(
        (acc, page) =>
          acc.concat(
            page.data.map((item) => {
              return {
                ...item,
                cid: item[`particle_${type === LinkType.from ? 'to' : 'from'}`],
              };
            })
          ),
        []
      ) || [],
    error,
    isFetching,
    fetchNextPage,
    isInitialLoading,
    hasNextPage,
    total,
    refetch,
  };
}

export default useGetLinks;

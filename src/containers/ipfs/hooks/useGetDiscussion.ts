import useCyberlinksCount from 'src/features/cyberlinks/hooks/useCyberlinksCount';
import {
  Order_By as OrderBy,
  useCyberlinksByParticleQuery,
} from 'src/generated/graphql';
import { useEffect, useState } from 'react';
import { LinksType, LinksTypeFilter } from 'src/containers/Search/types';

const limit = 15;

type Props = {
  hash: string;
  type: LinksType;
};

function useGetLinks(
  { hash, type = LinksTypeFilter.from }: Props,
  { skip = false } = {}
) {
  // always no next page when skip
  const [hasNextPage, setHasNextPage] = useState(!skip);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const {
    loading: isFetching,
    error,
    data,
    networkStatus: status,
    refetch,
    fetchMore,
  } = useCyberlinksByParticleQuery({
    variables: {
      where:
        type === LinksTypeFilter.from
          ? { particle_from: { _eq: hash } }
          : { particle_to: { _eq: hash } },
      orderBy: { timestamp: OrderBy.Desc },
      limit,
    },
    skip: skip || !hash,
  });

  useEffect(() => {
    if (!skip) {
      setHasNextPage(true);
    }
  }, [skip]);

  useEffect(() => {
    isInitialLoading && setIsInitialLoading(false);
  }, [isFetching, isInitialLoading]);

  const fetchNextPage = () => {
    fetchMore({
      variables: {
        offset: data?.cyberlinks.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          setHasNextPage(false);
          return prev;
        }

        setHasNextPage(fetchMoreResult?.cyberlinks.length >= limit);

        return {
          ...prev,
          cyberlinks: [...prev.cyberlinks, ...fetchMoreResult.cyberlinks],
        };
      },
    });
  };

  const cyberlinksCountQuery = useCyberlinksCount(hash);
  const total = cyberlinksCountQuery.data[type];
  const particles = (data?.cyberlinks || []).map((item) => {
    return {
      cid: item[type === 'from' ? 'to' : 'from'],
      type,
      timestamp: item.timestamp,
    };
  });

  return {
    status,
    data: particles,
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

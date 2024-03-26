import {
  useCyberlinksCountByParticleFromQuery,
  useCyberlinksCountByParticleToQuery,
} from 'src/generated/graphql';

function useCyberlinksCount(cid: string) {
  const toCountQuery = useCyberlinksCountByParticleToQuery({
    variables: { cid },
  });
  const fromCountQuery = useCyberlinksCountByParticleFromQuery({
    variables: { cid },
  });

  return {
    data: {
      to: toCountQuery.data?.cyberlinks_aggregate?.aggregate?.count as
        | number
        | undefined,
      from: fromCountQuery.data?.cyberlinks_aggregate?.aggregate?.count as
        | number
        | undefined,
    },
    loading: toCountQuery.loading || fromCountQuery.loading,
    error: toCountQuery.error || fromCountQuery.error,
  };
}

export default useCyberlinksCount;

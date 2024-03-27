import { useCyberlinksCountByParticleQuery } from 'src/generated/graphql';

const getVar = (type: 'from' | 'to', cid: string) => {
  return { [`particle_${type}`]: { _eq: cid } };
};

function useCyberlinksCount(cid: string) {
  const toCountQuery = useCyberlinksCountByParticleQuery({
    variables: { where: getVar('to', cid) },
  });
  const fromCountQuery = useCyberlinksCountByParticleQuery({
    variables: { where: getVar('to', cid) },
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

import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';

function generateQuery(cid: string, type: 'to' | 'from') {
  return gql`
      query Query {
          cyberlinks_aggregate(where: {particle_${type}: {_eq: "${cid}"}}) {
              aggregate {
              count
              }
          }
      }
    `;
}

function useCyberlinksCount(cid: string) {
  const toCountQuery = useQuery(generateQuery(cid, 'to'));
  const fromCountQuery = useQuery(generateQuery(cid, 'from'));

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

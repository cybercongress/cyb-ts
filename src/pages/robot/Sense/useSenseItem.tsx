import { useQuery } from '@tanstack/react-query';
import { useBackend } from 'src/contexts/backend';

type Props = {
  // neuron or particle
  id?: string;
};

function useSenseItem({ id }: Props) {
  const { senseApi } = useBackend();

  // FIXME:
  //   const isParticle = id?.startsWith('Qm');

  console.log(id);

  const enabled = Boolean(senseApi && id);

  const getTxsQuery = useQuery({
    queryKey: ['senseApi', 'getTransactions', id],
    queryFn: async () => {
      return senseApi!.getTransactions(id!);
    },
    enabled,
  });

  const getLinksQuery = useQuery({
    queryKey: ['senseApi', 'getLinks', id],
    queryFn: async () => {
      return senseApi!.getLinks(id!);
    },
    enabled,
  });

  console.log('----getTxsQuery', getTxsQuery);
  console.log('----getLinks', getLinksQuery);

  const items = [...(getTxsQuery.data || []), ...(getLinksQuery.data || [])];

  return {
    data: items,
    loading: getTxsQuery.isLoading || getLinksQuery.isLoading,
    error: getTxsQuery.error || getLinksQuery.error,
  };
}

export default useSenseItem;

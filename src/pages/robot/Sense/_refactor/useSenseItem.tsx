import { useQuery } from '@tanstack/react-query';
import { useBackend } from 'src/contexts/backend';
import { isParticle as isParticleFunc } from 'src/features/particles/utils';

type Props = {
  // neuron or particle
  id?: string;
};

// pass as prop
const REFETCH_INTERVAL = 1000 * 20;

function useSenseItem({ id }: Props) {
  const { senseApi } = useBackend();

  const isParticle = Boolean(id && isParticleFunc(id));

  const enabled = Boolean(senseApi && id);

  const getTxsQuery = useQuery({
    queryKey: ['senseApi', 'getTransactions', id],
    queryFn: async () => {
      return senseApi!.getTransactions(id!);
    },
    enabled: enabled && !isParticle,
    refetchInterval: REFETCH_INTERVAL,
  });

  const getLinksQuery = useQuery({
    queryKey: ['senseApi', 'getLinks', id],
    queryFn: async () => {
      return senseApi!.getLinks(id!);
    },
    enabled: enabled && !isParticle,
    refetchInterval: REFETCH_INTERVAL,
  });

  console.log('----getTxsQuery', getTxsQuery);
  console.log('----getLinks', getLinksQuery);

  // delete
  const items = [
    ...(getTxsQuery.data?.reverse() || []),
    ...(getLinksQuery.data?.reverse() || []),
  ];

  return {
    data: items,
    loading: id && (getTxsQuery.isLoading || getLinksQuery.isLoading),
    error: getTxsQuery.error || getLinksQuery.error,
  };
}

export default useSenseItem;

import { useQuery } from '@tanstack/react-query';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';

function useParticleDetails(cid: string, { skip = false } = {}) {
  const { fetchWithDetails } = useQueueIpfsContent(cid);

  const { data, isLoading, error } = useQuery(
    ['particleDetails', cid],
    async () => {
      // FIXME: temporary solution
      return fetchWithDetails!(cid) || null;
    },
    {
      enabled: Boolean(cid && fetchWithDetails) && !skip,
    }
  );

  return {
    data,
    loading: isLoading,
    error,
  };
}

export default useParticleDetails;

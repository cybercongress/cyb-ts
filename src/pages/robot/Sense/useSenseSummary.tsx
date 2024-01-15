import { useQuery } from '@tanstack/react-query';
import { useBackend } from 'src/contexts/backend';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useAppSelector } from 'src/redux/hooks';
import { REFETCH_INTERVAL } from './SenseList/SenseList';

function useSenseSummary() {
  const { senseApi } = useBackend();
  const address = useAppSelector(selectCurrentAddress);

  const getSummaryQuery = useQuery({
    queryKey: ['senseApi', 'getSummary', address],
    queryFn: async () => {
      return senseApi!.getSummary();
    },
    enabled: Boolean(senseApi && address),
    refetchInterval: REFETCH_INTERVAL,
  });

  return {
    data: getSummaryQuery.data,
    isLoading: getSummaryQuery.isLoading,
    error: getSummaryQuery.error,
    refetch: getSummaryQuery.refetch,
  };
}

export default useSenseSummary;

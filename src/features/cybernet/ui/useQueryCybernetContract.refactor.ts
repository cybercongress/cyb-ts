import { useQueryClient } from 'src/contexts/queryClient';

import { useQuery } from '@tanstack/react-query';
import { CybernetContractQuery, queryCybernetContract } from '../api';

type Props = {
  query: CybernetContractQuery;
  skip?: boolean;
};

// TODO: copied from usePassportContract, reuse  core logic

function useQueryCybernetContract<DataType>({ query, skip }: Props) {
  const queryClient = useQueryClient();

  const { refetch, data, error, isLoading } = useQuery<DataType>(
    ['cybernetContract', query],
    () => {
      return queryCybernetContract(query, queryClient!);
    },
    {
      enabled: !skip && !!queryClient,
    }
  );

  return {
    data,
    loading: isLoading,
    error,
    refetch,
  };
}

export default useQueryCybernetContract;

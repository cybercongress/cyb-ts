import { CyberClient } from '@cybercongress/cyber-js';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';

function useQueryClientMethod<TData>(
  methodName: keyof CyberClient,
  params: any
) {
  const queryClient = useQueryClient();

  // TODO: think how to memo params correctly
  const memoParams = useMemo(() => params, [JSON.stringify(params)]);

  const { isLoading, data, error } = useQuery<unknown, unknown, TData>(
    ['queryClientMethod', methodName, memoParams],
    () => {
      return queryClient![methodName](...memoParams);
    },
    {
      enabled: !!queryClient,
    }
  );

  return {
    error,
    data,
    loading: isLoading,
  };
}

export default useQueryClientMethod;

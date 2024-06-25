import { CyberClient } from '@cybercongress/cyber-js';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';

function useQueryClientMethod<T extends keyof CyberClient>(
  methodName: T,
  params?: Parameters<CyberClient[T]>
) {
  const queryClient = useQueryClient();

  // TODO: think how to memo params correctly
  const memoParams = useMemo(() => params, [JSON.stringify(params)]);

  const { isLoading, data, error } = useQuery<
    unknown,
    unknown,
    ReturnType<CyberClient[T]>
  >(
    ['queryClientMethod', methodName, memoParams],
    () => {
      const func = queryClient![methodName];

      // refactor
      if (memoParams) {
        return func(...memoParams);
      }

      return func();
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

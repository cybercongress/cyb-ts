import { CyberClient } from '@cybercongress/cyber-js';
import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';

function useQueryClientMethod<DataT>(
  methodName: keyof CyberClient,
  params: any
) {
  const [data, setData] = useState<DataT>();
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  // TODO: think how to memo params correctly
  const memoParams = useMemo(() => params, []);

  useEffect(() => {
    (async () => {
      if (!queryClient) {
        return;
      }

      try {
        setLoading(true);

        const res = await queryClient[methodName](...memoParams);

        setData(res);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [queryClient, methodName, memoParams]);

  return {
    error,
    data,
    loading,
  };
}

export default useQueryClientMethod;

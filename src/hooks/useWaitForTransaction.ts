import { IndexedTx } from '@cosmjs/stargate';
import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';

// from
// https://wagmi.sh/react/hooks/useWaitForTransaction

export type Props = {
  hash: string | null | undefined;
  onSuccess?: (response: IndexedTx) => void;
};

function useWaitForTransaction({ hash, onSuccess }: Props) {
  const [data, setData] = useState<any>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const getTx = useCallback(async () => {
    if (!queryClient || !hash) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await queryClient.getTx(hash as string);

      if (response) {
        if (response.code) {
          setError(response.rawLog);
        } else {
          setData(response);
          onSuccess && onSuccess(response);
        }
      } else {
        setTimeout(getTx, 1500);
      }
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  }, [queryClient, hash, onSuccess]);

  useEffect(() => {
    getTx();
  }, [getTx]);

  return {
    data,
    error,
    isLoading,
  };
}

export default useWaitForTransaction;

import { IndexedTx } from '@cosmjs/stargate';
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from 'src/contexts/queryClient';

// from
// https://wagmi.sh/react/hooks/useWaitForTransaction

export type Props = {
  hash: string | null | undefined;
  onSuccess?: (response: IndexedTx) => void;
};

const NO_RESPONSE_ERROR = 'No response';

function useWaitForTransaction({ hash, onSuccess }: Props) {
  const queryClient = useQueryClient();

  const { data, isFetching, error } = useQuery(
    ['tx', hash],
    async () => {
      const response = await queryClient!.getTx(hash!);

      if (!response) {
        // seems not working with retry and retryDelay
        throw new Error(NO_RESPONSE_ERROR);
      } else if (response.code !== 0) {
        throw new Error(response.rawLog);
      }

      return response;
    },
    {
      enabled: Boolean(queryClient && hash),
      retry: (_, error) => {
        return error.message === NO_RESPONSE_ERROR;
      },
      retryDelay: 2500,
      onSuccess: (response) => {
        onSuccess && onSuccess(response);
      },
    }
  );

  return {
    data,
    error: error?.message,
    isLoading: isFetching,
  };
}

export default useWaitForTransaction;

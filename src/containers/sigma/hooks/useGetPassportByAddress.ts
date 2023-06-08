import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { activePassport } from '../../portal/utils';
import { Citizenship } from 'src/types/citizenship';

function useGetPassportByAddress(accounts: any) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addressBech32 =
    accounts?.account?.cyber?.bech32 ||
    accounts?.cyber?.bech32 ||
    accounts?.bech32 ||
    accounts;

  const { data } = useQuery(
    ['activePassport', addressBech32],
    async () => {
      try {
        setIsLoading(true);
        const response = await activePassport(queryClient, addressBech32);

        return response;
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    },
    {
      enabled: Boolean(queryClient && addressBech32),
    }
  );

  return {
    passport: data,
    loading: isLoading,
    error,
  } as { passport: Citizenship | null };
}

export default useGetPassportByAddress;

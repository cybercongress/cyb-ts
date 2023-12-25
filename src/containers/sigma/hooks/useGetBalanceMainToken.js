import { useQueryClient } from 'src/contexts/queryClient';
import { useGetBalance, initValueMainToken } from './utils';

function useGetBalanceMainToken(address) {
  const queryClient = useQueryClient();
  const addressActive = address?.bech32 || address;
  const data = useGetBalance(queryClient, addressActive);

  return { balance: data || { ...initValueMainToken }, loading: !data };
}

export default useGetBalanceMainToken;

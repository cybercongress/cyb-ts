import { useGetBalance, initValueMainToken } from './utils';

function useGetBalanceMainToken(address) {
  const addressActive = address?.bech32 || address;
  const { data } = useGetBalance(addressActive);

  return { balance: data || { ...initValueMainToken }, loading: !data };
}

export default useGetBalanceMainToken;

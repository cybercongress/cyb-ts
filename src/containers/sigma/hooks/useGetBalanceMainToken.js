import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { useGetBalance, initValueMainToken } from './utils';

function useGetBalanceMainToken(address) {
  const queryClient = useQueryClient();
  const [addressActive, setAddressActive] = useState(null);
  const [balance, setBalance] = useState({ ...initValueMainToken });
  const data = useGetBalance(queryClient, addressActive);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (address !== null) {
      if (address.bech32) {
        setAddressActive(address.bech32);
      } else {
        setAddressActive(address);
      }
    }
  }, [address]);

  useEffect(() => {
    setLoading(true);
    if (data !== undefined) {
      setBalance({ ...initValueMainToken });
      Object.keys(data).forEach((key) => {
        if (data[key] && data[key].amount > 0) {
          setBalance((item) => ({
            ...item,
            [key]: { ...data[key] },
            total: {
              ...item.total,
              amount: new BigNumber(item.total.amount)
                .plus(data[key].amount)
                .toNumber(),
            },
          }));
        }
      });
      setLoading(false);
    }
  }, [data]);

  return { balance, loading };
}

export default useGetBalanceMainToken;

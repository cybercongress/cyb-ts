import BigNumber from 'bignumber.js';
import { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../../context';
import { useGetBalance, initValueMainToken } from './utils';

function useGetBalanceMainToken(address) {
  const { jsCyber } = useContext(AppContext);
  const [addressActive, setAddressActive] = useState(null);
  const [balance, setBalance] = useState({ ...initValueMainToken });
  const data = useGetBalance(jsCyber, addressActive);
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

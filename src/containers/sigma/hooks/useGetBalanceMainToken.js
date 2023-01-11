import { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../../context';
import { getBalanceInfo, initValueMainToken } from './utils';

function useGetBalanceMainToken(address) {
  const { jsCyber } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState({ ...initValueMainToken });

  useEffect(() => {
    const getMainBalance = async () => {
      try {
        setLoading(true);
        if (address !== null && jsCyber !== null) {
          const { bech32 } = address;
          const response = await getBalanceInfo(jsCyber, bech32);
          if (response) {
            setBalance(response);
          }
          setLoading(false);
        }
      } catch (error) {
        console.log('error', error);
        setBalance({ ...initValueMainToken });
      }
    };
    getMainBalance();
  }, [address, jsCyber]);

  return { balance, loading };
}

export default useGetBalanceMainToken;

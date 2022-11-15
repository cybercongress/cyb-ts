import { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../../context';
import { activePassport } from '../../portal/utils';

function useGetPassportByAddress(accounts) {
  const { jsCyber } = useContext(AppContext);
  const [passport, setPassport] = useState(null);

  useEffect(() => {
    const getPassportByAddress = async () => {
      try {
        if (jsCyber !== null && accounts !== null) {
          const { bech32 } = accounts;
          const response = await activePassport(jsCyber, bech32);
          // console.log('response', response);
          if (response !== null) {
            setPassport(response);
          }
        }
      } catch (e) {
        console.log('e', e);
        setPassport(null);
      }
    };
    getPassportByAddress();
  }, [accounts, jsCyber]);

  return {
    passport,
  };
}

export default useGetPassportByAddress;

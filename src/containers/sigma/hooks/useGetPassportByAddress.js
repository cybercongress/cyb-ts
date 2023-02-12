import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../../context';
import { activePassport } from '../../portal/utils';

function useGetPassportByAddress(accounts) {
  const { jsCyber } = useContext(AppContext);
  const [passport, setPassport] = useState(null);
  const [addressBech32, setAddressBech32] = useState(null);
  const { data } = useQuery(
    ['activePassport', addressBech32],
    async () => {
      const response = await activePassport(jsCyber, addressBech32);
      if (response !== null) {
        return response;
      }
      return null;
    },
    {
      enabled: Boolean(jsCyber && addressBech32),
    }
  );

  useEffect(() => {
    if (
      accounts !== null &&
      Object.prototype.hasOwnProperty.call(accounts, 'account')
    ) {
      const { account } = accounts;
      if (
        account !== null &&
        Object.prototype.hasOwnProperty.call(account, 'cyber')
      ) {
        const { bech32 } = account.cyber;
        setAddressBech32(bech32);
      }
    }

    if (
      accounts !== null &&
      Object.prototype.hasOwnProperty.call(accounts, 'cyber')
    ) {
      const { bech32 } = accounts.cyber;
      setAddressBech32(bech32);
    }

    if (
      accounts !== null &&
      Object.prototype.hasOwnProperty.call(accounts, 'bech32')
    ) {
      const { bech32 } = accounts;
      setAddressBech32(bech32);
    }
  }, [accounts]);

  useEffect(() => {
    if (data) {
      setPassport(data);
    } else {
      setPassport(null);
    }
  }, [data]);

  return {
    passport,
  };
}

export default useGetPassportByAddress;

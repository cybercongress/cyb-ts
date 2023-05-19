import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { activePassport } from '../../portal/utils';

type Passport = {
  owner: string;
  approvals: any[];
  token_uri: string | null;
  extension: {
    addresses: {
      label: string | null;
      address: string;
    }[];
    avatar: string;
    nickname: string;
    data: any | null;
    particle: any | null;
  };
};

// TODO: refactor
function useGetPassportByAddress(accounts: any, address: string) {
  const queryClient = useQueryClient();
  const [passport, setPassport] = useState<Passport | null>(null);
  const [addressBech32, setAddressBech32] = useState(address || null);
  const { data } = useQuery(
    ['activePassport', addressBech32],
    async () => {
      const response = await activePassport(queryClient, addressBech32);

      if (response !== null) {
        return response;
      }
      return null;
    },
    {
      enabled: Boolean(queryClient && addressBech32 !== null),
    }
  );

  useEffect(() => {
    if (address) {
      return;
    }

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
      } else {
        setAddressBech32(null);
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

    if (accounts === null) {
      setAddressBech32(null);
    }
  }, [accounts, address]);

  console.log(data);

  useEffect(() => {
    if (data) {
      setPassport(data);
    } else {
      setPassport(null);
    }
  }, [data, accounts]);

  return {
    passport,
  };
}

export default useGetPassportByAddress;

import { useQuery } from '@tanstack/react-query';
import { CONTRACT_ADDRESS_PASSPORT } from 'src/containers/portal/utils';
import { getTransactions } from 'src/utils/search/utils';

const request = async (address: string, offset: number, limit: number) => {
  const events = [
    {
      key: 'wasm.minter',
      value: CONTRACT_ADDRESS_PASSPORT,
    },
    {
      key: 'wasm.owner',
      value: address,
    },
  ];
  const response = await getTransactions({
    events,
    pagination: { limit, offset },
    orderBy: 'ORDER_BY_ASC',
  });
  return response.data;
};

const LIMIT = 30;

function useGetTimeCreatePassport(address?: string) {
  const { data } = useQuery(
    ['getCreatePassport', address],
    async () => {
      if (!address) {
        return undefined;
      }

      return request(address, 0, LIMIT);
    },
    {
      enabled: Boolean(address),
    }
  );

  return data;
}

export default useGetTimeCreatePassport;

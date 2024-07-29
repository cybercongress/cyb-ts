import { useQuery } from '@tanstack/react-query';
import { getTransactions } from 'src/utils/search/utils';

const request = async (address: string, offset: number, limit: number) => {
  const events = [
    {
      key: 'message.sender',
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

const LIMIT = 1;

function useGetTimeCreatePassport(address?: string) {
  const { data } = useQuery(
    ['getFirstTxs', address],
    async () => {
      if (!address) {
        return undefined;
      }

      return request(address, 0, LIMIT);
    },
    {
      enabled: Boolean(address),
      retry: 1,
    }
  );

  return data;
}

export default useGetTimeCreatePassport;

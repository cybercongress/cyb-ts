import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { GetTxsEventResponse } from 'cosmjs-types/cosmos/tx/v1beta1/service';
import { CYBER } from 'src/utils/config';

const LIMIT = 20;

const request = async (address: string, offset: number, limit: number) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER.CYBER_NODE_URL_LCD}/cosmos/tx/v1beta1/txs?pagination.offset=${offset}&pagination.limit=${limit}&orderBy=ORDER_BY_DESC&events=cyberlink.particleFrom%3D%27QmbdH2WBamyKLPE5zu4mJ9v49qvY8BFfoumoVPMR5V4Rvx%27&events=cyberlink.neuron%3D%27${address}%27`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

function useGetLog(address: string | null) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch,
    error,
    isInitialLoading,
    isFetched,
  } = useInfiniteQuery(
    ['useGetLog', address],
    async ({ pageParam = 0 }: { pageParam?: number }) => {
      const offset = LIMIT * pageParam;
      const response = (await request(
        address,
        offset,
        LIMIT
      )) as GetTxsEventResponse;

      return { data: response, page: pageParam };
    },
    {
      enabled: Boolean(address),
      getNextPageParam: (lastPage) => {
        const {
          page,
          data: {
            pagination: { total },
          },
        } = lastPage;

        if (!total || (page + 1) * LIMIT > total) {
          return undefined;
        }

        return page + 1;
      },
    }
  );

  const d =
    data?.pages?.reduce((acc, page) => {
      return acc.concat(page.data['tx_responses']);
    }, []) || [];

  return {
    data: d,
    fetchNextPage,
    hasNextPage,
    refetch,
    error,
    isInitialLoading,
    isFetched,
  };
}

export default useGetLog;

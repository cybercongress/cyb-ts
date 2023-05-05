import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getToLink } from 'src/utils/search/utils';
import BigNumber from 'bignumber.js';

const limit = '10';

const reduceParticleArr = (data) => {
  return data.reduce((acc, item) => {
    if (
      item.tx.body.messages[0]['@type'] === '/cyber.graph.v1beta1.MsgCyberlink'
    ) {
      const cid = item.tx.body.messages[0].links[0].to;
      return [...acc, { cid, timestamp: item.timestamp }];
    }
  }, []);
};

const getTo = async (hash: string, offset: string, callBack) => {
  try {
    const response = await getToLink(hash, offset, limit);
    if (callBack && offset === '0' && response) {
      callBack(response.pagination.total);
    }
    return response.tx_responses || [];
  } catch (error) {
    return [];
  }
};

function useGetDiscussion(hash: string) {
  const [total, setTotal] = useState(0);
  const { status, data, error, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteQuery(
      ['getToLink', hash],
      async ({ pageParam = 0 }) => {
        const response = await getTo(
          hash,
          new BigNumber(limit).multipliedBy(pageParam).toString(),
          setTotal
        );

        const reduceArr = reduceParticleArr(response);

        return { data: reduceArr, page: pageParam };
      },
      {
        enabled: Boolean(hash),
        getNextPageParam: (lastPage) => {
          if (lastPage.data && lastPage.data.length === 0) {
            return undefined;
          }

          const nextPage = lastPage.page !== undefined ? lastPage.page + 1 : 0;
          return nextPage;
        },
      }
    );

  return { status, data, error, isFetching, fetchNextPage, hasNextPage, total };
}

export default useGetDiscussion;

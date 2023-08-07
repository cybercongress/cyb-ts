import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getToLink } from 'src/utils/search/utils';
import BigNumber from 'bignumber.js';

const limit = '10';

const reduceLinks = (data, cid, time) => {
  return data.reduce((acc, item) => {
    if (item.from === cid) {
      return [...acc, { cid: item.to, timestamp: time }];
    }
    return [...acc];
  }, []);
};

const reduceParticleArr = (data, cidFrom: string) => {
  return data.reduce((acc, item) => {
    const { timestamp } = item;
    if (
      item.tx.body.messages[0]['@type'] === '/cyber.graph.v1beta1.MsgCyberlink'
    ) {
      const cid = item.tx.body.messages[0].links[0].to;
      return [...acc, { cid, timestamp }];
    }

    if (
      item.tx.body.messages[0]['@type'] ===
      '/cosmwasm.wasm.v1.MsgExecuteContract'
    ) {
      const { links } = item.tx.body.messages[0].msg.cyberlink;
      const linksReduce = reduceLinks(links, cidFrom, timestamp);
      return [...acc, ...linksReduce];
    }
    return [...acc];
  }, []);
};

const getTo = async (
  hash: string,
  offset: string,
  callBack: (total: number) => void
) => {
  try {
    const response = await getToLink(hash, offset, limit);
    if (callBack && offset === '0' && response) {
      callBack(Number(response.pagination.total));
    }
    return response.tx_responses || [];
  } catch (error) {
    return [];
  }
};

function useGetDiscussion(hash: string) {
  const [total, setTotal] = useState(0);
  const {
    status,
    data,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery(
    ['useGetDiscussion', hash],
    async ({ pageParam = 0 }) => {
      const response = await getTo(
        hash,
        new BigNumber(limit).multipliedBy(pageParam).toString(),
        setTotal
      );

      const reduceArr = reduceParticleArr(response, hash);

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

  return {
    status,
    data,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    total,
    refetch,
  };
}

export default useGetDiscussion;

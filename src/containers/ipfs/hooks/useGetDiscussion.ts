import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getFromLink, getLinks } from 'src/utils/search/utils';
import BigNumber from 'bignumber.js';

const limit = '10';

export enum LinkType {
  to = 'to',
  from = 'from',
}

const reduceLinks = (data, cid, time) => {
  return data.reduce((acc, item) => {
    debugger;
    if (item.from === cid) {
      return [...acc, { cid: item.from, timestamp: time }];
    }
    return [...acc];
  }, []);
};

const reduceParticleArr = (data: any, cid: string, type: LinkType) => {
  return data.reduce((acc, item) => {
    const { timestamp } = item;
    if (
      item.tx.body.messages[0]['@type'] === '/cyber.graph.v1beta1.MsgCyberlink'
    ) {
      const cid =
        item.tx.body.messages[0].links[0][
          type === LinkType.from ? 'to' : 'from'
        ];
      return [...acc, { cid, timestamp }];
    }

    if (
      item.tx.body.messages[0]['@type'] ===
      '/cosmwasm.wasm.v1.MsgExecuteContract'
    ) {
      const { links } = item.tx.body.messages[0].msg.cyberlink;

      debugger;
      const linksReduce = reduceLinks(links, cid, timestamp, type);
      return [...acc, ...linksReduce];
    }
    return [...acc];
  }, []);
};

const request = async (
  hash: string,
  offset: string,
  callBack: (total: number) => void,
  type: LinkType
) => {
  try {
    const response = await getLinks(hash, type, { offset, limit });
    if (callBack && offset === '0' && response) {
      callBack(Number(response.pagination.total));
    }
    return response.tx_responses || [];
  } catch (error) {
    return [];
  }
};

function useGetLinks({ hash, type = LinkType.from }, { skip = false } = {}) {
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
    ['useGetDiscussion', hash + type],
    async ({ pageParam = 0 }) => {
      const response = await request(
        hash,
        new BigNumber(limit).multipliedBy(pageParam).toString(),
        setTotal,
        type
      );

      const reduceArr = reduceParticleArr(response, hash, type);

      return { data: reduceArr, page: pageParam };
    },
    {
      enabled: !skip && Boolean(hash),
      getNextPageParam: (lastPage) => {
        if (lastPage.data && lastPage.data.length === 0) {
          return undefined;
        }
        return lastPage.page + 1;
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

export default useGetLinks;

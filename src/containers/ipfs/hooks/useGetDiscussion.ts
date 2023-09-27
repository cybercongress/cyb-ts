import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getFromLink, getGraphQLQuery, getLinks } from 'src/utils/search/utils';
import BigNumber from 'bignumber.js';

export enum LinkType {
  to = 'to',
  from = 'from',
}

const reduceLinks = (data, cid, time, type: LinkType) => {
  return data.reduce((acc, item) => {
    if (item[type] === cid) {
      return [
        ...acc,
        { cid: item[type === LinkType.from ? 'to' : 'from'], timestamp: time },
      ];
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
      return [...acc, { cid, timestamp, type }];
    }

    if (
      item.tx.body.messages[0]['@type'] ===
      '/cosmwasm.wasm.v1.MsgExecuteContract'
    ) {
      const links = item.tx.body.messages[0].msg?.cyberlink?.links;

      // if (!links) {
      //   debugger;
      // }

      if (links) {
        const linksReduce = reduceLinks(links, cid, timestamp, type);
        return [...acc, ...linksReduce];
      }
    }
    return [...acc];
  }, []);
};

function graphQLQuery(cid, limit, offset, type) {
  let where = '';

  debugger;
  if (type === LinkType.from) {
    where = `{particle_from: {_eq: "${cid}"}}`;
  } else {
    where = `{particle_to: {_eq: "${cid}"}}`;
  }

  const GET_CYBERLINKS = `
  query Cyberlinks {
    cyberlinks(limit: ${String(
      limit
    )}, order_by: {height: desc}, where: ${where}) {
      particle_from
      particle_to
      neuron
      transaction_hash
    }
  }
  `;

  return GET_CYBERLINKS;
}

const useGraphQLQuery = (query: string, { skip = false } = {}) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (skip) {
      return;
    }

    (async () => {
      try {
        const response = await getGraphQLQuery(query);
        setData(response);
      } catch (e) {
        console.error(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [query, skip]);

  return { data, loading, error };
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

const limit = 10;

function useGetLinks({ hash, type = LinkType.from }, { skip = false } = {}) {
  console.log(skip);

  // const d = useGraphQLQuery(graphQLQuery(hash, limit, 0, type));

  const [total, setTotal] = useState(0);
  const {
    status,
    data,
    error,
    isInitialLoading,
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
        if (
          lastPage.data &&
          total &&
          (lastPage.page + 1) * Number(limit) < total
        ) {
          return lastPage.page + 1;
        }

        return undefined;
      },
    }
  );

  return {
    status,
    data: data?.pages?.reduce((acc, page) => acc.concat(page.data), []) || [],
    error,
    isFetching,
    fetchNextPage,
    isInitialLoading,
    hasNextPage,
    total,
    refetch,
  };
}

export default useGetLinks;

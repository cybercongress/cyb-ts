import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { Option } from 'src/types';
import { CyberLink } from 'src/types/cyberLink';
import { coinDecimals } from 'src/utils/utils';

type BackLink = {
  particle: string;
  rank: string;
};

export const reduceParticleArr = (data: BackLink[]) => {
  return data.reduce<CyberLink[]>(
    (acc, item) => [
      ...acc,
      { cid: item.particle, rank: coinDecimals(item.rank) },
    ],
    []
  );
};

function useGetBackLink(cid: string, skip?: boolean) {
  const queryClient = useQueryClient();
  const [backlinks, setBacklinks] = useState<Option<CyberLink[]>>(undefined);
  const [total, setTotal] = useState();
  const { data, fetchNextPage } = useInfiniteQuery(
    ['useGetBackLink', cid],
    async ({ pageParam = 0 }) => {
      const res = await queryClient?.backlinks(cid, pageParam);
      console.log(res);
      return res;
    },
    {
      enabled: Boolean(queryClient && cid),
      getNextPageParam: (lastPage) => {
        if (!lastPage.pagination.total) {
          return undefined;
        }

        console.log(lastPage);

        const nextPage = lastPage.page !== undefined ? lastPage.page + 1 : 0;
        return nextPage;
      },
    }
  );

  useEffect(() => {
    const feachBacklinks = async () => {
      setBacklinks(undefined);

      if (!data?.pages) {
        return;
      }

      const d = data.pages.reduce((acc, item) => {
        if (item.result) {
          return [...acc, ...item.result];
        }
        return acc;
      }, []);

      const reduceArr = reduceParticleArr(d);
      setBacklinks(reduceArr);
      setTotal(data.pages[0].pagination.total);
    };
    feachBacklinks();
  }, [data]);

  return { backlinks, total, fetchNextPage };
}

export default useGetBackLink;

import { useQuery } from '@tanstack/react-query';
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

function useGetBackLink(cid: string) {
  const queryClient = useQueryClient();
  const [backlinks, setBacklinks] = useState<Option<CyberLink[]>>(undefined);
  const { data } = useQuery(
    ['useGetBackLink', cid],
    async () => {
      return queryClient?.backlinks(cid);
    },
    {
      enabled: Boolean(queryClient && cid),
    }
  );

  useEffect(() => {
    const feachBacklinks = async () => {
      setBacklinks(undefined);
      if (data) {
        if (data.result && data.result.length > 0) {
          const { result } = data;
          const reduceArr = reduceParticleArr(result);
          setBacklinks(reduceArr);
        }
      }
    };
    feachBacklinks();
  }, [data]);

  return { backlinks };
}

export default useGetBackLink;

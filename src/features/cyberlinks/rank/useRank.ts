import { useEffect, useState } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';

function useRank(cid: string) {
  const [rank, setRank] = useState<number>();

  const queryClient = useQueryClient();

  useEffect(() => {
    (async () => {
      if (!queryClient) {
        return;
      }

      return;

      const response = await queryClient.rank(cid);

      setRank(Number(response.rank));
    })();
  }, [cid, queryClient]);

  return rank;
}

export default useRank;

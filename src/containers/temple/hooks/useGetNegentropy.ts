import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import axios from 'axios';
import { LCD_URL } from 'src/constants/config';

const getNegentropy = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${LCD_URL}/rank/negentropy`,
    });

    return response.data;
  } catch (e) {
    return null;
  }
};

const keyQuery = 'negentropy';

function useGetNegentropy(refetchInterval: number | undefined) {
  const [changeTimeAmount, setChangeTimeAmount] = useState({
    amount: 0,
    time: 0,
  });

  const { data, status } = useQuery({
    queryKey: [keyQuery],
    queryFn: async () => {
      let response = {
        negentropy: 0,
        timestamp: '',
      };

      const responseNegentropy = await getNegentropy();

      if (responseNegentropy && responseNegentropy !== null) {
        const { result } = responseNegentropy;
        const d = new Date();
        response = { negentropy: result.negentropy, timestamp: d };
      }

      return response;
    },
    refetchInterval,
  });

  useEffect(() => {
    if (data && data !== null) {
      const lastgraphStatsLs = localStorage.getItem(keyQuery);
      if (lastgraphStatsLs !== null) {
        const oldData = JSON.parse(lastgraphStatsLs);
        const timeChange =
          Date.parse(data.timestamp) - Date.parse(oldData.timestamp);
        const amountChange = new BigNumber(data.negentropy)
          .minus(oldData.negentropy)
          .toNumber();
        if (timeChange > 0 && amountChange > 0) {
          setChangeTimeAmount({
            time: timeChange,
            amount: amountChange,
          });
        }
      }
      localStorage.setItem(keyQuery, JSON.stringify(data));
    }
  }, [data]);

  return { data, status, changeTimeAmount };
}

export default useGetNegentropy;

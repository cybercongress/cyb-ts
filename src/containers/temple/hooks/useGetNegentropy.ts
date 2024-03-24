import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { LCD_URL } from 'src/constants/config';

import { AxiosResponse } from 'axios';
import { Cyber as CyberLcdApi } from 'src/generated/Cyber';

const lcdCyberApi = new CyberLcdApi({ baseURL: LCD_URL });

function dataOrEmpty<T>(response: AxiosResponse<T>) {
  try {
    return response.data;
  } catch (e) {
    return null;
  }
}

const getNegentropy = async () => {
  const response = await lcdCyberApi.negentropy();
  return dataOrEmpty(response);
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
      const result = await getNegentropy();
      return { negentropy: result?.negentropy || 0, timestamp: Date.now() };
    },
    refetchInterval,
  });

  useEffect(() => {
    if (data) {
      const lastgraphStatsLs = localStorage.getItem(keyQuery);
      if (lastgraphStatsLs !== null) {
        const oldData = JSON.parse(lastgraphStatsLs);
        const timeChange = data!.timestamp - oldData.timestamp;
        const amountChange = new BigNumber(data!.negentropy)
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

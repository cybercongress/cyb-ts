import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import request from 'graphql-request';
import { gql } from '@apollo/client';

import { useEffect, useState } from 'react';
import { INDEX_HTTPS } from 'src/constants/config';

const GET_CHARACTERS = gql`
  query MyQuery {
    account_aggregate {
      aggregate {
        count(columns: address)
      }
    }
  }
`;

function useAccountCount() {
  const keyQuery = 'accountCount';
  const [changeTimeAmount, setChangeTimeAmount] = useState({
    amount: 0,
    time: 0,
  });
  const { data, status } = useQuery({
    queryKey: [keyQuery],
    queryFn: async () => {
      let response = { accountCount: 0, timestamp: '' };
      const res = await request(INDEX_HTTPS, GET_CHARACTERS);
      const d = new Date();

      response = {
        accountCount: res.account_aggregate.aggregate.count,
        timestamp: d,
      };

      return response;
    },
    refetchInterval: 1000 * 60 * 3,
  });

  useEffect(() => {
    if (data && data !== null) {
      const lastgraphStatsLs = localStorage.getItem(keyQuery);
      if (lastgraphStatsLs !== null) {
        const oldData = JSON.parse(lastgraphStatsLs);
        const timeChange =
          Date.parse(data.timestamp) - Date.parse(oldData.timestamp);
        const amountChange = new BigNumber(data.accountCount)
          .minus(oldData.accountCount)
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

  return { data, changeTimeAmount, status };
}

export default useAccountCount;

import { useEffect, useState } from 'react';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';

import { getFollows, getGraphQLQuery } from '../../../utils/search/utils';
import { PATTERN_CYBER } from 'src/constants/app';
import { CID_TWEET } from 'src/constants/app';

const dateFormat = require('dateformat');

const QueryCyberlink = (address, yesterday, time) =>
  `query MyQuery {
    cyberlinks_aggregate(where: {_and: [{timestamp: {_gte: "${yesterday}"}}, {timestamp: {_lt: "${time}"}}, {particle_from: {_eq: "${CID_TWEET}"}}, {neuron: {_in: [${address}]}}]}) {
      aggregate {
        count
      }
    }
  }`;

export const useNewsToday = (account) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [follows, setFollows] = useState([]);
  const { fetchParticleAsync } = useQueueIpfsContent();

  useEffect(() => {
    if (account?.match(PATTERN_CYBER)) {
      const feachData = async () => {
        const responseFollows = await getFollows(account);
        if (responseFollows !== null && responseFollows.total_count > 0) {
          responseFollows.txs.forEach(async (item) => {
            const cid = item.tx.value.msg[0].value.links[0].to;
            const addressResolve = fetchParticleAsync
              ? (await fetchParticleAsync(cid))?.result?.textPreview
              : undefined;
            if (addressResolve) {
              if (addressResolve.match(PATTERN_CYBER)) {
                setFollows((itemState) => [
                  ...itemState,
                  `"${addressResolve}"`,
                ]);
              }
            }
          });
        }
      };
      feachData();
    }
  }, [account]);

  useEffect(() => {
    if (follows.length > 0) {
      feachDataCyberlink(follows);
    }
  }, [follows]);

  const feachDataCyberlink = async (followsProps) => {
    const d = new Date();
    const time = dateFormat(d, 'UTC:yyyy-mm-dd"T"HH:MM:ss');
    const yesterday = dateFormat(
      new Date(Date.parse(d) - 86400000),
      'UTC:yyyy-mm-dd"T"HH:MM:ss'
    );
    const response = await getGraphQLQuery(
      QueryCyberlink(followsProps, yesterday, time)
    );

    setCount(response.data?.cyberlinks_aggregate?.aggregate?.count || 0);
    setLoading(false);
  };

  return {
    count,
    loading,
  };
};

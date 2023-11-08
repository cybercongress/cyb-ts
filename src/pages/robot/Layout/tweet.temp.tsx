import { useEffect, useState } from 'react';
import { getFollows, getGraphQLQuery } from '../../../utils/search/utils';
import { CID_TWEET, PATTERN_CYBER } from '../../../utils/config';
import { useIpfs } from 'src/contexts/ipfs';
import { getIPFSContent } from 'src/utils/ipfs/utils-ipfs';

const dateFormat = require('dateformat');

const STAGE_ADD_AVATAR = 0;
const STAGE_ADD_FIRST_FOLLOWER = 1;
const STAGE_ADD_FIRST_TWEET = 2;
const STAGE_READY = 3;

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
  const { node } = useIpfs();

  useEffect(() => {
    if (account?.match(PATTERN_CYBER)) {
      const feachData = async () => {
        const responseFollows = await getFollows(account);
        if (responseFollows !== null && responseFollows.total_count > 0) {
          responseFollows.txs.forEach(async (item) => {
            const cid = item.tx.value.msg[0].value.links[0].to;
            const addressResolve = (await getIPFSContent(node, cid))
              ?.textPreview;
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
    if (
      response.cyberlinks_aggregate &&
      response.cyberlinks_aggregate.aggregate
    ) {
      setCount(response.cyberlinks_aggregate.aggregate.count);
      setLoading(false);
    }
  };

  return {
    count,
    loading,
  };
};

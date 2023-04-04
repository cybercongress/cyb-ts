import { useEffect, useState } from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import useIpfs from 'src/hooks/useIpfs';
import { PocketCard } from '../components';
import { Dots } from '../../../components';
import { formatNumber } from '../../../utils/utils';
import {
  getAvatar,
  getFollows,
  getFollowers,
  getTweet,
  getContent,
  getGraphQLQuery,
  getIpfsHash,
} from '../../../utils/search/utils';
import { setStageTweetActionBar } from '../../../redux/actions/pocket';
import { POCKET, PATTERN_CYBER } from '../../../utils/config';
import AvatarIpfs from '../../account/component/avatarIpfs';

const dateFormat = require('dateformat');

const STAGE_ADD_AVATAR = 0;
const STAGE_ADD_FIRST_FOLLOWER = 1;
const STAGE_ADD_FIRST_TWEET = 2;
const STAGE_READY = 3;

const QueryCyberlink = (address, yesterday, time) =>
  `query MyQuery {
    cyberlinks_aggregate(where: {_and: [{timestamp: {_gte: "${yesterday}"}}, {timestamp: {_lt: "${time}"}}, {particle_from: {_eq: "QmbdH2WBamyKLPE5zu4mJ9v49qvY8BFfoumoVPMR5V4Rvx"}}, {neuron: {_in: [${address}]}}]}) {
      aggregate {
        count
      }
    }
  }`;

const useNewsToday = (account) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [follows, setFollows] = useState([]);

  useEffect(() => {
    if (account.match(PATTERN_CYBER)) {
      const feachData = async () => {
        const responseFollows = await getFollows(account);
        if (responseFollows !== null && responseFollows.total_count > 0) {
          responseFollows.txs.forEach(async (item) => {
            const cid = item.tx.value.msg[0].value.links[0].to;
            const addressResolve = await getContent(cid);
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

function TweetCard({
  account,
  refresh,
  setStageTweetActionBarProps,
  ...props
}) {
  const { node } = useIpfs();
  const { count: countNewsToday, loading: loadingNewsToday } =
    useNewsToday(account);
  const [stage, setStage] = useState(STAGE_ADD_AVATAR);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState({
    stage: false,
    loading: true,
  });
  const [myTweet, setMyTweet] = useState({
    count: 0,
    loading: true,
  });
  const [followers, setFollowers] = useState({
    count: 0,
    loading: true,
  });
  const [follows, setFollows] = useState({
    count: 0,
    loading: true,
  });

  useEffect(() => {
    feachData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, refresh]);

  const feachData = async () => {
    getAvatarAccounts(account);
    getFollowsCount(account);
    getMyTweet(account);
    getFollow(account);
  };
  useEffect(() => {
    if (!avatar.loading && !myTweet.loading && !follows.loading) {
      if (avatar.stage && myTweet.count !== 0 && follows.count !== 0) {
        setStage(STAGE_READY);
        setStageTweetActionBarProps(POCKET.STAGE_TWEET_ACTION_BAR.TWEET);
      }
      if (avatar.stage && myTweet.count === 0 && follows.count !== 0) {
        setStage(STAGE_ADD_FIRST_TWEET);
        setStageTweetActionBarProps(POCKET.STAGE_TWEET_ACTION_BAR.TWEET);
      }
      if (avatar.stage && follows.count === 0) {
        setStage(STAGE_ADD_FIRST_FOLLOWER);
        setStageTweetActionBarProps(POCKET.STAGE_TWEET_ACTION_BAR.FOLLOW);
      }
      if (!avatar.stage) {
        setStage(STAGE_ADD_AVATAR);
        setStageTweetActionBarProps(POCKET.STAGE_TWEET_ACTION_BAR.ADD_AVATAR);
      }
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatar, myTweet, follows]);

  const getAvatarAccounts = async (address) => {
    const response = await getAvatar(address);
    if (response !== null && response.total_count > 0) {
      setAvatar({ stage: true, loading: false });
    } else {
      setAvatar({ stage: false, loading: false });
    }
  };

  const getFollow = async (address) => {
    let count = 0;
    if (address) {
      const addressHash = await getIpfsHash(address);
      const response = await getFollowers(addressHash);
      if (response !== null && response.total_count > 0) {
        count = response.total_count;
      }
      setFollowers({ loading: false, count });
    }
  };

  const getFollowsCount = async (address) => {
    let count = 0;
    const response = await getFollows(address);
    if (response !== null && response.total_count > 0) {
      count = response.total_count;
    }
    setFollows({ loading: false, count });
  };

  const getMyTweet = async (address) => {
    let count = 0;
    const response = await getTweet(address);

    if (response !== null && response.total_count > 0) {
      count = response.total_count;
    }
    setMyTweet({ loading: false, count });
  };

  if (loading) {
    return (
      <PocketCard
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        {...props}
      >
        <Dots />
      </PocketCard>
    );
  }

  if (stage === STAGE_ADD_AVATAR) {
    return (
      <PocketCard display="flex" alignItems="flex-start" {...props}>
        <Text fontSize="16px" color="#fff">
          You can start{' '}
          <Link to={`/network/bostrom/contract/${account}`}>tweeting</Link>{' '}
          right now. Adding an avatar will help others recognize your content.
        </Text>
      </PocketCard>
    );
  }

  if (stage === STAGE_ADD_FIRST_FOLLOWER) {
    return (
      <PocketCard
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        {...props}
      >
        <Text fontSize="16px" color="#fff">
          You can follow anybody while discovering content.{' '}
          <Link to="/brain">Feed</Link> will help you stay on track. Try, by
          following cyberCongress blog
        </Text>
      </PocketCard>
    );
  }

  if (stage === STAGE_ADD_FIRST_TWEET) {
    return (
      <PocketCard
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        {...props}
      >
        <Text fontSize="16px" color="#fff">
          Try to say Hello World
        </Text>
      </PocketCard>
    );
  }

  if (stage === STAGE_READY) {
    return (
      <PocketCard display="flex" flexDirection="row" {...props}>
        <Pane display="flex" flex={1}>
          <AvatarIpfs addressCyber={account} />
        </Pane>
        <Link style={{ margin: '0 10px' }} to="/sixthSense">
          <Pane
            marginX={10}
            alignItems="center"
            display="flex"
            flexDirection="column"
          >
            <Pane fontSize="20px">
              {loadingNewsToday ? (
                <Dots />
              ) : (
                formatNumber(parseFloat(countNewsToday))
              )}
            </Pane>
            <Pane color="#fff">News today</Pane>
          </Pane>
        </Link>
        <Link
          style={{ margin: '0 10px' }}
          to={`/network/bostrom/contract/${account}`}
        >
          <Pane alignItems="center" display="flex" flexDirection="column">
            <Pane fontSize="20px">{formatNumber(myTweet.count)}</Pane>
            <Pane color="#fff">My tweet</Pane>
          </Pane>
        </Link>
        <Link
          style={{ margin: '0 10px' }}
          to={`/network/bostrom/contract/${account}/follows`}
        >
          <Pane
            marginX={10}
            alignItems="center"
            display="flex"
            flexDirection="column"
          >
            <Pane fontSize="20px">{formatNumber(followers.count)}</Pane>
            <Pane color="#fff">Followers</Pane>
          </Pane>
        </Link>
      </PocketCard>
    );
  }

  return null;
}

const mapDispatchprops = (dispatch) => {
  return {
    setStageTweetActionBarProps: (stage) =>
      dispatch(setStageTweetActionBar(stage)),
  };
};

export default connect(null, mapDispatchprops)(TweetCard);

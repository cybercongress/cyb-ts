import React, { useEffect, useState } from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PocketCard } from '../components';
import { Copy, Dots, LinkWindow } from '../../../components';
import { formatNumber } from '../../../utils/utils';
import { getAvatar, getFollows, getTweet } from '../../../utils/search/utils';
import { setStageTweetActionBar } from '../../../redux/actions/pocket';
import { POCKET } from '../../../utils/config';

const FileType = require('file-type');
const isSvg = require('is-svg');
const img = require('../../../image/logo-cyb-v3.svg');

const STAGE_ADD_AVATAR = 0;
const STAGE_ADD_FIRST_FOLLOWER = 1;
const STAGE_ADD_FIRST_TWEET = 2;
const STAGE_READY = 3;

function TweetCard({
  account,
  refresh,
  setStageTweetActionBarProps,
  node,
  ...props
}) {
  const [stage, setStage] = useState(STAGE_ADD_AVATAR);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState({ loading: true, img: null });
  const [myTweet, setMyTweet] = useState(0);
  const [followers, setFollowers] = useState(0);

  useEffect(() => {
    feachData();
  }, [account, refresh]);

  const feachData = async () => {
    getAvatarAccounts(account);
    getFollow(account);
    getMyTweet(account);
  };

  useEffect(() => {
    if (!avatar.loading) {
      if (avatar.img !== null && myTweet !== 0 && followers !== 0) {
        setStage(STAGE_READY);
        setStageTweetActionBarProps(POCKET.STAGE_TWEET_ACTION_BAR.TWEET);
      }
      if (avatar.img !== null && myTweet === 0 && followers !== 0) {
        setStage(STAGE_ADD_FIRST_TWEET);
        setStageTweetActionBarProps(POCKET.STAGE_TWEET_ACTION_BAR.TWEET);
      }
      if (avatar.img !== null && myTweet === 0 && followers === 0) {
        setStage(STAGE_ADD_FIRST_FOLLOWER);
        setStageTweetActionBarProps(POCKET.STAGE_TWEET_ACTION_BAR.FOLLOW);
      }
      if (avatar.img === null && myTweet === 0 && followers === 0) {
        setStage(STAGE_ADD_AVATAR);
        setStageTweetActionBarProps(POCKET.STAGE_TWEET_ACTION_BAR.ADD_AVATAR);
      }
      setLoading(false);
    }
  }, [avatar, myTweet, followers]);

  const getAvatarAccounts = async address => {
    const response = await getAvatar(address);

    if (response !== null && response.txs.length > 0) {
      if (node !== null) {
        setAvatar({ img, loading: false });
        const cidTo =
          response.txs[response.txs.length - 1].tx.value.msg[0].value.links[0]
            .to;
        const responseDag = await node.dag.get(cidTo, {
          localResolve: false,
        });
        if (responseDag.value.size < 1.5 * 10 ** 6) {
          const responseCat = await node.cat(cidTo);
          const bufs = [];
          bufs.push(responseCat);
          const data = Buffer.concat(bufs);
          const dataFileType = await FileType.fromBuffer(data);
          if (dataFileType !== undefined) {
            const { mime } = dataFileType;
            const dataBase64 = data.toString('base64');
            if (mime.indexOf('image') !== -1) {
              const imgAvatar = `data:${mime};base64,${dataBase64}`;
              setAvatar(item => ({ ...item, img: imgAvatar }));
            }
          } else {
            const dataBase64 = data.toString();
            if (isSvg(dataBase64)) {
              const svg = `data:image/svg+xml;base64,${data.toString(
                'base64'
              )}`;
              setAvatar(item => ({ ...item, img: svg }));
            }
          }
        }
      } else {
        setAvatar({ img, loading: false });
      }
    } else {
      setAvatar(item => ({ ...item, loading: false }));
    }
  };

  const getFollow = async address => {
    let count = 0;
    const response = await getFollows(address);

    if (response !== null && response.txs.length > 0) {
      count = response.txs.length;
    }
    setFollowers(count);
  };

  const getMyTweet = async address => {
    let count = 0;
    const response = await getTweet(address);

    if (response !== null && response.txs.length > 0) {
      count = response.txs.length;
    }
    setMyTweet(count);
  };

  console.log('stage :>> ', stage);

  if (loading) {
    return (
      <PocketCard
        display="flex"
        flexDirection="column"
        paddingTop={15}
        paddingBottom={40}
        minHeight="100px"
        alignItems="flex-start"
        {...props}
      >
        <Dots />
      </PocketCard>
    );
  }

  if (stage === STAGE_ADD_AVATAR) {
    return (
      <PocketCard
        display="flex"
        paddingY={20}
        paddingX={20}
        minHeight="100px"
        alignItems="flex-start"
        {...props}
      >
        <Text fontSize="16px" color="#fff">
          You can start{' '}
          <Link to={`/network/euler/contract/${account}`}>tweet</Link> right
          now. But adding avatar will let others recognize your content
        </Text>
      </PocketCard>
    );
  }

  if (stage === STAGE_ADD_FIRST_FOLLOWER) {
    return (
      <PocketCard
        display="flex"
        flexDirection="column"
        paddingTop={15}
        paddingBottom={40}
        minHeight="100px"
        alignItems="flex-start"
        {...props}
      >
        <Text fontSize="16px" color="#fff">
          If you will follow somebody. <Link to="/brain">Feed</Link> will help
          you stay on track. Try, by following cyberCongress blog
        </Text>
      </PocketCard>
    );
  }

  if (stage === STAGE_ADD_FIRST_TWEET) {
    return (
      <PocketCard
        display="flex"
        flexDirection="column"
        paddingTop={15}
        paddingBottom={40}
        minHeight="100px"
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
      <PocketCard
        display="flex"
        flexDirection="row"
        paddingTop={15}
        paddingBottom={40}
        minHeight="100px"
        {...props}
      >
        <Pane flex={1}>
          <img
            style={{
              width: '80px',
              height: '80px',
              borderRadius: avatar !== null ? '50%' : 'none',
            }}
            alt="img-avatar"
            src={avatar.img !== null ? avatar.img : img}
          />
        </Pane>
        <Pane
          marginX={10}
          alignItems="center"
          display="flex"
          flexDirection="column"
        >
          <Pane fontSize="20px">{formatNumber(myTweet)}</Pane>
          <Pane>
            <Link to={`/network/euler/contract/${account}`}>My tweet</Link>
          </Pane>
        </Pane>
        <Pane
          marginX={10}
          alignItems="center"
          display="flex"
          flexDirection="column"
        >
          <Pane fontSize="20px">{formatNumber(followers)}</Pane>
          <Pane>
            <Link to={`/network/euler/contract/${account}`}>Followers</Link>
          </Pane>
        </Pane>
      </PocketCard>
    );
  }

  return null;
}

const mapStateToProps = store => {
  return {
    mobile: store.settings.mobile,
    node: store.ipfs.ipfs,
  };
};

const mapDispatchprops = dispatch => {
  return {
    setStageTweetActionBarProps: (amount, prize) =>
      dispatch(setStageTweetActionBar(amount, prize)),
  };
};

export default connect(mapStateToProps, mapDispatchprops)(TweetCard);

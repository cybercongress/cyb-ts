import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { Pane } from '@cybercongress/gravity';
import { NoItems, Dots, Rank } from '../../components';
import ContentItem from '../ipfs/contentItem';
import useGetTweets from './useGetTweets';
import ActionBarCont from '../market/actionBarContainer';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';

function timeSince(timeMS) {
  const seconds = Math.floor(timeMS / 1000);

  if (seconds === 0) {
    return 'now';
  }

  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return `${interval} years`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return `${interval} months`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return `${interval} days`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return `${interval} hours`;
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return `${interval} minutes`;
  }
  return `${Math.floor(seconds)} seconds`;
}

const keywordHash = 'QmbdH2WBamyKLPE5zu4mJ9v49qvY8BFfoumoVPMR5V4Rvx';

function Taverna({ node, mobile, defaultAccount }) {
  const { tweets, loadingTweets } = useGetTweets(defaultAccount, node);
  console.log(`tweets`, tweets)
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [rankLink, setRankLink] = useState(null);
  const [update, setUpdate] = useState(1);

  useEffect(() => {
    setRankLink(null);
  }, [update]);

  const onClickRank = async (key) => {
    if (rankLink === key) {
      setRankLink(null);
    } else {
      setRankLink(key);
    }
  };

  try {
    const searchItems = [];
    const d = new Date();

    if (loadingTweets) {
      return <Dots />;
    }

    searchItems.push(
      Object.keys(tweets)
        .sort((a, b) => {
          const x = Date.parse(tweets[a].time);
          const y = Date.parse(tweets[b].time);
          return y - x;
        })
        .map((key, i) => {
          let timeAgoInMS = 0;
          const time = Date.parse(d) - Date.parse(tweets[key].time);
          if (time > 0) {
            timeAgoInMS = time;
          }
          return (
            <Pane
              position="relative"
              className="hover-rank"
              display="flex"
              alignItems="center"
              marginBottom="10px"
              key={`${key}_${i}`}
            >
              {!mobile && (
                <Pane
                  className="time-discussion rank-contentItem"
                  position="absolute"
                >
                  <Rank
                    hash={key}
                    rank="n/a"
                    grade={{ from: 'n/a', to: 'n/a', value: 'n/a' }}
                    onClick={() => onClickRank(key)}
                  />
                </Pane>
              )}
              <ContentItem
                nodeIpfs={node}
                cid={key}
                item={tweets[key]}
                className="contentItem"
              />
              <Pane
                className="time-discussion rank-contentItem"
                position="absolute"
                right="0"
                fontSize={12}
                whiteSpace="nowrap"
                top="5px"
              >
                {timeSince(timeAgoInMS)} ago
              </Pane>
            </Pane>
          );
        })
    );

    return (
      <>
        <main className="block-body">
          <Pane
            width="90%"
            marginX="auto"
            marginY={0}
            display="flex"
            flexDirection="column"
          >
            <div className="container-contentItem" style={{ width: '100%' }}>
              {Object.keys(tweets).length > 0 ? (
                searchItems
              ) : (
                <NoItems text="No feeds" />
              )}
            </div>
          </Pane>
        </main>
        <ActionBarCont
          addressActive={addressActive}
          mobile={mobile}
          keywordHash={keywordHash}
          updateFunc={() => setUpdate(update + 1)}
          rankLink={rankLink}
          textBtn="Tweet"
        />
      </>
    );
  } catch (error) {
    console.log(error);
    return <div>oops...</div>;
  }
}

const mapStateToProps = (store) => {
  return {
    mobile: store.settings.mobile,
    node: store.ipfs.ipfs,
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(Taverna);

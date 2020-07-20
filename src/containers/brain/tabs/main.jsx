import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Pane, Rank, SearchItem } from '@cybercongress/gravity';
import { CardStatisics, LinkWindow } from '../../../components';
import { formatNumber } from '../../../utils/utils';
import CodeBlock from '../../ipfs/codeBlock';
import Iframe from 'react-iframe';
import Noitem from '../../account/noItem';

const htmlParser = require('react-markdown/plugins/html-parser');

const parseHtml = htmlParser({
  isValidNode: node => node.type !== 'script',
});

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

function MainTab({ loadingTwit, mobile, twit }) {
  try {
    const searchItems = [];
    const d = new Date();

    if (loadingTwit) {
      return <div>...</div>;
    }

    searchItems.push(
      Object.keys(twit)
        .sort((a, b) => {
          const x = Date.parse(twit[a].time);
          const y = Date.parse(twit[b].time);
          return y - x;
        })
        .map(key => {
          let timeAgoInMS = 0;
          const time = Date.parse(d) - Date.parse(twit[key].time);
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
                  />
                </Pane>
              )}
              <Link className="SearchItem" to={`/ipfs/${key}`}>
                <SearchItem
                  key={key}
                  status={twit[key].status}
                  text={
                    <div className="container-text-SearchItem">
                      <ReactMarkdown
                        source={twit[key].text}
                        escapeHtml={false}
                        skipHtml={false}
                        astPlugins={[parseHtml]}
                        renderers={{ code: CodeBlock }}
                        // plugins={[toc]}
                        // escapeHtml={false}
                      />
                    </div>
                  }
                  // onClick={e => (e, twit[cid].content)}
                >
                  {twit[key].content &&
                    twit[key].content.indexOf('image') !== -1 && (
                      <img
                        style={{ width: '100%', paddingTop: 10 }}
                        alt="img"
                        src={twit[key].content}
                      />
                    )}
                  {twit[key].content &&
                    twit[key].content.indexOf('application/pdf') !== -1 && (
                      <Iframe
                        width="100%"
                        height="400px"
                        className="iframe-SearchItem"
                        url={twit[key].content}
                      />
                    )}
                </SearchItem>
              </Link>
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
      <Pane
        width="90%"
        marginX="auto"
        marginY={0}
        display="flex"
        flexDirection="column"
      >
        <div className="container-contentItem" style={{ width: '100%' }}>
          {Object.keys(twit).length > 0 ? (
            searchItems
          ) : (
            <Noitem text="No feeds" />
          )}
        </div>
      </Pane>
    );
  } catch (error) {
    console.log(error);
    return <div>oops...</div>;
  }
}

export default MainTab;

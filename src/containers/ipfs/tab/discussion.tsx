import { Pane } from '@cybercongress/gravity';
import ContentItem from '../../../components/ContentItem/contentItem';
import { Rank, NoItems, Dots } from '../../../components';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { timeSince } from 'src/utils/utils';
import Loader2 from 'src/components/ui/Loader2';

const d = new Date();

function DiscussionTab({ dataDiscussion, mobile, parent }) {
  const { data, error, status, isFetching, fetchNextPage, hasNextPage } =
    dataDiscussion;
  let discussionRows = [];

  if (data?.pages) {
    discussionRows = data.pages.map((page) => (
      <React.Fragment key={page.page}>
        {page.data?.map((item, index) => {
          let timeAgoInMS = 0;
          const { cid, timestamp } = item;
          const time = Date.parse(d) - Date.parse(timestamp);
          if (time > 0) {
            timeAgoInMS = time;
          }

          return (
            <Pane
              position="relative"
              className="hover-rank"
              display="flex"
              alignItems="center"
              marginBottom="-2px"
              key={`${cid}_${index}`}
            >
              {!mobile && (
                <Pane
                  className="time-discussion rank-contentItem"
                  position="absolute"
                >
                  <Rank
                    hash={cid}
                    rank="n/a"
                    grade={{ from: 'n/a', to: 'n/a', value: 'n/a' }}
                  />
                </Pane>
              )}
              <ContentItem
                cid={cid}
                item={item}
                className="contentItem"
                parent={parent}
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
        })}
      </React.Fragment>
    ));
  }

  const fetchNextPageFnc = () => {
    setTimeout(() => {
      fetchNextPage();
    }, 250);
  };

  return (
    <div className="container-contentItem" style={{ width: '100%' }}>
      <InfiniteScroll
        dataLength={discussionRows.length}
        next={fetchNextPageFnc}
        hasMore={hasNextPage}
        loader={isFetching && <Loader2 />}
      >
        {status === 'loading' ? (
          <Dots />
        ) : status === 'error' ? (
          <span>Error: {error.message}</span>
        ) : discussionRows.length > 0 ? (
          discussionRows
        ) : (
          <NoItems text="No comments" />
        )}
      </InfiniteScroll>
    </div>
  );
}

export default DiscussionTab;

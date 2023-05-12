/* eslint-disable no-nested-ternary */
import { Pane } from '@cybercongress/gravity';
import InfiniteScroll from 'react-infinite-scroll-component';
import React from 'react';
import ContentItem from '../../../components/ContentItem/contentItem';
import { Rank, NoItems, Dots } from '../../../components';
import { getRankGrade } from '../../../utils/search/utils';
import { exponentialToDecimal, coinDecimals } from '../../../utils/utils';

function AnswersTab({ dataAnswer, mobile, parent }) {
  const { data, error, status, isFetching, fetchNextPage, hasNextPage } =
    dataAnswer;
  let answersRows = [];

  if (data) {
    answersRows = data.pages.map((page) => (
      <React.Fragment key={page.page}>
        {page.data.map((item, index) => {
          const rank = coinDecimals(item.rank);
          const grade = getRankGrade(rank);
          return (
            <Pane
              position="relative"
              className="hover-rank"
              display="flex"
              alignItems="center"
              marginBottom="10px"
              key={`${item.cid}_${index}`}
            >
              {!mobile && (
                <Pane
                  className="time-discussion rank-contentItem"
                  position="absolute"
                >
                  <Rank
                    hash={item.cid}
                    rank={exponentialToDecimal(parseFloat(rank).toPrecision(3))}
                    grade={grade}
                  />
                </Pane>
              )}
              <ContentItem
                cid={item.cid}
                item={item}
                className="contentItem"
                parent={parent}
              />
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
        dataLength={answersRows.length}
        next={fetchNextPageFnc}
        hasMore={hasNextPage}
        loader={
          isFetching && (
            <h4>
              Loading
              <Dots />
            </h4>
          )
        }
      >
        {status === 'loading' ? (
          <Dots />
        ) : status === 'error' ? (
          <span>Error: {error.message}</span>
        ) : answersRows.length > 0 ? (
          answersRows
        ) : (
          <NoItems text="No answers" />
        )}
      </InfiniteScroll>
    </div>
  );
}

export default AnswersTab;

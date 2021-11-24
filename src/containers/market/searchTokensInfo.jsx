import React from 'react';
import { Link } from 'react-router-dom';
import { Pane } from '@cybercongress/gravity';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Rank, NoItems, Dots } from '../../components';
import { exponentialToDecimal } from '../../utils/utils';
import ContentItem from '../ipfs/contentItem';

function SearchTokenInfo({
  data,
  node,
  mobile,
  selectedTokens,
  onClickRank,
  fetchMoreData,
  page,
  allPage,
}) {
  try {
    const apps = [];
    if (Object.keys(data).length > 0) {
      apps.push(
        Object.keys(data).map((key, i) => {
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
                    rank={exponentialToDecimal(
                      parseFloat(data[key].rank).toPrecision(3)
                    )}
                    grade={data[key].grade}
                    onClick={() => onClickRank(key)}
                  />
                </Pane>
              )}
              <ContentItem
                nodeIpfs={node}
                cid={key}
                item={data[key]}
                className="contentItem"
              />
            </Pane>
          );
        })
      );
    }
    return (
      <Pane
        width="90%"
        marginX="auto"
        marginY={0}
        display="flex"
        flexDirection="column"
      >
        <div className="container-contentItem" style={{ width: '100%' }}>
          <InfiniteScroll
            dataLength={Object.keys(data).length}
            next={fetchMoreData}
            hasMore={page < allPage}
            loader={
              <h4>
                Loading
                <Dots />
              </h4>
            }
            pullDownToRefresh
            pullDownToRefreshContent={
              <h3 style={{ textAlign: 'center' }}>
                &#8595; Pull down to refresh
              </h3>
            }
            releaseToRefreshContent={
              <h3 style={{ textAlign: 'center' }}>
                &#8593; Release to refresh
              </h3>
            }
            refreshFunction={fetchMoreData}
          >
            {Object.keys(data).length > 0 ? (
              apps
            ) : (
              <NoItems text={`No information about ${selectedTokens}`} />
            )}
          </InfiniteScroll>
        </div>
      </Pane>
    );
  } catch (error) {
    console.log(error);
    return <div>oops...</div>;
  }
}

export default SearchTokenInfo;

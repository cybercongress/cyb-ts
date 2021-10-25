import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Rank, Pane } from '@cybercongress/gravity';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getRelevance, getRankGrade } from '../../utils/search/utils';
import { Dots, Loading } from '../../components';
import ContentItem from '../ipfs/contentItem';
import { formatNumber } from '../../utils/utils';

const Relevace = ({ items, fetchMoreData, page, allPage, mobile, node }) => (
  <InfiniteScroll
    dataLength={Object.keys(items).length}
    next={fetchMoreData}
    hasMore
    loader={
      <h4>
        Loading
        <Dots />
      </h4>
    }
    pullDownToRefresh
    pullDownToRefreshContent={
      <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
    }
    releaseToRefreshContent={
      <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
    }
    refreshFunction={fetchMoreData}
  >
    {Object.keys(items).map((key) => {
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
                rank={items[key].rank}
                grade={items[key].grade}
              />
            </Pane>
          )}
          <ContentItem
            nodeIpfs={node}
            cid={key}
            item={items[key]}
            className="contentItem"
          />
        </Pane>
      );
    })}
  </InfiniteScroll>
);

function Objects({ node, mobile }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allPage, setAllPage] = useState(1);

  useEffect(() => {
    getFirstItem();
  }, []);

  const getFirstItem = async () => {
    const data = await getRelevance(page);
    const links = data.result.reduce(
      (obj, link) => ({
        ...obj,
        [link.particle]: {
          rank: formatNumber(link.rank, 6),
          particle: link.particle,
          grade: getRankGrade(link.rank),
          status: 'impossibleLoad',
          text: link.particle,
          content: false,
        },
      }),
      {}
    );

    setItems(links);
    setPage(page + 1);
    setLoading(false);
    setAllPage(Math.ceil(parseFloat(data.pagination.total) / 50));
  };

  const fetchMoreData = async () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    const data = await getRelevance(page);
    const links = data.result.reduce(
      (obj, link) => ({
        ...obj,
        [link.particle]: {
          rank: formatNumber(link.rank, 6),
          particle: link.particle,
          grade: getRankGrade(link.rank),
          status: 'impossibleLoad',
          text: link.particle,
          content: false,
        },
      }),
      {}
    );

    setTimeout(() => {
      setItems((itemState) => ({ ...itemState, ...links }));
      setPage((itemPage) => itemPage + 1);
    }, 500);
  };

  if (loading) {
    return (
      <div
        style={{
          width: '100%',
          height: '50vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Loading />
      </div>
    );
  }

  return (
    <main
      // style={{
      //   padding: '10px 1em 1em 1em',
      //   height: '1px',
      //   maxHeight: 'calc(100vh - 96px)',
      // }}
      className="block-body"
    >
      <Pane
        width="90%"
        marginX="auto"
        marginY={0}
        display="flex"
        flexDirection="column"
      >
        <div className="container-contentItem" style={{ width: '100%' }}>
          <Relevace
            items={items}
            fetchMoreData={fetchMoreData}
            page={page}
            allPage={allPage}
            node={node}
            mobile={mobile}
          />
        </div>
      </Pane>
    </main>
  );
}

const mapStateToProps = (store) => {
  return {
    node: store.ipfs.ipfs,
    mobile: store.settings.mobile,
  };
};

export default connect(mapStateToProps)(Objects);

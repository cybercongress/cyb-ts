import { useState, useEffect } from 'react';
import { Pane } from '@cybercongress/gravity';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDevice } from 'src/contexts/device';
import { getRelevance, getRankGrade } from '../../utils/search/utils';
import { Dots, Loading, Rank } from '../../components';
import ContentItem from '../../components/ContentItem/contentItem';
import { coinDecimals } from '../../utils/utils';
import { MainContainer } from '../portal/components';

function Relevance({ items, fetchMoreData, page, allPage }) {
  const { isMobile: mobile } = useDevice();

  return (
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
            key={key}
            position="relative"
            className="hover-rank"
            display="flex"
            alignItems="center"
            marginBottom="-2px"
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
              cid={key}
              item={items[key]}
              className="contentItem"
              parent="particles"
            />
          </Pane>
        );
      })}
    </InfiniteScroll>
  );
}

function Objects() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allPage, setAllPage] = useState(1);

  useEffect(() => {
    getFirstItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFirstItem = async () => {
    const data = await getRelevance(page);
    const links = data.result.reduce(
      (obj, link) => ({
        ...obj,
        [link.particle]: {
          rank: coinDecimals(link.rank),
          particle: link.particle,
          grade: getRankGrade(coinDecimals(link.rank)),
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
          rank: coinDecimals(link.rank),
          particle: link.particle,
          grade: getRankGrade(coinDecimals(link.rank)),
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
    <MainContainer width="90%">
      <Relevance
        items={items}
        fetchMoreData={fetchMoreData}
        page={page}
        allPage={allPage}
      />
    </MainContainer>
  );
}

export default Objects;

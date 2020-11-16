import React, { useState, useEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { Rank, Pane, Text, Tablist } from '@cybercongress/gravity';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  getRelevance,
  getRankGrade,
  getContentByCid,
  getAmountATOM,
  getTxCosmos,
  getGraphQLQuery,
} from '../../../utils/search/utils';
import { Dots, LinkWindow, TabBtn, Loading } from '../../../components';
import LoadTab from '../tab/loadTab';
import ContentItem from '../../ipfs/contentItem';
import { formatNumber } from '../../../utils/utils';
import { DISTRIBUTION, TAKEOFF } from '../../../utils/config';

const GET_RELEVANCE = `
query getRelevanceLeaderboard {
  relevance_leaderboard {
    subject
    share
  }
}
`;

const Relevace = ({ items, fetchMoreData, page, allPage, mobile, node }) => (
  <InfiniteScroll
    dataLength={Object.keys(items).length}
    next={fetchMoreData}
    hasMore={page < allPage}
    loader={
      <h4>
        Loading
        <Dots />
      </h4>
    }
    scrollableTarget="scrollableDiv"
  >
    {Object.keys(items).map(key => {
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
            className="SearchItem"
          />
        </Pane>
      );
    })}
  </InfiniteScroll>
);

function GolRelevance({ node, mobile }) {
  let content;
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(0);
  const [selected, setSelected] = useState('relevace');
  const [allPage, setAllPage] = useState(1);
  const [dataLeaderboard, setDataLeaderboard] = useState({});
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  useEffect(() => {
    getFirstItem();
    getTxsCosmos();
  }, []);

  useEffect(() => {
    chekPathname();
  }, [location.pathname]);

  useEffect(() => {
    const feachData = async () => {
      const prize = Math.floor(
        (DISTRIBUTION.relevance / TAKEOFF.ATOMsALL) * amount
      );
      const responseRelevanceQ = await getGraphQLQuery(GET_RELEVANCE);
      if (
        responseRelevanceQ !== null &&
        Object.keys(responseRelevanceQ.relevance_leaderboard).length > 0
      ) {
        const data = responseRelevanceQ.relevance_leaderboard.reduce(
          (obj, item) => {
            return {
              ...obj,
              [item.subject]: {
                cybWon: item.share * prize,
              },
            };
          },
          {}
        );
        setDataLeaderboard(data);
      }
      setLoadingLeaderboard(false);
    };
    feachData();
  }, [amount]);

  const getTxsCosmos = async () => {
    let amountAtom = 0;
    const dataTx = await getTxCosmos();
    if (dataTx !== null && dataTx.txs) {
      amountAtom = await getAmountATOM(dataTx.txs);
    }
    setAmount(amountAtom);
  };

  const chekPathname = () => {
    const { pathname } = location;

    if (
      pathname.match(/leaderboard/gm) &&
      pathname.match(/leaderboard/gm).length > 0
    ) {
      setSelected('leaderboard');
    } else {
      setSelected('relevace');
    }
  };

  const getFirstItem = async () => {
    const data = await getRelevance(page);
    const links = data.cids.reduce(
      (obj, link) => ({
        ...obj,
        [link.cid]: {
          rank: formatNumber(link.rank, 6),
          cid: link.cid,
          grade: getRankGrade(link.rank),
          status: node !== null ? 'understandingState' : 'impossibleLoad',
          text: link.cid,
          content: false,
        },
      }),
      {}
    );

    setItems(links);
    setPage(page + 1);
    setLoading(false);
    setAllPage(Math.ceil(parseFloat(data.total) / 50));
  };

  const fetchMoreData = async () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    const data = await getRelevance(page);
    const links = data.cids.reduce(
      (obj, link) => ({
        ...obj,
        [link.cid]: {
          rank: formatNumber(link.rank, 6),
          cid: link.cid,
          grade: getRankGrade(link.rank),
          status: node !== null ? 'understandingState' : 'impossibleLoad',
          text: link.cid,
          content: false,
        },
      }),
      {}
    );

    setTimeout(() => {
      setItems(itemState => ({ ...itemState, ...links }));
      setPage(itemPage => itemPage + 1);
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

  if (selected === 'leaderboard') {
    content = (
      <Route
        path="/gol/relevance/leaderboard"
        render={() => (
          <LoadTab
            loading={loadingLeaderboard}
            progress={false}
            data={dataLeaderboard}
            progressFalse
          />
        )}
      />
    );
  }

  if (selected === 'relevace') {
    content = (
      <div
        id="scrollableDiv"
        style={{ height: '100%', padding: '0 10px', overflow: 'auto' }}
      >
        <Relevace
          items={items}
          fetchMoreData={fetchMoreData}
          page={page}
          allPage={allPage}
          node={node}
          mobile={mobile}
        />
      </div>
    );
  }

  return (
    <main
      style={{
        padding: '10px 1em 1em 1em',
        height: '1px',
        maxHeight: 'calc(100vh - 96px)',
      }}
      className="block-body"
    >
      <Pane
        boxShadow="0px 0px 5px #36d6ae"
        paddingX={20}
        paddingY={20}
        marginY={20}
      >
        <Text fontSize="16px" color="#fff">
          Submit the most ranked content first! Details of reward calculation
          you can find in{' '}
          <LinkWindow to="https://cybercongress.ai/game-of-links/">
            Game of Links rules
          </LinkWindow>
        </Text>
      </Pane>
      <Tablist
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(110px, 1fr))"
        gridGap="10px"
        marginY={20}
      >
        <TabBtn
          text="Content"
          isSelected={selected === 'relevace'}
          to="/gol/relevance"
        />
        <TabBtn
          text="Leaderboard"
          isSelected={selected === 'leaderboard'}
          to="/gol/relevance/leaderboard"
        />
      </Tablist>
      {content}
    </main>
  );
}

const mapStateToProps = store => {
  return {
    node: store.ipfs.ipfs,
    mobile: store.settings.mobile,
  };
};

export default connect(mapStateToProps)(GolRelevance);

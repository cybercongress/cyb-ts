import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { SearchItem, Pane, Text, Tablist } from '@cybercongress/gravity';
import InfiniteScroll from 'react-infinite-scroll-component';
import Iframe from 'react-iframe';
import {
  getRelevance,
  getRankGrade,
  getContentByCid,
  getAmountATOM,
  getTxCosmos,
} from '../../../utils/search/utils';
import { Dots, LinkWindow, TabBtn } from '../../../components';
import { cybWon } from '../../../utils/fundingMath';
import LoadTab from '../tab/loadTab';

const Relevace = ({ items, fetchMoreData, page, allPage }) => (
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
    {Object.keys(items).map(keys => {
      let contentItem = false;
      if (items[keys].status === 'downloaded') {
        if (items[keys].content !== undefined) {
          if (items[keys].content.indexOf(keys) === -1) {
            contentItem = true;
          }
        }
      }
      return (
        <SearchItem
          hash={keys}
          key={keys}
          rank={items[keys].rank}
          grade={getRankGrade(items[keys].rank)}
          status={items[keys].status}
        >
          {contentItem && (
            <Iframe
              width="100%"
              height="fit-content"
              className="iframe-SearchItem"
              url={items[keys].content}
            />
          )}
        </SearchItem>
      );
    })}
  </InfiniteScroll>
);

class GolRelevance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      page: 0,
      loading: true,
      won: 0,
      selected: 'relevace',
    };
  }

  componentDidMount() {
    this.chekPathname();
    this.getFirstItem();
    this.getTxsCosmos();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (prevProps.location.pathname !== location.pathname) {
      this.chekPathname();
    }
  }

  getTxsCosmos = async () => {
    const dataTx = await getTxCosmos();
    console.log(dataTx);
    if (dataTx !== null) {
      this.getAtom(dataTx.txs);
    }
  };

  getAtom = async dataTxs => {
    let amount = 0;
    let won = 0;

    if (dataTxs) {
      amount = await getAmountATOM(dataTxs);
    }

    won = Math.floor(cybWon(amount));

    this.setState({
      won,
    });
  };

  chekPathname = () => {
    const { location } = this.props;
    const { pathname } = location;

    if (
      pathname.match(/leaderboard/gm) &&
      pathname.match(/leaderboard/gm).length > 0
    ) {
      this.select('leaderboard');
    } else {
      this.select('relevace');
    }
  };

  getFirstItem = async () => {
    const { page } = this.state;

    const data = await getRelevance(page);
    const links = data.cids.reduce(
      (obj, link) => ({
        ...obj,
        [link.cid]: {
          rank: link.rank,
          status: 'sparkApp',
        },
      }),
      {}
    );

    this.setState({
      items: links,
      page: page + 1,
      loading: false,
      allPage: Math.ceil(parseFloat(data.total) / 50),
    });
  };

  loadContent = (cids, prevState) => {
    const { node } = this.props;
    const contentPromises = Object.keys(cids).map(cid =>
      getContentByCid(cid, node)
        .then(content => {
          const { items } = this.state;
          if (
            Object.keys(items[cid]) !== null &&
            typeof Object.keys(items[cid]) !== 'undefined' &&
            Object.keys(items[cid]).length > 0
          ) {
            items[cid] = {
              ...items[cid],
              status: content.status,
              content: content.content,
            };
            this.setState({
              items,
            });
          }
        })
        .catch(e => {
          // console.log(e);
          const { items } = this.state;
          if (
            Object.keys(items[cid]) !== null &&
            typeof Object.keys(items[cid]) !== 'undefined' &&
            Object.keys(items[cid]).length > 0
          ) {
            items[cid] = {
              ...items[cid],
              status: 'impossibleLoad',
              content: `data:,${cid}`,
            };
            this.setState({
              items,
            });
          }
        })
    );
    Promise.all(contentPromises);
  };

  fetchMoreData = async () => {
    const { page, items } = this.state;
    const { node } = this.props;
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    const data = await getRelevance(page);
    const links = data.cids.reduce(
      (obj, link) => ({
        ...obj,
        [link.cid]: {
          rank: link.rank,
          status: 'sparkApp',
        },
      }),
      {}
    );

    setTimeout(() => {
      this.setState({
        items: { ...items, ...links },
        page: page + 1,
      });
    }, 500);
  };

  select = selected => {
    this.setState({ selected });
  };

  render() {
    const { page, allPage, items, loading, selected, won } = this.state;
    let content;

    if (loading) {
      return <div>...</div>;
    }

    if (selected === 'leaderboard') {
      content = <LoadTab won={won} />;
    }

    if (selected === 'relevace') {
      content = (
        <div
          id="scrollableDiv"
          style={{ height: '100%', padding: '0 10px', overflow: 'auto' }}
        >
          <Relevace
            items={items}
            fetchMoreData={this.fetchMoreData}
            page={page}
            allPage={allPage}
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
}

const mapStateToProps = store => {
  return {
    node: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps)(GolRelevance);

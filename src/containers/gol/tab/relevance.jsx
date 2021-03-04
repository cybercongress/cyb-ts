import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { Rank, Pane, Text } from '@cybercongress/gravity';
import InfiniteScroll from 'react-infinite-scroll-component';
import Iframe from 'react-iframe';
import {
  getRelevance,
  getRankGrade,
  getContentByCid,
} from '../../../utils/search/utils';
import { Dots, LinkWindow } from '../../../components';
import ContentItem from '../../ipfs/contentItem';
import { formatNumber } from '../../../utils/utils';

class RelevanceTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      page: 0,
    };
  }

  async componentDidMount() {
    const { page } = this.state;
    const { node } = this.props;

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

    this.setState({
      items: links,
      page: page + 1,
      allPage: Math.ceil(parseFloat(data.total) / 50),
    });
    // this.loadContent(links, node);
  }

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
    // this.loadContent(links, node);

    setTimeout(() => {
      this.setState({
        items: { ...items, ...links },
        page: page + 1,
      });
    }, 500);
  };

  render() {
    const { node, mobile } = this.props;
    const { page, allPage, items } = this.state;

    return (
      <Pane
        width="90%"
        marginX="auto"
        marginY={0}
        display="flex"
        flexDirection="column"
      >
        <InfiniteScroll
          dataLength={Object.keys(items).length}
          next={this.fetchMoreData}
          hasMore
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
            <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
          }
          refreshFunction={this.fetchMoreData}
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
      </Pane>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    node: store.ipfs.ipfs,
    mobile: store.settings.mobile,
  };
};

export default connect(mapStateToProps)(RelevanceTab);

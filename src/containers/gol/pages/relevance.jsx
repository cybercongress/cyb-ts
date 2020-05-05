import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { SearchItem, Pane, Text } from '@cybercongress/gravity';
import InfiniteScroll from 'react-infinite-scroll-component';
import Iframe from 'react-iframe';
import {
  getRelevance,
  getRankGrade,
  getContentByCid,
} from '../../../utils/search/utils';
import { Dots, LinkWindow } from '../../../components';

const style = {
  height: 30,
  border: '1px solid green',
  margin: 6,
  padding: 8,
};

class GolRelevance extends React.Component {
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
          rank: link.rank,
          status: 'understandingState',
        },
      }),
      {}
    );

    this.setState({
      items: links,
      page: page + 1,
      allPage: Math.ceil(parseFloat(data.total) / 50),
    });
    this.loadContent(links, node);
  }

  loadContent = async (cids, node, prevState) => {
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
          status: 'understandingState',
        },
      }),
      {}
    );
    this.loadContent(links, node);

    setTimeout(() => {
      this.setState({
        items: { ...items, ...links },
        page: page + 1,
      });
    }, 500);
  };

  render() {
    const { page, allPage, items } = this.state;

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
        <div
          id="scrollableDiv"
          style={{ height: '100%', padding: '0 10px', overflow: 'auto' }}
        >
          <InfiniteScroll
            dataLength={Object.keys(items).length}
            next={this.fetchMoreData}
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
        </div>
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

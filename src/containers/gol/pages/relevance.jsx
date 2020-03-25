import React from 'react';
import { render } from 'react-dom';
import { SearchItem, Pane, Text } from '@cybercongress/gravity';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getRelevance, getRankGrade } from '../../../utils/search/utils';
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
    const data = await getRelevance(page);
    this.setState({
      items: data.cids,
      page: page + 1,
      allPage: Math.ceil(parseFloat(data.total) / 50),
    });
  }

  fetchMoreData = async () => {
    const { page, items } = this.state;
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    const data = await getRelevance(page);

    setTimeout(() => {
      this.setState({
        items: items.concat(data.cids),
        page: page + 1,
      });
    }, 500);
  };

  render() {
    const { page, allPage, items } = this.state;
    console.log(items);
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
        <div id="scrollableDiv" style={{ height: '100%', overflow: 'auto' }}>
          <InfiniteScroll
            dataLength={items.length}
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
            {items.map((item, index) => (
              <Pane
                display="grid"
                gridTemplateColumns="50px 1fr"
                alignItems="baseline"
                gridGap="5px"
                key={index}
              >
                <Text textAlign="end" fontSize="16px" color="#fff">
                  #{index + 1}
                </Text>
                <Pane marginY={0} marginX="auto" width="70%">
                  <SearchItem
                    hash={`#${index + 1} ${item.cid}`}
                    rank={item.rank}
                    grade={getRankGrade(item.rank)}
                    // status="success"
                    width="70%"
                  />
                </Pane>
              </Pane>
            ))}
          </InfiniteScroll>
        </div>
      </main>
    );
  }
}

export default GolRelevance;

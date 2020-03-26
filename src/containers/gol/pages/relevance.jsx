import React from 'react';
import { render } from 'react-dom';
import { SearchItem, Pane, Text } from '@cybercongress/gravity';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getRelevance, getRankGrade } from '../../../utils/search/utils';

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
        // style={{ justifyContent: 'space-between' }}
        className="block-body"
      >
        <div id="scrollableDiv" style={{ height: '80vh', overflow: 'auto' }}>
          <InfiniteScroll
            dataLength={items.length}
            next={this.fetchMoreData}
            hasMore={page < allPage}
            loader={<h4>Loading...</h4>}
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

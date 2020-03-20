import React from 'react';
import { render } from 'react-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getRelevance } from '../../../utils/search/utils';

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
    }, 1500);
  };

  render() {
    const { page, allPage, items } = this.state;
    console.log(items);
    return (
      <div>
        <h1>Top CIDs</h1>
        <hr />
        <div id="scrollableDiv" style={{ height: '80vh', overflow: 'auto' }}>
          <InfiniteScroll
            dataLength={items.length}
            next={this.fetchMoreData}
            hasMore={page < allPage}
            loader={<h4>Loading...</h4>}
            scrollableTarget="scrollableDiv"
          >
            {items.map((item, index) => (
              <div style={style} key={index}>
                #{index + 1} - {item.cid}
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

export default GolRelevance;

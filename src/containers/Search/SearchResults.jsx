import React from 'react';
import { Pane, SearchItem, Text } from '@cybercongress/gravity';
import { getIpfsHash, search, getRankGrade } from '../../utils/search/utils';
import { formatNumber } from '../../utils/utils';
import { Loading } from '../../components';

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    localStorage.setItem('LAST_DURA', '');
    this.state = {
      result: false,
      searchResults: [],
      loading: false,
      keywordHash: '',
    };
  }

  componentDidMount() {
    this.getParamsQuery();
  }

  getParamsQuery = async () => {
    const { match } = this.props;
    const { query } = match.params;
    this.setState({
      loading: true,
    });
    await this.getSearch(query);
  };

  getSearch = async valueSearchInput => {
    let searchResults = [];
    const keywordHash = await getIpfsHash(valueSearchInput);
    searchResults = await search(keywordHash);
    searchResults.map((item, index) => {
      searchResults[index].cid = item.cid;
      searchResults[index].rank = formatNumber(item.rank, 6);
      searchResults[index].grade = getRankGrade(item.rank);
    });
    console.log('searchResults', searchResults);
    this.setState({
      searchResults,
      keywordHash,
      result: true,
      loading: false,
    });
  };

  render() {
    const { searchResults, keywordHash, loading } = this.state;
    console.log(searchResults);

    const searchItems = searchResults.map(item => (
      <SearchItem
        key={item.cid}
        hash={item.cid}
        rank={item.rank}
        grade={item.grade}
        status="success"
        // onClick={e => (e, links[cid].content)}
      >
        {item.cid}
      </SearchItem>
    ));

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
          <div style={{ color: '#fff', marginTop: 20, fontSize: 20 }}>
            Searching
          </div>
        </div>
      );
    }

    return (
      <main className="block-body-home">
        <Pane
          width="90%"
          marginX="auto"
          marginY={0}
          display="flex"
          flexDirection="column"
        >
          <Text
            fontSize="20px"
            marginBottom={20}
            color="#949292"
            lineHeight="20px"
          >
            {`I found ${searchItems.length} results`}
          </Text>
          <Pane>{searchItems}</Pane>
        </Pane>
      </main>
    );
  }
}

export default SearchResults;

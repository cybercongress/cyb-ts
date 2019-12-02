import React from 'react';
import { Pane, SearchItem, Text } from '@cybercongress/gravity';
import { getIpfsHash, search, getRankGrade } from '../../utils/search/utils';
import { formatNumber } from '../../utils/utils';
import { Loading } from '../../components';
import ActionBarContainer from './ActionBarContainer';

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: false,
      searchResults: [],
      loading: false,
      keywordHash: '',
      query: '',
    };
  }

  componentDidMount() {
    this.getParamsQuery();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (prevProps.location.pathname !== location.pathname) {
      // this.getSearch(query);
      this.getParamsQuery();
    }
  }

  getParamsQuery = async () => {
    const { match } = this.props;
    const { query } = match.params;
    this.setState({
      loading: true,
    });

    this.getSearch(query);
  };

  getSearch = async query => {
    let searchResults = [];
    // const { query } = this.state;
    const keywordHash = await getIpfsHash(query);
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
      query,
    });
  };

  render() {
    const { searchResults, keywordHash, loading, query, result } = this.state;
    // console.log(query);

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
      <div>
        <main className="block-body-home" style={{ paddingTop: 30 }}>
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
        <ActionBarContainer
          home={!result}
          valueSearchInput={query}
          link={searchResults.length === 0 && result}
          keywordHash={keywordHash}
          onCklicBtnSearch={this.onCklicBtn}
        />
      </div>
    );
  }
}

export default SearchResults;

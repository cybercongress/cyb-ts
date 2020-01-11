import React from 'react';
import { Pane, SearchItem, Text } from '@cybercongress/gravity';
import {
  getIpfsHash,
  search,
  getRankGrade,
  getDrop,
  formatNumber as format,
} from '../../utils/search/utils';
import { formatNumber } from '../../utils/utils';
import { Loading } from '../../components';
import ActionBarContainer from './ActionBarContainer';
import { CYBER, PATTERN } from '../../utils/config';

const giftImg = require('../../image/gift.svg');

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: false,
      searchResults: [],
      loading: false,
      keywordHash: '',
      query: '',
      resultNull: false,
      drop: false,
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
    let resultNull = false;
    let keywordHash = '';
    let keywordHashNull = '';
    let drop;
    // const { query } = this.state;
    if (query.match(PATTERN)) {
      const result = await getDrop(query);

      drop = {
        address: query,
        balance: result,
      };

      searchResults.push(drop);

      this.setState({
        drop: true,
        loading: false,
      });
    } else {
      keywordHash = await getIpfsHash(query);
      searchResults = await search(keywordHash);
      searchResults.map((item, index) => {
        searchResults[index].cid = item.cid;
        searchResults[index].rank = formatNumber(item.rank, 6);
        searchResults[index].grade = getRankGrade(item.rank);
      });
      console.log('searchResults', searchResults);

      if (searchResults.length === 0) {
        const queryNull = '0';
        keywordHashNull = await getIpfsHash(queryNull);
        searchResults = await search(keywordHashNull);
        searchResults.map((item, index) => {
          searchResults[index].cid = item.cid;
          searchResults[index].rank = formatNumber(item.rank, 6);
          searchResults[index].grade = getRankGrade(item.rank);
        });
        resultNull = true;
      }
      this.setState({
        drop: false,
      });
    }

    this.setState({
      searchResults,
      keywordHash,
      result: true,
      loading: false,
      query,
      resultNull,
    });
  };

  render() {
    const {
      searchResults,
      keywordHash,
      loading,
      query,
      result,
      resultNull,
      drop,
    } = this.state;
    // console.log(query);
    console.log(searchResults);

    let searchItems = [];

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
    if (drop) {
      searchItems = searchResults.map(item => (
        <Pane
          backgroundColor="#fff"
          paddingY={20}
          paddingX={20}
          borderRadius={5}
          key={item.address}
          display="flex"
          flexDirection="row"
        >
          <Pane display="flex" flexDirection="column" marginRight={10}>
            <Text fontSize="18px" lineHeight="25px">
              address:
            </Text>
            <Text display="flex" fontSize="18px" lineHeight="25px">
              gift{' '}
              <img
                style={{ width: '25px', height: '25px', marginLeft: '5px' }}
                src={giftImg}
                alt="giftImg"
              />
              :
            </Text>
          </Pane>
          <Pane display="flex" flexDirection="column">
            <Text fontSize="18px" lineHeight="25px">
              {item.address}
            </Text>
            <Text fontSize="18px" lineHeight="25px">
              {`${format(item.balance)} ${CYBER.DENOM_CYBER.toUpperCase()}`}
            </Text>
          </Pane>
        </Pane>
      ));
    } else {
      searchItems = searchResults.map(item => (
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
    }
    console.log(searchItems);

    return (
      <div>
        <main className="block-body" style={{ paddingTop: 30 }}>
          <Pane
            width="90%"
            marginX="auto"
            marginY={0}
            display="flex"
            flexDirection="column"
          >
            {!resultNull && (
              <Text
                fontSize="20px"
                marginBottom={20}
                color="#949292"
                lineHeight="20px"
              >
                {`I found ${searchItems.length} results`}
              </Text>
            )}

            {resultNull && (
              <Text
                fontSize="20px"
                marginBottom={20}
                color="#949292"
                lineHeight="20px"
              >
                I don't know{' '}
                <Text fontSize="20px" lineHeight="20px" color="#e80909">
                  {query}
                </Text>
                . Please, help me understand.
              </Text>
            )}
            <Pane>{searchItems}</Pane>
          </Pane>
        </main>

        {!drop && (
          <ActionBarContainer
            home={!result}
            valueSearchInput={query}
            link={searchResults.length === 0 && result}
            keywordHash={keywordHash}
            onCklicBtnSearch={this.onCklicBtn}
            update={this.getParamsQuery}
          />
        )}
      </div>
    );
  }
}

export default SearchResults;

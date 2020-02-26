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
import {
  CYBER,
  PATTERN,
  PATTERN_CYBER,
  PATTERN_TX,
  PATTERN_CYBER_VALOPER,
} from '../../utils/config';
import Gift from './gift';
import SnipitAccount from './snipitAccountPages';

const giftImg = require('../../image/gift.svg');

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: false,
      searchResults: {
        link: [],
        drop: [],
      },
      loading: false,
      keywordHash: '',
      query: '',
      resultNull: false,
      drop: false,
      dropResults: [],
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
    let searchResults = {
      link: [],
      drop: [],
    };
    let resultNull = false;
    let keywordHash = '';
    let keywordHashNull = '';
    let drop;
    // const { query } = this.state;
    if (query.match(PATTERN)) {
      const result = await getDrop(query.toLowerCase());

      console.log('result', result);

      if (result === 0) {
        drop = {
          address: query,
          gift: 0,
        };
      } else {
        drop = {
          address: query,
          gift: result.gift,
          ...result,
        };
      }

      searchResults.drop = [drop];
    }

    keywordHash = await getIpfsHash(query);
    searchResults.link = await search(keywordHash);
    searchResults.link.map((item, index) => {
      searchResults.link[index].cid = item.cid;
      searchResults.link[index].rank = formatNumber(item.rank, 6);
      searchResults.link[index].grade = getRankGrade(item.rank);
    });

    if (searchResults.link.length === 0) {
      const queryNull = '0';
      keywordHashNull = await getIpfsHash(queryNull);
      searchResults.link = await search(keywordHashNull);
      searchResults.link.map((item, index) => {
        searchResults.link[index].cid = item.cid;
        searchResults.link[index].rank = formatNumber(item.rank, 6);
        searchResults.link[index].grade = getRankGrade(item.rank);
      });
      resultNull = true;
    }

    console.log('searchResults', searchResults);
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
    console.log('searchResults render', searchResults);

    const searchItems = [];

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

    if (searchResults.drop.length > 0) {
      searchItems.push(searchResults.drop.map(item => <Gift item={item} />));
    }

    if (query.match(PATTERN_CYBER)) {
      searchItems.push(
        <SnipitAccount
          text="Details address"
          to={`/network/euler-5/contract/${query}`}
          address={query}
        />
      );
    }

    if (query.match(PATTERN_CYBER_VALOPER)) {
      searchItems.push(
        <SnipitAccount
          text="Details a hero"
          to={`/network/euler-5/hero/${query}`}
          address={query}
        />
      );
    }

    if (query.match(PATTERN_TX)) {
      searchItems.push(
        <SnipitAccount text="Details Tx" to={`/network/euler-5/tx/${query}`} address={query} />
      );
    }

    searchItems.push(
      searchResults.link.map(item => (
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
      ))
    );
    // }
    // console.log(searchItems);

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
                wordBreak="break-all"
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
                wordBreak="break-all"
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

        <ActionBarContainer
          home={!result}
          valueSearchInput={query}
          link={searchResults.length === 0 && result}
          keywordHash={keywordHash}
          onCklicBtnSearch={this.onCklicBtn}
          update={this.getParamsQuery}
        />
      </div>
    );
  }
}

export default SearchResults;

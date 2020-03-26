import React from 'react';
import { Pane, SearchItem, Text } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import Iframe from 'react-iframe';
import { connect } from 'react-redux';
import {
  getIpfsHash,
  search,
  getRankGrade,
  getDrop,
  formatNumber as format,
  getContentByCid,
} from '../../utils/search/utils';
import { formatNumber, formatValidatorAddress } from '../../utils/utils';
import { Loading, Account } from '../../components';
import ActionBarContainer from './ActionBarContainer';
import {
  CYBER,
  PATTERN,
  PATTERN_CYBER,
  PATTERN_TX,
  PATTERN_CYBER_VALOPER,
  PATTERN_BLOCK,
} from '../../utils/config';
import Gift from './gift';
import SnipitAccount from './snipitAccountPages';
import { object } from 'prop-types';

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

    this.getSearch(query.toLowerCase());
  };

  loadContent = async (cids, node, prevState) => {
    const { query } = this.state;
    const contentPromises = Object.keys(cids).map(cid =>
      getContentByCid(cid, node)
        .then(content => {
          const { searchResults } = this.state;
          const links = searchResults.link;
          if (
            Object.keys(links[cid]) !== null &&
            typeof Object.keys(links[cid]) !== 'undefined' &&
            Object.keys(links[cid]).length > 0
          ) {
            if (links[cid].query === query) {
              console.warn({ ...links[cid], ...content });
              links[cid] = {
                ...links[cid],
                status: content.status,
                content: content.content,
              };
              this.setState({
                searchResults,
              });
            }
          }
        })
        .catch(() => {
          const { searchResults } = this.state;
          const links = searchResults.link;
          if (
            Object.keys(links[cid]) !== null &&
            typeof Object.keys(links[cid]) !== 'undefined' &&
            Object.keys(links[cid]).length > 0
          ) {
            if (links[cid].query === query) {
              links[cid] = {
                ...links[cid],
                status: 'impossibleLoad',
                content: `data:,${cid}`,
              };
              this.setState({
                searchResults,
              });
            }
          }
        })
    );
    Promise.all(contentPromises);
  };

  getSearch = async query => {
    const { node } = this.props;
    const searchResults = {
      link: [],
      drop: [],
    };
    let resultNull = false;
    let keywordHash = '';
    let keywordHashNull = '';
    // const { query } = this.state;

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

    const links = searchResults.link.reduce(
      (obj, link) => ({
        ...obj,
        [link.cid]: {
          rank: link.rank,
          grade: link.grade,
          status: 'understandingState',
          query,
        },
      }),
      {}
    );

    console.log('searchResults', searchResults);
    searchResults.link = links;

    this.setState({
      searchResults,
      keywordHash,
      result: true,
      loading: false,
      query,
      resultNull,
    });
    this.loadContent(searchResults.link, node);
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

    if (query.match(PATTERN)) {
      searchItems.push(
        <Link to={`/gift/${query}`}>
          <SearchItem
            hash={`${query}_PATTERN`}
            text="Don't wait, claim your gift :-) And to the Game of Links!"
            status="sparkApp"
            // address={query}
          />
        </Link>
      );
    }

    if (query.match(PATTERN_CYBER)) {
      searchItems.push(
        <Link to={`/network/euler-5/contract/${query}`}>
          <SearchItem
            hash={`${query}_PATTERN_CYBER`}
            text="Explore details of contract"
            contentApp={
              <Pane color="#000">{formatValidatorAddress(query, 8, 5)}</Pane>
            }
            status="sparkApp"
          />
        </Link>
      );
    }

    if (query.match(PATTERN_CYBER_VALOPER)) {
      searchItems.push(
        <Link to={`/network/euler-5/hero/${query}`}>
          <SearchItem
            hash={`${query}_PATTERN_CYBER_VALOPER`}
            text="Explore details of hero"
            contentApp={<Account colorText="#000" address={query} />}
            status="sparkApp"
          />
        </Link>
      );
    }

    if (query.match(PATTERN_TX)) {
      searchItems.push(
        <Link to={`/network/euler-5/tx/${query}`}>
          <SearchItem
            hash={`${query}_PATTERN_TX`}
            text="Explore details of tx "
            status="sparkApp"
            contentApp={
              <Pane color="#000">{formatValidatorAddress(query, 4, 4)}</Pane>
            }
          />
        </Link>
      );
    }

    if (query.match(PATTERN_BLOCK)) {
      searchItems.push(
        <Link to={`/network/euler-5/block/${query}`}>
          <SearchItem
            hash={`${query}_PATTERN_BLOCK`}
            text="Explore details of block "
            status="sparkApp"
            contentApp={
              <Pane color="#000">{formatNumber(parseFloat(query))}</Pane>
            }
          />
        </Link>
      );
    }

    const links = searchResults.link;
    searchItems.push(
      Object.keys(links).map(key => {
        let contentItem = false;
        if (links[key].status === 'downloaded') {
          if (links[key].content !== undefined) {
            if (links[key].content.indexOf(key) === -1) {
              contentItem = true;
            }
          }
        }
        return (
          <SearchItem
            key={key}
            hash={key}
            rank={links[key].rank}
            grade={links[key].grade}
            status={links[key].status}
            contentIpfs={links[key].content}
            // onClick={e => (e, links[cid].content)}
          >
            {contentItem && (
              <Iframe
                width="100%"
                height="fit-content"
                className="iframe-SearchItem"
                url={links[key].content}
              />
            )}
          </SearchItem>
        );
      })
    );

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
                {`I found ${Object.keys(searchResults.link).length} answers`}
              </Text>
            )}

            {resultNull && (
              <Text
                fontSize="20px"
                marginBottom={20}
                color="#949292"
                lineHeight="20px"
                // wordBreak="break-all"
              >
                I don't know what is{' '}
                <Text fontSize="20px" lineHeight="20px" color="#e80909">
                  {query}
                </Text>
                . I find results for 0 instead
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

const mapStateToProps = store => {
  return {
    node: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps)(SearchResults);

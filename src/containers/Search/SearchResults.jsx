import React from 'react';
import { Pane, SearchItem, Text, Rank } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import Iframe from 'react-iframe';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import {
  getIpfsHash,
  search,
  getRankGrade,
  getDrop,
  formatNumber as format,
  getContentByCid,
} from '../../utils/search/utils';
import { formatNumber, trimString } from '../../utils/utils';
import { Loading, Account } from '../../components';
import ActionBarContainer from './ActionBarContainer';
import {
  CYBER,
  PATTERN,
  PATTERN_CYBER,
  PATTERN_TX,
  PATTERN_CYBER_VALOPER,
  PATTERN_BLOCK,
  PATTERN_IPFS_HASH,
} from '../../utils/config';
import Gift from './gift';
import SnipitAccount from './snipitAccountPages';
import { object } from 'prop-types';
import { setQuery } from '../../redux/actions/query';
import CodeBlock from '../ipfs/codeBlock';

const giftImg = require('../../image/gift.svg');
const htmlParser = require('react-markdown/plugins/html-parser');

const parseHtml = htmlParser({
  isValidNode: node => node.type !== 'script',
});

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
    const { match, setQueryProps } = this.props;
    const { query } = match.params;
    this.setState({
      loading: true,
    });
    setQueryProps(query);
    this.getSearch(query);
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
                text: content.text,
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
                content: false,
                text: cid,
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

    if (query.match(PATTERN_IPFS_HASH)) {
      keywordHash = query;
    } else {
      keywordHash = await getIpfsHash(query.toLowerCase());
    }

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
          status: node !== null ? 'understandingState' : 'impossibleLoad',
          query,
          text: link.cid,
          content: false,
        },
      }),
      {}
    );
    searchResults.link = links;

    this.setState({
      searchResults,
      keywordHash,
      result: true,
      loading: false,
      query,
      resultNull,
    });

    if (node !== null) {
      this.loadContent(searchResults.link, node);
    }
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
    const { mobile } = this.props;
    // console.log(query);

    console.log('searchResults', searchResults);

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
            text="Don't wait! Claim your gift, and join the Game of Links!"
            status="sparkApp"
            // address={query}
          />
        </Link>
      );
    }

    if (query.match(PATTERN_CYBER)) {
      searchItems.push(
        <Link to={`/network/euler/contract/${query}`}>
          <SearchItem
            hash={`${query}_PATTERN_CYBER`}
            text="Explore details of contract"
            contentApp={<Pane color="#000">{trimString(query, 8, 5)}</Pane>}
            status="sparkApp"
          />
        </Link>
      );
    }

    if (query.match(PATTERN_CYBER_VALOPER)) {
      searchItems.push(
        <Link to={`/network/euler/hero/${query}`}>
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
        <Link to={`/network/euler/tx/${query}`}>
          <SearchItem
            hash={`${query}_PATTERN_TX`}
            text="Explore details of tx "
            status="sparkApp"
            contentApp={<Pane color="#000">{trimString(query, 4, 4)}</Pane>}
          />
        </Link>
      );
    }

    if (query.match(PATTERN_BLOCK)) {
      searchItems.push(
        <Link to={`/network/euler/block/${query}`}>
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
                <Rank rank={links[key].rank} grade={links[key].grade} />
              </Pane>
            )}
            <Link className="SearchItem" to={`/ipfs/${key}`}>
              <SearchItem
                key={key}
                rank={links[key].rank}
                grade={links[key].grade}
                status={links[key].status}
                text={
                  <div className="container-text-SearchItem">
                    <ReactMarkdown
                      source={links[key].text}
                      escapeHtml={false}
                      skipHtml={false}
                      astPlugins={[parseHtml]}
                      renderers={{ code: CodeBlock }}
                      // plugins={[toc]}
                      // escapeHtml={false}
                    />
                  </div>
                }
                // onClick={e => (e, links[cid].content)}
              >
                {links[key].content &&
                  links[key].content.indexOf('image') !== -1 && (
                    <img
                      style={{ width: '100%', paddingTop: 10 }}
                      alt="img"
                      src={links[key].content}
                    />
                  )}
              </SearchItem>
            </Link>
          </Pane>
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
            <div className="container-contentItem" style={{ width: '100%' }}>
              {searchItems}
            </div>
          </Pane>
        </main>

        {!mobile && (
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

const mapStateToProps = store => {
  return {
    node: store.ipfs.ipfs,
    mobile: store.settings.mobile,
  };
};

const mapDispatchprops = dispatch => {
  return {
    setQueryProps: query => dispatch(setQuery(query)),
  };
};

export default connect(mapStateToProps, mapDispatchprops)(SearchResults);

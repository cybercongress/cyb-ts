import React, { useState, useEffect, useContext } from 'react';
import { Pane, SearchItem, Text } from '@cybercongress/gravity';
import { useParams, useLocation, useHistory, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getIpfsHash, getRankGrade } from '../../utils/search/utils';
import {
  formatNumber,
  exponentialToDecimal,
  trimString,
  coinDecimals,
  encodeSlash,
  replaceSlash,
} from '../../utils/utils';
import {
  Loading,
  Account,
  Copy,
  Tooltip,
  LinkWindow,
  Rank,
  NoItems,
  Dots,
} from '../../components';
import ActionBarContainer from './ActionBarContainer';
import {
  PATTERN,
  PATTERN_CYBER,
  PATTERN_TX,
  PATTERN_CYBER_VALOPER,
  PATTERN_BLOCK,
  PATTERN_IPFS_HASH,
} from '../../utils/config';
import { setQuery } from '../../redux/actions/query';
import ContentItem from '../ipfs/contentItem';
import { AppContext } from '../../context';

const search = async (client, hash, page) => {
  try {
    const responseSearchResults = await client.search(hash, page);
    return responseSearchResults.result ? responseSearchResults : [];
  } catch (error) {
    return [];
  }
};

const reduceSearchResults = (data, query) => {
  return data.reduce(
    (obj, item) => ({
      ...obj,
      [item.particle]: {
        particle: item.particle,
        rank: coinDecimals(item.rank),
        grade: getRankGrade(coinDecimals(item.rank)),
        status: 'impossibleLoad',
        query,
        text: item.particle,
        content: false,
      },
    }),
    {}
  );
};

function SearchResults({ node, mobile, setQueryProps }) {
  const { jsCyber } = useContext(AppContext);
  const { query } = useParams();
  const location = useLocation();
  const history = useHistory();
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [keywordHash, setKeywordHash] = useState('');
  const [update, setUpdate] = useState(1);
  const [rankLink, setRankLink] = useState(null);
  const [page, setPage] = useState(0);
  const [allPage, setAllPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (query.match(/\//g)) {
      history.push(`/search/${replaceSlash(query)}`);
    }
  }, [query]);

  useEffect(() => {
    const getFirstItem = async () => {
      setLoading(true);
      setQueryProps(encodeSlash(query));
      setPage(0);
      setAllPage(1);
      if (jsCyber !== null) {
        let keywordHashTemp = '';
        let keywordHashNull = '';
        let searchResultsData = [];
        if (query.match(PATTERN_IPFS_HASH)) {
          keywordHashTemp = query;
        } else {
          keywordHashTemp = await getIpfsHash(encodeSlash(query).toLowerCase());
        }

        let responseSearchResults = await search(jsCyber, keywordHashTemp, 0);
        if (responseSearchResults.length === 0) {
          const queryNull = '0';
          keywordHashNull = await getIpfsHash(queryNull);
          // console.log(`keywordHashNull`, keywordHashNull);
          responseSearchResults = await search(jsCyber, keywordHashNull, 0);
          // console.log(` responseSearchResults`, responseSearchResults);
        }
        // console.log(`responseSearchResults`, responseSearchResults);

        if (
          responseSearchResults.result &&
          responseSearchResults.result.length > 0
        ) {
          searchResultsData = reduceSearchResults(
            responseSearchResults.result,
            query
          );
          setAllPage(
            Math.ceil(parseFloat(responseSearchResults.pagination.total) / 10)
          );
          setTotal(parseFloat(responseSearchResults.pagination.total));
          setPage((item) => item + 1);
        }
        setKeywordHash(keywordHashTemp);
        setSearchResults(searchResultsData);
        setLoading(false);
      }
    };
    getFirstItem();
  }, [query, location, update, jsCyber]);

  const fetchMoreData = async () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    let links = [];
    const data = await search(jsCyber, keywordHash, page);
    if (data.result) {
      links = reduceSearchResults(data.result, encodeSlash(query));
    }

    setTimeout(() => {
      setSearchResults((itemState) => ({ ...itemState, ...links }));
      setPage((itemPage) => itemPage + 1);
    }, 500);
  };

  useEffect(() => {
    setRankLink(null);
  }, [update]);

  const onClickRank = async (key) => {
    if (rankLink === key) {
      setRankLink(null);
    } else {
      setRankLink(key);
    }
  };

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

  if (query.match(PATTERN_CYBER)) {
    searchItems.push(
      <Pane
        position="relative"
        className="hover-rank"
        display="flex"
        alignItems="center"
        marginBottom="10px"
      >
        <Link className="SearchItem" to={`/network/bostrom/contract/${query}`}>
          <SearchItem
            hash={`${query}_PATTERN_CYBER`}
            text="Explore details of contract"
            contentApp={<Pane color="#000">{trimString(query, 8, 5)}</Pane>}
            status="sparkApp"
          />
        </Link>
      </Pane>
    );
  }

  if (query.match(PATTERN_CYBER_VALOPER)) {
    searchItems.push(
      <Pane
        position="relative"
        className="hover-rank"
        display="flex"
        alignItems="center"
        marginBottom="10px"
      >
        <Link className="SearchItem" to={`/network/bostrom/hero/${query}`}>
          <SearchItem
            hash={`${query}_PATTERN_CYBER_VALOPER`}
            text="Explore details of hero"
            contentApp={<Account colorText="#000" address={query} />}
            status="sparkApp"
          />
        </Link>
      </Pane>
    );
  }

  if (query.match(PATTERN_TX)) {
    searchItems.push(
      <Pane
        position="relative"
        className="hover-rank"
        display="flex"
        alignItems="center"
        marginBottom="10px"
      >
        <Link className="SearchItem" to={`/network/bostrom/tx/${query}`}>
          <SearchItem
            hash={`${query}_PATTERN_TX`}
            text="Explore details of tx "
            status="sparkApp"
            contentApp={<Pane color="#000">{trimString(query, 4, 4)}</Pane>}
          />
        </Link>
      </Pane>
    );
  }

  if (query.match(PATTERN_BLOCK)) {
    searchItems.push(
      <Pane
        position="relative"
        className="hover-rank"
        display="flex"
        alignItems="center"
        marginBottom="10px"
      >
        <Link className="SearchItem" to={`/network/bostrom/block/${query}`}>
          <SearchItem
            hash={`${query}_PATTERN_BLOCK`}
            text="Explore details of block "
            status="sparkApp"
            contentApp={
              <Pane color="#000">{formatNumber(parseFloat(query))}</Pane>
            }
          />
        </Link>
      </Pane>
    );
  }
  // QmRSnUmsSu7cZgFt2xzSTtTqnutQAQByMydUxMpm13zr53;
  if (Object.keys(searchResults).length > 0) {
    searchItems.push(
      Object.keys(searchResults).map((key) => {
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
                className={`time-discussion ${
                  rankLink === key ? '' : 'hover-rank-contentItem'
                }`}
                position="absolute"
                cursor="pointer"
              >
                <Rank
                  hash={key}
                  rank={exponentialToDecimal(
                    parseFloat(searchResults[key].rank).toPrecision(3)
                  )}
                  grade={searchResults[key].grade}
                  onClick={() => onClickRank(key)}
                />
              </Pane>
            )}
            <ContentItem
              nodeIpfs={node}
              cid={key}
              item={searchResults[key]}
              className="SearchItem"
            />
          </Pane>
        );
      })
    );
  }

  console.log(
    `searchResults`,
    searchResults,
    Object.keys(searchResults).length
  );
  // console.log(`total`, total);

  return (
    <div>
      <main
        className="block-body"
        // style={{ paddingTop: 30 }}
      >
        <Pane
          width="90%"
          marginX="auto"
          marginY={0}
          display="flex"
          flexDirection="column"
        >
          <div className="container-contentItem" style={{ width: '100%' }}>
            <InfiniteScroll
              dataLength={Object.keys(searchResults).length}
              next={fetchMoreData}
              hasMore={Object.keys(searchResults).length < total}
              loader={
                <h4>
                  Loading
                  <Dots />
                </h4>
              }
              pullDownToRefresh
              pullDownToRefreshContent={
                <h3 style={{ textAlign: 'center' }}>
                  &#8595; Pull down to refresh
                </h3>
              }
              releaseToRefreshContent={
                <h3 style={{ textAlign: 'center' }}>
                  &#8593; Release to refresh
                </h3>
              }
              refreshFunction={fetchMoreData}
            >
              {Object.keys(searchItems).length > 0 ? (
                searchItems
              ) : (
                <NoItems text={`No information about ${query}`} />
              )}
            </InfiniteScroll>
          </div>
        </Pane>
      </main>

      {!mobile && (
        <ActionBarContainer
          keywordHash={keywordHash}
          update={() => setUpdate(update + 1)}
          rankLink={rankLink}
        />
      )}
    </div>
  );
}

const mapStateToProps = (store) => {
  return {
    node: store.ipfs.ipfs,
    mobile: store.settings.mobile,
  };
};

const mapDispatchprops = (dispatch) => {
  return {
    setQueryProps: (query) => dispatch(setQuery(query)),
  };
};

export default connect(mapStateToProps, mapDispatchprops)(SearchResults);

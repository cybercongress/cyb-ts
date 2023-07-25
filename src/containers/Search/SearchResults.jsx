import { useState, useEffect, useMemo } from 'react';
import { Pane } from '@cybercongress/gravity';
import { v4 as uuidv4 } from 'uuid';
import { useParams, useLocation, Link } from 'react-router-dom';
// import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScroll from 'react-infinite-scroller';
import { useDevice } from 'src/contexts/device';
import { useQueryClient } from 'src/contexts/queryClient';
import scriptEngine from 'src/services/scripting/engine';
import { useSelector } from 'react-redux';
import store, { RootState } from 'src/redux/store';
import { getIpfsHash, getRankGrade } from '../../utils/search/utils';
import {
  formatNumber,
  exponentialToDecimal,
  trimString,
  coinDecimals,
  encodeSlash,
} from '../../utils/utils';
import {
  Loading,
  Account,
  Rank,
  NoItems,
  Dots,
  SearchItem,
} from '../../components';
import ActionBarContainer from './ActionBarContainer';
import {
  PATTERN_CYBER,
  PATTERN_TX,
  PATTERN_CYBER_VALOPER,
  PATTERN_BLOCK,
  PATTERN_IPFS_HASH,
} from '../../utils/config';
import ContentItem from '../../components/ContentItem/contentItem';
import { MainContainer } from '../portal/components';
import SwarmAnswer from './SwarmAnswer/SwarmAnswer';

const textPreviewSparkApp = (text, value) => (
  <div style={{ display: 'grid', gap: '10px' }}>
    <div>{text}</div>
    <div style={{ fontSize: '18px', color: '#36d6ae' }}>{value}</div>
  </div>
);

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

// TODO: refactor this, use scss
const searchPaneStyles = {
  position: 'relative',
  className: 'hover-rank',
  display: 'flex',
  alignItems: 'center',
  marginBottom: '-2px',
};

function SearchResults() {
  const queryClient = useQueryClient();
  const { query } = useParams();

  const location = useLocation();
  // const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [keywordHash, setKeywordHash] = useState('');
  const [update, setUpdate] = useState(1);
  const [rankLink, setRankLink] = useState(null);
  const [total, setTotal] = useState(0);
  // const [fetching, setFetching] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const [swarmReactions, setSwarmReactions] = useState([]);

  const { isMobile: mobile } = useDevice();
  const { isLoaded } = useSelector((state) => state.scripting.scripts);

  // useEffect(() => {
  //   if (query.match(/\//g)) {
  //     navigate(`/search/${replaceSlash(query)}`);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [query]);

  useEffect(() => {
    const getSwarmReactions = async () => {
      // TODO: iterate over my pre-cached swarm
      setSwarmReactions([await scriptEngine.reactToInput({ input: query })]);
    };
    if (isLoaded) {
      getSwarmReactions();
    }
  }, [query, isLoaded]);

  useEffect(() => {
    const getFirstItem = async () => {
      setLoading(true);
      if (queryClient) {
        let keywordHashTemp = '';
        let keywordHashNull = '';
        let searchResultsData = [];
        if (query.match(PATTERN_IPFS_HASH)) {
          keywordHashTemp = query;
        } else {
          keywordHashTemp = await getIpfsHash(encodeSlash(query));
        }

        let responseSearchResults = await search(
          queryClient,
          keywordHashTemp,
          0
        );

        if (
          responseSearchResults.length === 0 ||
          (responseSearchResults.result &&
            responseSearchResults.result.length === 0)
        ) {
          const queryNull = '0';
          keywordHashNull = await getIpfsHash(queryNull);
          responseSearchResults = await search(queryClient, keywordHashNull, 0);
        }

        if (
          responseSearchResults.result &&
          responseSearchResults.result.length > 0
        ) {
          searchResultsData = reduceSearchResults(
            responseSearchResults.result,
            query
          );

          setTotal(parseFloat(responseSearchResults.pagination.total));
          setHasMore(true);
          // setPage((item) => item + 1);
        } else {
          setHasMore(false);
        }

        setKeywordHash(keywordHashTemp);
        setSearchResults(searchResultsData);
        setLoading(false);
      }
    };
    getFirstItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, location, update, queryClient]);

  const fetchMoreData = async (page) => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    let links = [];
    const data = await search(queryClient, keywordHash, page);
    if (data && Object.keys(data).length > 0 && data.result) {
      links = reduceSearchResults(data.result, encodeSlash(query));
    } else {
      setHasMore(false);
    }

    setTimeout(() => {
      setSearchResults((itemState) => ({ ...itemState, ...links }));
      // setPage((itemPage) => itemPage + 1);
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

  if (swarmReactions.length > 0) {
    swarmReactions.forEach((item) => {
      const { nickname, action } = item;
      if (action === 'answer') {
        searchItems.push(
          <Pane key={`answer_${nickname}`} {...searchPaneStyles}>
            <Link className="SearchItem" to={`/@${nickname}`}>
              <SwarmAnswer item={item} query={query} />
            </Link>
          </Pane>
        );
      }
    });
  }

  if (query.match(PATTERN_CYBER)) {
    const key = uuidv4();
    searchItems.push(
      <Pane key={key} {...searchPaneStyles}>
        <Link className="SearchItem" to={`/network/bostrom/contract/${query}`}>
          <SearchItem hash={`${query}_PATTERN_CYBER`} status="sparkApp">
            {textPreviewSparkApp(
              'Explore details of contract',
              <Account avatar address={query} />
            )}
          </SearchItem>
        </Link>
      </Pane>
    );
  }

  if (query.match(PATTERN_CYBER_VALOPER)) {
    const key = uuidv4();
    searchItems.push(
      <Pane key={key} {...searchPaneStyles}>
        <Link className="SearchItem" to={`/network/bostrom/hero/${query}`}>
          <SearchItem hash={`${query}_PATTERN_CYBER_VALOPER`} status="sparkApp">
            {textPreviewSparkApp(
              'Explore details of hero',
              <Account address={query} />
            )}
          </SearchItem>
        </Link>
      </Pane>
    );
  }

  if (query.match(PATTERN_TX)) {
    const key = uuidv4();
    searchItems.push(
      <Pane key={key} {...searchPaneStyles}>
        <Link className="SearchItem" to={`/network/bostrom/tx/${query}`}>
          <SearchItem hash={`${query}_PATTERN_TX`} status="sparkApp">
            {textPreviewSparkApp(
              'Explore details of tx',
              trimString(query, 4, 4)
            )}
          </SearchItem>
        </Link>
      </Pane>
    );
  }

  if (query.match(PATTERN_BLOCK)) {
    const key = uuidv4();
    searchItems.push(
      <Pane key={key} {...searchPaneStyles}>
        <Link className="SearchItem" to={`/network/bostrom/block/${query}`}>
          <SearchItem hash={`${query}_PATTERN_BLOCK`} status="sparkApp">
            {textPreviewSparkApp(
              'Explore details of block ',
              formatNumber(parseFloat(query))
            )}
          </SearchItem>
        </Link>
      </Pane>
    );
  }
  // QmRSnUmsSu7cZgFt2xzSTtTqnutQAQByMydUxMpm13zr53;
  if (Object.keys(searchResults).length > 0) {
    searchItems.push(
      Object.keys(searchResults).map((key) => {
        return (
          <Pane key={key} {...searchPaneStyles}>
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
              cid={key}
              item={searchResults[key]}
              parent={query}
              className="SearchItem"
            />
          </Pane>
        );
      })
    );
  }

  // console.log(
  //   `searchResults`,
  //   searchResults,
  //   Object.keys(searchResults).length
  // );
  // console.log(`total`, total);
  console.log(Object.keys(searchResults).length, total);

  return (
    <>
      <MainContainer width="90%">
        <InfiniteScroll
          pageStart={-1}
          // initialLoad
          loadMore={fetchMoreData}
          hasMore={hasMore}
          loader={
            <h4
              style={{
                textAlign: 'center',
              }}
            >
              Loading
              <Dots />
            </h4>
          }
        >
          {/* <ContentItem
            cid={'QmP2rY3uUn3TfBYJVFKc7nTjDY82YnAAn7Ui8EcWL1zr5Y'}
            item={{ rank: 9999 }}
            parent={query}
            className="SearchItem"
          /> */}
          {Object.keys(searchItems).length > 0 ? (
            searchItems
          ) : (
            <NoItems text={`No information about ${query}`} />
          )}
        </InfiniteScroll>
      </MainContainer>

      {!mobile && (
        <ActionBarContainer
          keywordHash={keywordHash}
          update={() => setUpdate(update + 1)}
          rankLink={rankLink}
        />
      )}
    </>
  );
}

export default SearchResults;

import { useState, useEffect } from 'react';
import { Pane } from '@cybercongress/gravity';
import { v4 as uuidv4 } from 'uuid';
import { useParams, useLocation, Link } from 'react-router-dom';
// import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScroll from 'react-infinite-scroller';
import { useDevice } from 'src/contexts/device';
import { useQueryClient } from 'src/contexts/queryClient';
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
import useCommunityPassports from 'src/features/passport/hooks/useCommunityPassports';
import { IpfsContentType } from 'src/utils/ipfs/ipfs';
import Pill from 'src/components/Pill/Pill';
import styles from './SearchResults.module.scss';
import Dropdown from 'src/components/Dropdown/Dropdown';
import Spark from 'src/components/search/Spark/Spark';
import { SearchItemResult } from 'src/soft.js/api/search';

const textPreviewSparkApp = (text, value) => (
  <div style={{ display: 'grid', gap: '10px' }}>
    <div>{text}</div>
    <div style={{ fontSize: '18px', color: '#36d6ae' }}>{value}</div>
  </div>
);

const search = async (
  client,
  hash,
  page
): Promise<
  | {
      result?: SearchItemResult[];
      pagination?: {
        total: string;
      };
    }
  | []
> => {
  try {
    const responseSearchResults = await client.search(hash, page);
    console.log(responseSearchResults);

    return responseSearchResults.result ? responseSearchResults : [];
  } catch (error) {
    return [];
  }
};

const reduceSearchResults = (data: SearchItemResult[], query: string) => {
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

const deF = {
  text: false,
  image: false,
  video: false,
  // audio: true,
  // application: true,
  // other: true,
};

function SearchResults() {
  const queryClient = useQueryClient();
  const { query = '' } = useParams();

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

  const [contentType, setContentType] = useState<{
    [key: string]: IpfsContentType;
  }>({});

  const [filters, setFilters] = useState(deF);
  const [filter2, setFilter2] = useState('rank');

  const { isMobile: mobile } = useDevice();
  useCommunityPassports();

  // useEffect(() => {
  //   if (query.match(/\//g)) {
  //     navigate(`/search/${replaceSlash(query)}`);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [query]);

  useEffect(() => {
    setContentType({});
    setFilters(deF);
  }, [query]);

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
          // responseSearchResults = searchResultsData as {
          //   result: SearchItemResult[];
          // };

          console.log(responseSearchResults);

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
        console.log(searchResultsData);

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

  if (query.match(PATTERN_CYBER)) {
    const key = uuidv4();
    searchItems.push(
      <Pane
        key={key}
        position="relative"
        className="hover-rank"
        display="flex"
        alignItems="center"
        marginBottom="-2px"
      >
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
      <Pane
        key={key}
        position="relative"
        className="hover-rank"
        display="flex"
        alignItems="center"
        marginBottom="-2px"
      >
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
      <Pane
        key={key}
        position="relative"
        className="hover-rank"
        display="flex"
        alignItems="center"
        marginBottom="-2px"
      >
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
      <Pane
        key={key}
        position="relative"
        className="hover-rank"
        display="flex"
        alignItems="center"
        marginBottom="-2px"
      >
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
      Object.keys(searchResults)
        .filter((item) => {
          if (!Object.values(filters).some((value) => value)) {
            return true;
          } else {
            if (!contentType[item]) {
              return false;
            }
            return filters[contentType[item]];
          }
        })
        .map((key) => {
          return (
            <Spark
              itemData={searchResults[key]}
              cid={key}
              key={key}
              query={query}
              handleRankClick={onClickRank}
              handleContentType={(type) =>
                setContentType((items) => {
                  return {
                    ...items,
                    [key]: type,
                  };
                })
              }
            />
          );
        })
    );
  }

  return (
    <>
      <MainContainer width="90%">
        <header className={styles.header}>
          <div>
            <button
              // style={{
              //   cursor: ''
              // }}
              onClick={() => {
                setFilters(deF);
              }}
            >
              <Pill
                text="all"
                color={
                  Object.values(filters).some((filter) => filter)
                    ? 'black'
                    : 'blue'
                }
              />
            </button>
            {Object.keys(filters).map((filter) => {
              if (!Object.values(contentType).includes(filter)) {
                return null;
              }

              return (
                <button
                  onClick={() => {
                    setFilters((item) => ({
                      ...item,
                      [filter]: !item[filter],
                    }));
                  }}
                >
                  <Pill
                    text={filter}
                    color={filters[filter] ? 'blue' : 'black'}
                  />
                </button>
              );
            })}
          </div>

          <Dropdown
            options={[
              {
                label: 'Rank',
                value: 'rank',
              },
              {
                label: 'Date',
                value: 'date',
              },
            ]}
            value={filter2}
            onChange={(value) => {
              setFilter2(value);
              window.alert('not working yet');
            }}
          />
        </header>
        <InfiniteScroll
          pageStart={-1}
          // initialLoad
          loadMore={fetchMoreData}
          hasMore={hasMore}
          loader={
            <h4
              style={{
                marginTop: 15,
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

import { useState, useEffect } from 'react';
import { Pane } from '@cybercongress/gravity';
import { v4 as uuidv4 } from 'uuid';
import { useParams, useLocation, Link } from 'react-router-dom';
// import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDevice } from 'src/contexts/device';
import { useQueryClient } from 'src/contexts/queryClient';
import { getIpfsHash, getRankGrade } from '../../utils/search/utils';
import {
  formatNumber,
  trimString,
  coinDecimals,
  encodeSlash,
} from '../../utils/utils';
import { Loading, Account, NoItems, Dots, SearchItem } from '../../components';
import ActionBarContainer from './ActionBarContainer';
import {
  PATTERN_CYBER,
  PATTERN_TX,
  PATTERN_CYBER_VALOPER,
  PATTERN_BLOCK,
  PATTERN_IPFS_HASH,
} from '../../utils/config';
import { MainContainer } from '../portal/components';
import useCommunityPassports from 'src/features/passport/hooks/useCommunityPassports';
import { IpfsContentType } from 'src/utils/ipfs/ipfs';
import Pill from 'src/components/Pill/Pill';
import styles from './SearchResults.module.scss';
import Spark from 'src/components/search/Spark/Spark';
import { SearchItemResult } from 'src/soft.js/api/search';
import useGetDiscussion from '../ipfs/hooks/useGetDiscussion';
import Dropdown from 'src/components/Dropdown/Dropdown';
import ButtonsGroup from 'src/components/buttons/ButtonsGroup/ButtonsGroup';
import useGetBackLink from '../ipfs/hooks/useGetBackLink';
import { set } from 'ramda';
import Links from 'src/components/search/Spark/Meta/Links/Links';
import { useInfiniteQuery } from '@tanstack/react-query';

const textPreviewSparkApp = (text, value) => (
  <div style={{ display: 'grid', gap: '10px' }}>
    <div>{text}</div>
    <div style={{ fontSize: '18px', color: '#36d6ae' }}>{value}</div>
  </div>
);

const search = async (
  client: ReturnType<typeof useQueryClient>,
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
    const responseSearchResults = await client.search(hash, page, 10);

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

        status: 'impossibleLoad',
        query,
        text: item.particle,
        content: false,
      },
    }),
    {}
  );
};

const initialFiltersState = {
  text: false,
  image: false,
  video: false,
  pdf: false,
  link: false,
  // audio: false,
};

const mapF = {
  text: '📄',
  image: '🖼️',
  video: '🎞️',
  pdf: '📑',
  link: '🔗',
  // a: '🎧',
};

type SearchItemType = {
  cid: string;

  rank?: string;
  grade?: string;
  timestamp?: string;
};

enum LinksFilter {
  backlinks = 'backlinks',
  all = 'all',
  cyberLinks = 'cyberLinks',
}

enum SortBy {
  'rank' = 'rank',
  'date' = 'date',
  popular = 'popular',
  mine = 'mine',
}

const mapS = {
  [SortBy.rank]: '⭐',
  [SortBy.date]: '📅',
  [SortBy.popular]: '🔥',
  [SortBy.mine]: '👤',
};

const LIMIT = 15;

const useSearch = (hash: string, skip?: boolean) => {
  const cid = hash;

  const queryClient = useQueryClient();

  const { data, fetchNextPage, error, isLoading } = useInfiniteQuery(
    ['useSearch', cid],
    async ({ pageParam = 0 }: { pageParam?: number }) => {
      const response = await queryClient?.search(cid, pageParam, LIMIT);

      return { data: response, page: pageParam };
    },
    {
      enabled: Boolean(queryClient && cid) && !skip,
      getNextPageParam: (lastPage) => {
        if (!lastPage.data.pagination.total) {
          return undefined;
        }

        const nextPage = lastPage.page++;

        console.log(lastPage);
        console.log(nextPage);

        return nextPage;
      },
    }
  );

  return {
    data: data?.pages.reduce((acc, page) => {
      return acc.concat(
        page.data.result.map((item) => {
          return {
            cid: item.particle,
            rank: coinDecimals(item.rank),
            grade: getRankGrade(coinDecimals(item.rank)),
            type: 'outcoming',
          };
        })
      );
    }, []),
    total: data?.pages[0].data.pagination.total,
    next: fetchNextPage,
    error,
    loading: isLoading,
  };
};

const useSearchData = (
  hash: string,
  sort: SortBy.rank | SortBy.date = SortBy.rank
): {
  // total: {
  //   to: number;
  //   from: number;
  // };
  // data: SearchItemType[];
  // loading: boolean;
  // error: any;
} => {
  const search = useSearch(hash);
  const backlinks = useGetBackLink(hash);
  const data = useGetDiscussion(hash, {
    skip: sort !== SortBy.date,
  });

  function next() {}

  // if (searchHook.data || backlinksHook.backlinks.length > 0) {
  //   debugger;
  // }

  // const backlinks = useGetBackLink(
  //   keywordHash,
  //   linksFilter === LinksFilter.cyberLinks
  // );

  // const queryNull = '0';
  // keywordHashNull = await getIpfsHash(queryNull);

  return {
    data: (() => {
      // (search.data || []).concat(backlinks.backlinks);

      if (sort === SortBy.rank) {
        return search.data || [];
        // eslint-disable-next-line no-else-return
      } else if (sort === SortBy.date) {
        return (
          data.data?.pages.reduce((acc, item) => {
            return acc.concat(item.data);
          }, []) || []
        );
      }
    })(),
    total: {
      to: backlinks.total,
      from: search.total,
    },
    next,
    loading: (() => {
      if (sort === SortBy.rank) {
        return search.loading;
        // eslint-disable-next-line no-else-return
      } else if (sort === SortBy.date) {
        return data.isFetching;
      }
    })(),
    error: null,
  };
};

function SearchResults() {
  const { query: q, cid } = useParams();

  let query = q || cid || '';

  const location = useLocation();
  // const navigate = useNavigate();
  const [keywordHash, setKeywordHash] = useState('');
  const [update, setUpdate] = useState(1);
  const [rankLink, setRankLink] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  console.log(keywordHash);

  const [contentType, setContentType] = useState<{
    [key: string]: IpfsContentType;
  }>({});

  const [filters, setFilters] = useState(initialFiltersState);
  const [filter2, setFilter2] = useState(
    localStorage.getItem('search-sort') || SortBy.rank
  );
  const [linksFilter, setLinksFilter] = useState(LinksFilter.all);

  const {
    data: items,
    total,
    loading,
    next,
  } = useSearchData(keywordHash, filter2);

  console.log(items);

  const { isMobile: mobile } = useDevice();

  // useEffect(() => {
  //   if (query.match(/\//g)) {
  //     navigate(`/search/${replaceSlash(query)}`);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [query]);

  useEffect(() => {
    setContentType({});
    setFilters(initialFiltersState);
  }, [query]);

  useEffect(() => {
    (async () => {
      let keywordHashTemp = '';

      if (query.match(PATTERN_IPFS_HASH)) {
        keywordHashTemp = query;
      } else {
        keywordHashTemp = await getIpfsHash(encodeSlash(query));
      }

      setKeywordHash(keywordHashTemp);
    })();
  }, [query]);

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

  if (Object.keys(items).length > 0) {
    searchItems.push(
      items
        .filter((item) => {
          const cid = item.cid;
          if (!Object.values(filters).some((value) => value)) {
            return true;
          } else {
            if (!contentType[cid]) {
              return false;
            }
            return filters[contentType[cid]];
          }
        })
        .map((key, i) => {
          return (
            <Spark
              itemData={key}
              cid={key.cid}
              key={key.cid + i}
              linkType={key.type}
              query={query}
              handleRankClick={onClickRank}
              handleContentType={(type) =>
                setContentType((items) => {
                  return {
                    ...items,
                    [key.cid]: type,
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
            <ButtonsGroup
              type="checkbox"
              onChange={(filter: typeof initialFiltersState & 'all') => {
                if (filter === 'all') {
                  setFilters(initialFiltersState);
                  return;
                }

                setFilters((filters) => ({
                  ...initialFiltersState,
                  [filter]: !filters[filter],
                }));
              }}
              items={[
                {
                  label: 'all',
                  checked: !Object.values(filters).some((filter) => filter),
                },
              ].concat(
                Object.keys(filters)
                  .map((filter) => {
                    if (!Object.values(contentType).includes(filter)) {
                      return null;
                    }

                    return {
                      label: mapF[filter],
                      name: filter,
                      checked: filters[filter],
                    };
                  })
                  .filter((item) => !!item)
              )}
            />
          </div>

          <ButtonsGroup
            type="radio"
            items={Object.values(SortBy).map((sortType) => {
              return {
                label: mapS[sortType],
                disabled:
                  sortType === SortBy.mine || sortType === SortBy.popular,
                name: sortType,
                checked: filter2 === sortType,
              };
            })}
            onChange={(sortType: SortBy) => {
              setFilter2(sortType);
              localStorage.setItem('search-sort', sortType);
            }}
          />

          <Links
            backlinks={total.to}
            outcoming={total.from}
            value={linksFilter}
            onChange={(val: LinksFilter) => {
              setLinksFilter(val);
            }}
          />

          <div className={styles.total}>
            <span>{total.to + total.from}</span> particles
          </div>
        </header>

        <InfiniteScroll
          dataLength={items.length}
          next={next}
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

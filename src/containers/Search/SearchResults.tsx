import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDevice } from 'src/contexts/device';
import { IpfsContentType } from 'src/utils/ipfs/ipfs';
import { getIpfsHash } from '../../utils/search/utils';
import { encodeSlash } from '../../utils/utils';
import { Loading, NoItems, Dots } from '../../components';
import ActionBarContainer from './ActionBarContainer';
import { PATTERN_IPFS_HASH } from '../../utils/config';
import { MainContainer } from '../portal/components';
import Spark from 'src/components/search/Spark/Spark';
import FirstItems from './_FirstItems.refactor';
import useSearchData from './useSearchData';
import { LinksTypeFilter, SortBy } from './types';
import Filters from './Filters/Filters';

export const initialContentTypeFilterState = {
  text: false,
  image: false,
  video: false,
  pdf: false,
  link: false,
  // audio: false,
};

const sortByLSKey = 'search-sort';

function SearchResults() {
  const { query: q, cid } = useParams();

  let query = q || cid || '';

  // const location = useLocation();
  // const navigate = useNavigate();
  const [keywordHash, setKeywordHash] = useState('');
  const [update, setUpdate] = useState(1);
  const [rankLink, setRankLink] = useState(null);

  console.log(keywordHash);

  const [contentType, setContentType] = useState<{
    [key: string]: IpfsContentType;
  }>({});

  const [contentTypeFilter, setContentTypeFilter] = useState(
    initialContentTypeFilterState
  );
  const [sortBy, setSortBy] = useState(
    localStorage.getItem(sortByLSKey) || SortBy.rank
  );
  const [linksTypeFilter, setLinksTypeFilter] = useState(LinksTypeFilter.all);

  const {
    data: items,
    total,
    loading,
    hasMore,
    isInitialLoading,
    next,
  } = useSearchData(keywordHash, {
    sortBy,
    linksType: linksTypeFilter,
  });

  const { isMobile: mobile } = useDevice();

  // useEffect(() => {
  //   if (query.match(/\//g)) {
  //     navigate(`/search/${replaceSlash(query)}`);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [query]);

  useEffect(() => {
    setContentTypeFilter(initialContentTypeFilterState);
    setContentType({});

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

  console.log(rankLink);

  const renderItems = items
    .filter((item) => {
      const { cid } = item;

      if (!Object.values(contentTypeFilter).some((value) => value)) {
        return true;
      } else {
        if (!contentType[cid]) {
          return false;
        }
        return contentTypeFilter[contentType[cid]];
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
          rankSelected={rankLink === key.cid}
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
    });

  return (
    <>
      <MainContainer width="90%">
        <Filters
          filters={contentTypeFilter}
          setFilters={setContentTypeFilter}
          filter2={sortBy}
          setFilter2={setSortBy}
          linksFilter={linksTypeFilter}
          setLinksFilter={setLinksTypeFilter}
          total={total}
          total2={items.length}
          contentType={contentType}
        />

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
          <FirstItems query={query} />

          {Object.keys(renderItems).length > 0 && !isInitialLoading ? (
            renderItems
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

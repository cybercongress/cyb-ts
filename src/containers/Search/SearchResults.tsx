import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDevice } from 'src/contexts/device';
import { IpfsContentType } from 'src/utils/ipfs/ipfs';
import Spark from 'src/components/search/Spark/Spark';
import { useAdviser } from 'src/features/adviser/context';
import Loader2 from 'src/components/ui/Loader2';
import { getIpfsHash } from '../../utils/search/utils';
import { encodeSlash } from '../../utils/utils';
import { NoItems } from '../../components';
import ActionBarContainer from './ActionBarContainer';
import { PATTERN_IPFS_HASH } from '../../utils/config';
import { MainContainer } from '../portal/components';
import FirstItems from './_FirstItems.refactor';
import useSearchData from './hooks/useSearchData';
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

  const query = q || cid || '';

  // const location = useLocation();
  // const navigate = useNavigate();
  const [keywordHash, setKeywordHash] = useState('');
  console.debug(query, keywordHash);
  const [rankLink, setRankLink] = useState(null);

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
    isFetching,
    error,
    hasMore,
    isInitialLoading,
    refetch,
    fetchNextPage: next,
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

  const { setAdviser } = useAdviser();

  useEffect(() => {
    if (error) {
      setAdviser(JSON.stringify(error), 'red');
    } else {
      // setAdviser('');
    }
  }, [setAdviser, error, isFetching, isInitialLoading]);

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

  const onClickRank = async (key) => {
    if (rankLink === key) {
      setRankLink(null);
    } else {
      setRankLink(key);
    }
  };

  const renderItems = items
    .filter((item) => {
      const { cid } = item;

      if (!Object.values(contentTypeFilter).some((value) => value)) {
        return true;
      }
      if (!contentType[cid]) {
        return false;
      }
      return contentTypeFilter[contentType[cid]];
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

        <FirstItems query={query} />

        {isInitialLoading ? (
          <Loader2 />
        ) : Object.keys(renderItems).length > 0 ? (
          <InfiniteScroll
            dataLength={items.length}
            next={next}
            hasMore={hasMore}
            loader={<Loader2 />}
          >
            {renderItems}
          </InfiniteScroll>
        ) : (
          <NoItems text={`No information about ${query}`} />
        )}
      </MainContainer>

      {!mobile && (
        <ActionBarContainer
          keywordHash={keywordHash}
          update={() => {
            refetch();
            setRankLink(null);
          }}
          rankLink={rankLink}
        />
      )}
    </>
  );
}

export default SearchResults;

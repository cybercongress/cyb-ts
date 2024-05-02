import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDevice } from 'src/contexts/device';
import { IpfsContentType } from 'src/services/ipfs/types';
import Spark from 'src/components/search/Spark/Spark';
import Loader2 from 'src/components/ui/Loader2';
import { getIpfsHash } from 'src/utils/ipfs/helpers';
import { PATTERN_IPFS_HASH } from 'src/constants/patterns';
import Display from 'src/components/containerGradient/Display/Display';

import { encodeSlash } from '../../utils/utils';
import ActionBarContainer from './ActionBarContainer';
import FirstItems from './_FirstItems.refactor';
import useSearchData from './hooks/useSearchData';
import { LinksTypeFilter, SortBy } from './types';
import Filters from './Filters/Filters';
import styles from './SearchResults.module.scss';
import { initialContentTypeFilterState } from './constants';
import { getSearchQuery } from 'src/utils/search/utils';

const sortByLSKey = 'search-sort';

function SearchResults() {
  const { query: q, cid } = useParams();

  const query = q || cid || '';

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

  useEffect(() => {
    setContentTypeFilter(initialContentTypeFilterState);
    setContentType({});

    (async () => {
      const keywordHash = await getSearchQuery(query);

      setKeywordHash(keywordHash);
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

      <div className={styles.search}>
        <FirstItems query={query} />

        {isInitialLoading ? (
          <Loader2 />
        ) : Object.keys(renderItems).length > 0 ? (
          <InfiniteScroll
            dataLength={items.length}
            next={next}
            className={styles.infiniteScroll}
            hasMore={hasMore}
            loader={<Loader2 />}
          >
            {renderItems}
          </InfiniteScroll>
        ) : error ? (
          <Display color="red">
            <p>{error.message}</p>
          </Display>
        ) : (
          <Display color="white">
            there are no answers or questions to this particle <br /> be the
            first and create one
          </Display>
        )}
      </div>

      {!mobile && (
        <div className={styles.actionBar}>
          <ActionBarContainer
            keywordHash={keywordHash}
            update={() => {
              refetch();
              setRankLink(null);
            }}
            rankLink={rankLink}
          />
        </div>
      )}
    </>
  );
}

export default SearchResults;

import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spark from 'src/components/search/Spark/Spark';
import useSearchData from 'src/containers/Search/hooks/useSearchData';
import { LinksTypeFilter, SortBy } from 'src/containers/Search/types';
import styles from 'src/containers/Search/SearchResults.module.scss';
import FirstItems from 'src/containers/Search/_FirstItems.refactor';
import Loader2 from 'src/components/ui/Loader2';
import Display from 'src/components/containerGradient/Display/Display';
import ActionBarContainer from 'src/containers/Search/ActionBarContainer';
import Filters from 'src/containers/Search/Filters/Filters';
import { useBackend } from 'src/contexts/backend/backend';
import { useDevice } from 'src/contexts/device';

import { IpfsContentType } from 'src/utils/ipfs/ipfs';

export const initialContentTypeFilterState = {
  text: false,
  image: false,
  video: false,
  pdf: false,
  link: false,
  // audio: false,
};

const sortByLSKey = 'search-sort';

function ProposalsDetailTableComments({ proposalId }) {
  const { ipfsApi } = useBackend();
  const query = `bostrom proposal ${proposalId}`;
  
  const [proposalHash, setproposalHash] = useState('');
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

  const { isMobile: mobile } = useDevice();
  console.debug(proposalId)
  useEffect(() => {
    setContentTypeFilter(initialContentTypeFilterState);
    setContentType({});

    (async () => {
      let keywordHashTemp = '';

      keywordHashTemp = await ipfsApi.addContent(query);

      setproposalHash(keywordHashTemp);
    })();
  }, [query]);

  const onClickRank = async (key) => {
  if (rankLink === key) {
    setRankLink(null);
  } else {
    setRankLink(key);
  }
};

  const {
    data: items,
    total,
    error,
    hasMore,
    isInitialLoading,
    refetch,
    fetchNextPage: next,
  } = useSearchData(proposalHash, {
    sortBy,
    linksType: linksTypeFilter,
  });

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
      console.debug(key)
      console.debug(key.cid)
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
            there are no comments to this proposal <br /> be the first and
            create one
          </Display>
        )}
      </div>
      {!mobile && (
        <div className={styles.actionBar}>
          <ActionBarContainer
            textBtn={'Comment'}
            keywordHash={proposalHash}
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
export default ProposalsDetailTableComments;


import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spark from 'src/components/search/Spark/Spark';
import useSearchData from 'src/containers/Search/hooks/useSearchData';
import { LinksTypeFilter, SortBy } from 'src/containers/Search/types';
import styles from './styles.scss';
import FirstItems from 'src/containers/Search/_FirstItems.refactor';
import { Dots } from '../../components';
import Display from 'src/components/containerGradient/Display/Display';
import ActionBarContainer from 'src/containers/Search/ActionBarContainer';
import Filters from 'src/containers/Search/Filters/Filters';
import { useBackend } from 'src/contexts/backend/backend';
import { useDevice } from 'src/contexts/device';
import { useParams } from 'react-router-dom';
import { IpfsContentType } from 'src/utils/ipfs/ipfs';

import { getIpfsHash } from 'src/utils/ipfs/helpers';
import { encodeSlash } from '../../utils/utils';

export const initialContentTypeFilterState = {
  text: false,
  image: false,
  video: false,
  pdf: false,
  link: false,
  // audio: false,
};

const sortByLSKey = 'search-sort';

function ProposalsDetailTableComments() {
  const { proposalId } = useParams();

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
  const storedSortBy = localStorage.getItem(sortByLSKey);

  const [sortBy, setSortBy] = useState(
    storedSortBy ? (storedSortBy as SortBy) : SortBy.date
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
  } = useSearchData(proposalHash, {
    sortBy,
    linksType: linksTypeFilter,
  });
  const { isMobile: mobile } = useDevice();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setContentTypeFilter(initialContentTypeFilterState);
    setContentType({});

    (async () => {
      let keywordHashTemp: string = '';

      try {
        keywordHashTemp = await getIpfsHash(encodeSlash(query));
        setproposalHash(keywordHashTemp);
      } catch (error) {
        setErrorMessage('Error getting hash from getIpfsHash:' + error.message);
        try {
          keywordHashTemp = await ipfsApi.addContent(query);
          setproposalHash(keywordHashTemp);
        } catch (error) {
          setErrorMessage(
            'Error adding content using ipfsApi:' + error.message
          );
        }
      }
    })();
  }, [query]);

  const updateComments = async () => {
    await refetch();
    setRankLink(null);
  };

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
      <div className={styles.filters}>
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
      </div>

      <div className={styles.search}>
        <FirstItems query={query} />

        {isInitialLoading ? (
          <div className={styles.loader}>
            <h4>
              Loading
              <Dots />
            </h4>
          </div>
        ) : Object.keys(renderItems).length > 0 ? (
          <InfiniteScroll
            dataLength={items.length}
            next={next}
            className={styles.infiniteScroll}
            hasMore={hasMore}
            loader={
              <h4>
                Loading
                <Dots />
              </h4>
            }
          >
            {renderItems}
          </InfiniteScroll>
        ) : error ? (
          <Display color="red">
            <p>{error.message}</p>
          </Display>
        ) : errorMessage ? (
          <Display color="red">
            <p>{errorMessage}</p>
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
            update={updateComments}
            rankLink={rankLink}
          />
        </div>
      )}
    </>
  );
}
export default ProposalsDetailTableComments;

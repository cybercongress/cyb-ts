import {
  matchPath,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Display from 'src/components/containerGradient/Display/Display';
import Spark from 'src/components/search/Spark/Spark';
import Loader2 from 'src/components/ui/Loader2';
import { PATTERN_IPFS_HASH } from 'src/constants/patterns';
import { useDevice } from 'src/contexts/device';
import { IpfsContentType } from 'src/services/ipfs/types';
import { getIpfsHash } from 'src/utils/ipfs/helpers';

import useIsOnline from 'src/hooks/useIsOnline';
import { encodeSlash } from '../../utils/utils';
import ActionBarContainer from './ActionBarContainer';
import Filters from './Filters/Filters';
import styles from './SearchResults.module.scss';
import FirstItems from './_FirstItems.refactor';
import { initialContentTypeFilterState } from './constants';
import useSearchData from './hooks/useSearchData';
import { LinksTypeFilter, SortBy } from './types';
import { routes } from 'src/routes';

const sortByLSKey = 'search-sort';
const NEURON_SEARCH_KEY = 'neuron';

type Props = {
  query?: string;
  noCommentText?: React.ReactNode;
  actionBarTextBtn?: string;
};

function SearchResults({
  query: propQuery,
  noCommentText,
  actionBarTextBtn,
}: Props) {
  const { query: q, cid } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const [neuron, setNeuron] = useState(searchParams.get(NEURON_SEARCH_KEY));

  const location = useLocation();

  const query = propQuery || q || cid || '';
  const isOnline = useIsOnline();

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
    neuron
      ? SortBy.date
      : (localStorage.getItem(sortByLSKey) as SortBy | null) || SortBy.rank
  );

  const [linksTypeFilter, setLinksTypeFilter] = useState(LinksTypeFilter.all);

  const noResultsText = isOnline
    ? noCommentText || (
        <>
          there are no answers or questions to this particle{' '}
          {neuron && 'for this neuron'}
          <br /> be the first and create one
        </>
      )
    : "ther's nothing to show, wait until you're online";

  const {
    data: items,
    total,
    error,
    hasMore,
    isInitialLoading,
    refetch,
    fetchNextPage: next,
  } = useSearchData(keywordHash, neuron, {
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
        neuronFilter={{
          value: neuron,
          setValue: (address) => {
            setNeuron(address);
            setSortBy(SortBy.date);

            // TODO: need to check on senate page
            if (matchPath(routes.oracle.ask.path, location.pathname)) {
              setSearchParams((prevParams) => {
                if (address) {
                  prevParams.set(NEURON_SEARCH_KEY, address);
                } else {
                  prevParams.delete(NEURON_SEARCH_KEY);
                }

                return prevParams;
              });
            }
          },
        }}
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
          <Display color="white">{noResultsText}</Display>
        )}
      </div>

      {!mobile && (
        <div className={styles.actionBar}>
          <ActionBarContainer
            textBtn={actionBarTextBtn}
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

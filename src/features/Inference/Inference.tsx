import { useEffect, useMemo, useState } from 'react';
import { Display, MainContainer } from 'src/components';
import { getSearchQuery } from 'src/utils/search/utils';
import { useParams } from 'react-router-dom';
import Loader2 from 'src/components/ui/Loader2';
import useInference from './hooks/useInference';
import RowItems from './components/RowItems/RowItems';
import ActionBarContainer from './components/ActionBar/ActionBar';
import Filters from './components/Filters/Filters';
import { SortBy } from './type';
import sortByKey from './utils/sortByKey';

function Inference() {
  const { query } = useParams();

  const [keywordHash, setKeywordHash] = useState('');
  const [sortBy, setSortBy] = useState(SortBy.inference);

  const { data, isFetching, error } = useInference(keywordHash);

  useEffect(() => {
    (async () => {
      const keywordHash = await getSearchQuery(query || '');

      setKeywordHash(keywordHash);
    })();
  }, [query]);

  const dataSortByKey = useMemo(() => {
    if (!data) {
      return [];
    }

    return sortByKey(data.result, sortBy);
  }, [data, sortBy]);

  return (
    <>
      <MainContainer>
        <Filters
          filter={sortBy}
          setFilter={setSortBy}
          total={data?.result.length}
        />
        {isFetching && !data ? (
          <Loader2 />
        ) : data && data.result.length > 0 ? (
          <RowItems dataItem={dataSortByKey} sortBy={sortBy} />
        ) : error ? (
          <Display color="red">
            <p>{error.toString()}</p>
          </Display>
        ) : (
          <Display color="white">
            <p>
              there are no answers or questions to this particle <br /> be the
              first and create one
            </p>
          </Display>
        )}
      </MainContainer>
      <ActionBarContainer />
    </>
  );
}

export default Inference;

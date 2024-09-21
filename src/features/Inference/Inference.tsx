import { useEffect, useState } from 'react';
import { Display, MainContainer } from 'src/components';
import { getSearchQuery } from 'src/utils/search/utils';
import { useParams } from 'react-router-dom';
import Loader2 from 'src/components/ui/Loader2';
import useInference from './hooks/useInference';
import RowItems from './components/RowItems/RowItems';
import ActionBarContainer from './components/ActionBar/ActionBar';

function Inference() {
  const { query } = useParams();

  const [keywordHash, setKeywordHash] = useState('');

  const { data, isFetching, error } = useInference(keywordHash);

  useEffect(() => {
    (async () => {
      const keywordHash = await getSearchQuery(query || '');

      setKeywordHash(keywordHash);
    })();
  }, [query]);

  return (
    <>
      <MainContainer>
        {isFetching && !data ? (
          <Loader2 />
        ) : data && data.result.length > 0 ? (
          <RowItems dataItem={data.result} />
        ) : error ? (
          <Display color="red">
            <p>{error.message}</p>
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

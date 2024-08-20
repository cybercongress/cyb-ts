import { useSearchParams } from 'react-router-dom';

const DEFAULT_LIMIT = 30000;

function useGraphLimit() {
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = Number(searchParams.get('limit')) || DEFAULT_LIMIT;

  return {
    limit,
    setSearchParams,
  };
}

export default useGraphLimit;

import { useSearchParams } from 'react-router-dom';

const DEFAULT_LIMIT = 20000;

function useGraphLimit(initialLimit?: number) {
  const [searchParams, setSearchParams] = useSearchParams();

  const limit =
    Number(searchParams.get('limit')) || initialLimit || DEFAULT_LIMIT;

  return {
    limit,
    setSearchParams,
  };
}

export default useGraphLimit;

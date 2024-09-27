import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const DEFAULT_LIMIT = 10000;

function useGraphLimit(initialLimit?: number) {
  const [searchParams, setSearchParams] = useSearchParams();

  const limit =
    Number(searchParams.get('limit')) || initialLimit || DEFAULT_LIMIT;

  useEffect(() => {
    setSearchParams({ limit });
  }, [limit]);

  return {
    limit,
    setSearchParams,
    setLimit: (limit: number) => {
      setSearchParams({ limit });
    },
  };
}

export default useGraphLimit;

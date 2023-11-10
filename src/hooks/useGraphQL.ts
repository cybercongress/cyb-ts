import { useEffect, useState } from 'react';
import { getGraphQLQuery } from 'src/utils/search/utils';

const useGraphQLQuery = (query: string, { skip = false } = {}) => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (skip) {
      return;
    }

    (async () => {
      try {
        const response = await getGraphQLQuery(query);
        setData(response);
      } catch (e) {
        console.error(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [query, skip]);

  return { data, loading, error };
};

export default useGraphQLQuery;

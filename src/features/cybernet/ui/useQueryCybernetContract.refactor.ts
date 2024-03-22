import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { equals } from 'ramda';
import { CybernetContractQuery, queryCybernetContract } from '../api';

type Props = {
  query: CybernetContractQuery;
  skip?: boolean;
};

// TODO: copied from usePassportContract, reuse  core logic

function useQueryCybernetContract<DataType>({ query, skip }: Props) {
  const [data, setData] = useState<DataType>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const queryClient = useQueryClient();

  const lastQuery = useRef<CybernetContractQuery>();

  async function queryContract(query: CybernetContractQuery) {
    if (!queryClient) {
      return;
    }

    try {
      setLoading(true);
      setData(undefined);
      setError(undefined);

      const response = await queryCybernetContract(query, queryClient);
      setData(response);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (skip) {
      return;
    }

    if (equals(lastQuery.current, query)) {
      return;
    }

    lastQuery.current = query;
    queryContract(query);
  }, [query, skip]);

  console.log(data);

  function refetch() {
    queryContract(query);
  }

  return {
    data,
    loading,
    error,
    refetch,
  };
}

export default useQueryCybernetContract;

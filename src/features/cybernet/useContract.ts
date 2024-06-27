import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { equals } from 'ramda';
import {
  PassportContractQuery,
  queryPassportContract,
} from 'src/soft.js/api/passport';
import { queryContract2 } from './api';

type Props = {
  query: PassportContractQuery;
  skip?: boolean;
};

function useCybernetContract<DataType>({ query, skip }: Props) {
  const [data, setData] = useState<DataType>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const queryClient = useQueryClient();

  const lastQuery = useRef<PassportContractQuery>();

  async function queryContract(query: PassportContractQuery) {
    if (!queryClient) {
      return;
    }

    try {
      setLoading(true);
      setData(undefined);
      setError(undefined);

      const response = await queryContract2(query, queryClient);
      setData(response);
    } catch (error) {
      console.error(error);
      setError(error);
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

  return {
    data,
    loading,
    error,
  };
}

export default useCybernetContract;

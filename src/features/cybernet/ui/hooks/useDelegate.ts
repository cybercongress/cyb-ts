import { Delegator } from '../../types';
import useQueryCybernetContract from '../useQueryCybernetContract.refactor';

function useDelegate(address: string) {
  const query = useQueryCybernetContract<Delegator>({
    query: {
      get_delegate: {
        delegate: address,
      },
    },
  });

  return query;
}

export default useDelegate;

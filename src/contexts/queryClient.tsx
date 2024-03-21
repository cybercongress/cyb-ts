import React, { useContext } from 'react';
import { CyberClient } from '@cybercongress/cyber-js';
import { Option } from 'src/types';
import { useQuery } from '@tanstack/react-query';
import { API } from 'src/constants/config';

const QueryClientContext = React.createContext<Option<CyberClient>>(undefined);

export function useQueryClient() {
  return useContext(QueryClientContext);
}

function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const { data, error, isFetching } = useQuery({
    queryKey: ['cyberClient', 'connect'],
    queryFn: async () => {
      return CyberClient.connect(API);
    },
  });

  if (isFetching) {
    return null;
  }

  if (error) {
    return <span>Error queryClient connect: {error.message}</span>;
  }

  return (
    <QueryClientContext.Provider value={data}>
      {children}
    </QueryClientContext.Provider>
  );
}

export default QueryClientProvider;

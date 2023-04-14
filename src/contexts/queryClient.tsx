import React, { useContext, useEffect, useState } from 'react';
import { CyberClient } from '@cybercongress/cyber-js';
import { CYBER } from 'src/utils/config';
import { Option } from 'src/types';

const QueryClientContext = React.createContext<Option<CyberClient>>(undefined);

export function useQueryClient() {
  return useContext(QueryClientContext);
}

function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient, setQueryClient] = useState<Option<CyberClient>>();

  useEffect(() => {
    async function createQueryClient() {
      try {
        const queryClient = await CyberClient.connect(CYBER.CYBER_NODE_URL_API);
        setQueryClient(queryClient);
      } catch (error) {
        console.error(error);
        // need handle?
      }
    }

    createQueryClient();
  }, []);

  // TODO: seems it should be while bootloader
  if (!queryClient) {
    return <div>set up CyberClient ...</div>;
  }

  return (
    <QueryClientContext.Provider value={queryClient}>
      {children}
    </QueryClientContext.Provider>
  );
}

export default QueryClientProvider;

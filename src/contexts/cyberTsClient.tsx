import {
  cyber,
  createRpcQueryHooks,
  useRpcClient,
} from '@cybercongress/cyber-ts';

import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RPC_URL } from 'src/constants/config';

const QueryClientContext = React.createContext<{
  rpc: Awaited<ReturnType<typeof cyber.ClientFactory.createRPCQueryClient>>;
  hooks: ReturnType<typeof createRpcQueryHooks>;
}>(undefined);

export function useCyberTsQueryClient() {
  return useContext(QueryClientContext);
}

const rpcEndpoint = RPC_URL;

function CyberTsQueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, error, isFetching } = useQuery({
    queryKey: ['cyberClient2', 'connect'],
    queryFn: () => {
      const { createRPCQueryClient } = cyber.ClientFactory;

      return createRPCQueryClient({
        rpcEndpoint,
      });
    },
  });

  if (error) {
    console.error('Error queryClient connect: ', error.message);
  }

  const { data: rpcClient } = useRpcClient({
    rpcEndpoint,
    options: {
      enabled: !!rpcEndpoint,
    },
  });

  if (!rpcClient) {
    return null;
  }

  const hooks = createRpcQueryHooks({
    rpc: rpcClient,
  });

  return (
    <QueryClientContext.Provider
      value={{
        rpc: data,
        hooks,
      }}
    >
      {children}
    </QueryClientContext.Provider>
  );
}

export default CyberTsQueryClientProvider;

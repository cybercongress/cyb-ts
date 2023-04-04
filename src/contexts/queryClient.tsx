import React, { useEffect, useMemo, useState } from 'react';
import { CyberClient } from '@cybercongress/cyber-js';
import { CYBER } from 'src/utils/config';

type SdkQueryClientContextType = {
  readonly queryClient: null | CyberClient;
};

const valueContext = {
  queryClient: null,
};

export const SdkQueryClientContext =
  React.createContext<SdkQueryClientContextType>(valueContext);

function SdkQueryClientProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<SdkQueryClientContextType>(valueContext);

  useEffect(() => {
    const createQueryCliet = async () => {
      const queryClient = await CyberClient.connect(CYBER.CYBER_NODE_URL_API);
      setValue((item) => ({
        ...item,
        queryClient,
      }));
    };
    createQueryCliet();
  }, []);

  return (
    <SdkQueryClientContext.Provider
      value={useMemo(
        () => ({ ...value } as SdkQueryClientContextType),
        [value]
      )}
    >
      {children}
    </SdkQueryClientContext.Provider>
  );
}

export default SdkQueryClientProvider;

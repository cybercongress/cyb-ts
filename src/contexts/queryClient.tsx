import React, { useEffect, useMemo, useState } from 'react';
import { CyberClient } from '@cybercongress/cyber-js';
import { CYBER } from 'src/utils/config';
import { Option } from 'src/types/common';

type SdkQueryClientContextType = {
  readonly queryClient: Option<CyberClient>;
};

const valueContext = {
  queryClient: undefined,
};

export const SdkQueryClientContext =
  React.createContext<SdkQueryClientContextType>(valueContext);

function SdkQueryClientProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<SdkQueryClientContextType>(valueContext);
  const [loadClient, setLoadClient] = useState(true);

  useEffect(() => {
    const createQueryCliet = async () => {
      setLoadClient(true);
      const queryClient = await CyberClient.connect(CYBER.CYBER_NODE_URL_API);
      setValue((item) => ({
        ...item,
        queryClient,
      }));
      setLoadClient(false);
    };
    createQueryCliet();
  }, []);

  const valueMemo = useMemo(() => ({ ...value }), [value]);

  if (loadClient) {
    return <div>set up CyberClient ...</div>;
  }

  return (
    <SdkQueryClientContext.Provider value={valueMemo}>
      {children}
    </SdkQueryClientContext.Provider>
  );
}

export default SdkQueryClientProvider;

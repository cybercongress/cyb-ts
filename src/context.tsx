/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useEffect } from 'react';
import { CyberClient } from '@cybercongress/cyber-js';
import { CYBER } from './utils/config';

import { $TsFixMe } from './types/tsfix';

type ValueContextType = {
  jsCyber: CyberClient | null;
};

const valueContext = {
  keplr: null,
  jsCyber: null,
  initSigner: () => {},
};

export const AppContext = React.createContext<ValueContextType>(valueContext);

// const useContextProvider = () => useContext(AppContext);

function AppContextProvider({ children }) {
  const [value, setValue] = useState(valueContext);
  const [loadUrl, setLoadUrl] = useState(true);

  // console.log('dataMarket', dataMarket);

  useEffect(() => {
    const createQueryCliet = async () => {
      setLoadUrl(true);
      const queryClient = await CyberClient.connect(CYBER.CYBER_NODE_URL_API);
      setValue((item: $TsFixMe) => ({
        ...item,
        jsCyber: queryClient,
      }));
      setLoadUrl(false);
    };
    createQueryCliet();
  }, []);

  if (loadUrl) {
    return <div>...</div>;
  }

  return (
    <AppContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        ...value,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;

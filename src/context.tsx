/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useEffect } from 'react';
import { CyberClient } from '@cybercongress/cyber-js';
import { CYBER } from './utils/config';
import { useWebsockets } from './websockets/context';

import { $TsFixMe } from './types/tsfix';

type ValueContextType = {
  jsCyber: CyberClient | null;
  block: number | null;
};

const valueContext = {
  keplr: null,
  jsCyber: null,
  initSigner: () => {},
  block: null,
};

export const AppContext = React.createContext<ValueContextType>(valueContext);
function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState(valueContext);
  const [loadUrl, setLoadUrl] = useState(true);
  const { cyber } = useWebsockets();
  const [blockHeight, setBlockHeight] = useState<number | null>(null);

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

  useEffect(() => {
    if (!cyber?.connected) {
      return;
    }

    cyber.sendMessage({
      method: 'subscribe',
      params: ["tm.event='NewBlockHeader'"],
      id: '1',
      jsonrpc: '2.0',
    });
  }, [cyber, cyber?.connected]);

  useEffect(() => {
    if (!cyber?.message?.result) {
      return;
    }

    const message = cyber?.message;

    if (
      Object.keys(message.result).length > 0 &&
      message.result.data.type === 'tendermint/event/NewBlockHeader'
    ) {
      const { height } = message.result.data.value.header;
      setBlockHeight(height);
    }
  }, [cyber?.message]);

  if (loadUrl) {
    return <div>...</div>;
  }

  return (
    <AppContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        ...value,
        block: blockHeight,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;

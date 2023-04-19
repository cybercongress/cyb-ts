/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useEffect } from 'react';
import { useWebsockets } from './websockets/context';

type ValueContextType = {
  block: number | null;
};

const valueContext = {
  block: null,
};

export const AppContext = React.createContext<ValueContextType>(valueContext);
function AppContextProvider({ children }: { children: React.ReactNode }) {
  const { cyber } = useWebsockets();
  const [blockHeight, setBlockHeight] = useState<number | null>(null);

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

  return (
    <AppContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        block: blockHeight,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;

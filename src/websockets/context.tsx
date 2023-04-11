import React, { useMemo } from 'react';
import useWebSocket, { Socket } from './hook';
import { CYBER } from 'src/utils/config';

const WebsocketsContext = React.createContext<{ cyber: Socket | null }>({
  cyber: null,
});

export function useWebsockets() {
  return React.useContext(WebsocketsContext);
}

function WebsocketsProvider({ children }: { children: React.ReactNode }) {
  const cyberWebsocket = useWebSocket(CYBER.CYBER_WEBSOCKET_URL);

  const value = useMemo(() => {
    return {
      cyber: cyberWebsocket,
      // may be added more
    };
  }, [cyberWebsocket]);

  return (
    <WebsocketsContext.Provider value={value}>
      {children}
    </WebsocketsContext.Provider>
  );
}

export default WebsocketsProvider;

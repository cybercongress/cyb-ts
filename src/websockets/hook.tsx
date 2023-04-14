import { useState, useEffect, useRef } from 'react';

export type Socket = {
  connected: boolean;
  message: any | null;
  sendMessage: (message: object) => void;
};

function useWebSocket(url: string): Socket {
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState<Socket['message']>(null);
  const webSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    webSocketRef.current = new WebSocket(url);

    webSocketRef.current.onopen = () => {
      setConnected(true);
    };

    webSocketRef.current.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessage(newMessage);
    };

    webSocketRef.current.onclose = () => {
      setConnected(false);
    };

    return () => {
      webSocketRef.current?.close();
    };
  }, [url]);

  function sendMessage(message: object) {
    if (!connected || !webSocketRef.current) {
      return;
    }

    webSocketRef.current.send(JSON.stringify(message));
  }

  return { connected, message, sendMessage };
}

export default useWebSocket;

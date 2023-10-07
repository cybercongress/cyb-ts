import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CybIpfsNode } from 'src/services/ipfs/ipfs';
import { initIpfsNode } from 'src/services/ipfs/node/factory';

export type IpfsOptsType = {
  ipfsNodeType: 'external' | 'embedded' | 'helia';
  urlOpts: string;
  userGateway: string;
};

type IpfsContextType = {
  node: null | CybIpfsNode;
  isReady: boolean;
  error: null | string;
  isLoading: boolean;
};

export const getIpfsOpts = () => {
  let ipfsOpts = {
    ipfsNodeType: 'embedded',
    urlOpts: '/ip4/127.0.0.1/tcp/5001', // default url
    userGateway: 'http://127.0.0.1:8080',
  };

  // get type ipfs
  const lsTypeIpfs = localStorage.getItem('ipfsState');
  if (lsTypeIpfs !== null) {
    const lsTypeIpfsData = JSON.parse(lsTypeIpfs);
    ipfsOpts = { ...ipfsOpts, ...lsTypeIpfsData };
  }

  localStorage.setItem('ipfsState', JSON.stringify(ipfsOpts));

  return ipfsOpts;
};

// eslint-disable-next-line import/no-unused-modules
export const IpfsContext = React.createContext<IpfsContextType>({
  node: null,
  isReady: false,
  error: null,
  isLoading: false,
});

export function useIpfs() {
  return useContext(IpfsContext);
}

function IpfsProvider({ children }: { children: React.ReactNode }) {
  const [ipfsInitError, setIpfsInitError] = useState<string | null>(null);
  const [isIpfsPending, setIsIpfsPending] = useState(false);
  const ipfsNode = useRef<CybIpfsNode | null>(null);

  const startConnectionIpfs = useCallback(async () => {
    setIsIpfsPending(true);
    setIpfsInitError(null);

    const ipfsOpts = getIpfsOpts();

    try {
      ipfsNode.current = await initIpfsNode(ipfsOpts);
    } catch (err) {
      setIpfsInitError(err instanceof Error ? err.message : (err as string));
    }
    setIsIpfsPending(false);
  }, []);

  useEffect(() => {
    startConnectionIpfs();

    return () => {
      (async () => {
        if (ipfsNode.current) {
          ipfsNode.current.stop();
          ipfsNode.current = null;
        }
      })();
    };
  }, [startConnectionIpfs]);

  useEffect(() => {
    const handlerEventListener = () => {
      startConnectionIpfs();
    };
    document.addEventListener('reconnectIpfsClient', handlerEventListener);
    return () => {
      document.removeEventListener('reconnectIpfsClient', handlerEventListener);
    };
  }, [startConnectionIpfs]);

  return (
    <IpfsContext.Provider
      value={useMemo(
        () =>
          ({
            node: ipfsNode.current,
            isReady: ipfsNode.current !== null,
            error: ipfsInitError,
            isLoading: isIpfsPending,
          } as IpfsContextType),
        [ipfsInitError, isIpfsPending]
      )}
    >
      {children}
    </IpfsContext.Provider>
  );
}

export default IpfsProvider;

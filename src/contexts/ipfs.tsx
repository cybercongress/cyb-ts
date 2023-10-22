import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CybIpfsNode, IpfsNodeType } from 'src/services/ipfs/ipfs';
import { useBackend } from './backend';
import { getIpfsOpts } from 'src/services/ipfs/config';

type IpfsContextType = {
  node: null | CybIpfsNode;
  isReady: boolean;
  error: null | string;
  isLoading: boolean;
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
  // const ipfsNode = useRef<CybIpfsNode | null>(null);
  const { isIpfsInitialized, loadIpfs, ipfsError, ipfsNode } = useBackend();

  useEffect(() => {
    setIpfsInitError(ipfsError);
  }, [ipfsError]);

  const startConnectionIpfs = useCallback(async () => {
    setIsIpfsPending(true);
    setIpfsInitError(null);

    const ipfsOpts = getIpfsOpts();

    try {
      await loadIpfs(ipfsOpts);
    } catch (err) {
      setIpfsInitError(err instanceof Error ? err.message : (err as string));
    }
    setIsIpfsPending(false);
  }, []);

  useEffect(() => {
    startConnectionIpfs();

    // return () => {
    //   (async () => {
    //     if (ipfsNode.current) {
    //       ipfsNode.current.stop();
    //       ipfsNode.current = null;
    //     }
    //   })();
    // };
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
            node: ipfsNode,
            isReady: isIpfsInitialized,
            error: ipfsInitError,
            isLoading: isIpfsPending,
          } as IpfsContextType),
        [ipfsInitError, isIpfsPending, ipfsNode]
      )}
    >
      {children}
    </IpfsContext.Provider>
  );
}

export default IpfsProvider;

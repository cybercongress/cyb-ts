import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppIPFS, IpfsOptsType } from 'src/utils/ipfs/ipfs';

import { destroyIpfsClient, ipfsClientFactory } from '../utils/ipfs/init';

let ipfs: AppIPFS | undefined | null;

const getOpts = () => {
  let ipfsOpts: IpfsOptsType = {
    ipfsNodeType: 'embedded',
    urlOpts: '/ip4/127.0.0.1/tcp/5001',
  };

  // get type ipfs
  const lsTypeIpfs = localStorage.getItem('ipfsState');
  if (lsTypeIpfs !== null) {
    const lsTypeIpfsData = JSON.parse(lsTypeIpfs);
    ipfsOpts = { ...ipfsOpts, ...lsTypeIpfsData };
  }

  // localStorage.setItem('ipfsState', JSON.stringify(ipfsOpts));

  return { ipfsOpts };
};

type IpfsContextType = {
  node: null | AppIPFS;
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
  const startConnectionIpfs = useCallback(async () => {
    setIsIpfsPending(true);
    setIpfsInitError(null);

    const { ipfsOpts } = getOpts();

    try {
      ipfs = await ipfsClientFactory(ipfsOpts);
    } catch (err) {
      setIpfsInitError(err instanceof Error ? err.message : (err as string));
    }
    setIsIpfsPending(false);
  }, []);

  useEffect(() => {
    startConnectionIpfs();

    return () => {
      (async () => {
        await destroyIpfsClient();
        ipfs = null;
      })();
    };
  }, [startConnectionIpfs]);

  useEffect(() => {
    const handlerEventListener = async () => {
      await destroyIpfsClient();
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            node: ipfs,
            isReady: !!ipfs,
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

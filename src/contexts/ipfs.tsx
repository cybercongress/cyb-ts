import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IPFS } from 'kubo-rpc-client/dist/src/types';
import { destroyIpfsClient, initIpfsClient } from '../utils/ipfs/init';

let ipfs = null;

const getOpts = () => {
  let ipfsOpts = {
    ipfsNodeType: 'embedded', // external || embedded
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

  return { ipfsOpts };
};

type IpfsContextType = {
  ipfs: null | IPFS;
  node: null | IPFS;
  isReady: boolean;
  error: null | string;
  isLoading: boolean;
};

// eslint-disable-next-line import/no-unused-modules
export const IpfsContext = React.createContext<IpfsContextType>({
  ipfs: null,
  node: null,
  isReady: false,
  error: null,
  isLoading: false,
});

function IpfsProvider({ children }: { children: React.ReactNode }) {
  const [ipfsInitError, setIpfsInitError] = useState<string | null>(null);
  const [isIpfsPending, setIsIpfsPending] = useState(false);

  const startConnectionIpfs = useCallback(async () => {
    setIsIpfsPending(true);
    setIpfsInitError(null);

    const { ipfsOpts } = getOpts();

    try {
      ipfs = await initIpfsClient(ipfsOpts);
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
    const handlerEventListener = () => {
      startConnectionIpfs();
    };

    document.addEventListener('reconnectIpfsClient', handlerEventListener);
    return () => {
      document.removeEventListener('reconnectIpfsClient', handlerEventListener);
    };
  }, [startConnectionIpfs]);

  console.log({
    ipfs,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    node: ipfs,
    isReady: !ipfs,
    error: ipfsInitError,
    isLoading: isIpfsPending,
  });

  return (
    <IpfsContext.Provider
      value={useMemo(
        () =>
          ({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            node: ipfs,
            isReady: !ipfs,
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

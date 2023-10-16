import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { proxy, Remote } from 'comlink';
import { backendApi } from 'src/services/backend/workers/background/service';

import BcChannel from 'src/services/backend/channels/BroadcastChannel';
import dbApiService from 'src/services/backend/workers/db/service';
import { CYBER } from 'src/utils/config';

import { IpfsOptsType, getIpfsOpts } from './ipfs';
import { CybIpfsNode } from 'src/services/ipfs/ipfs';

type BackendProviderContextType = {
  startSyncTask?: () => void;
  dbApi?: typeof dbApiService;
  backendApi?: typeof backendApi;
  ipfsNode?: Remote<CybIpfsNode> | null;
  loadIpfs: (ipfsOpts: IpfsOptsType) => Promise<void>;
  ipfsError: string | null;
};

const valueContext = {
  startSyncTask: undefined,
  backendApi: undefined,
};

const BackendContext =
  React.createContext<BackendProviderContextType>(valueContext);

export function useBackend() {
  return useContext(BackendContext);
}

function BackendProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { defaultAccount } = useAppSelector((state) => state.pocket);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isIpfsInitialized, setIsIpfsInitialized] = useState(false);
  const [ipfsError, setIpfsError] = useState(null);
  const ipfsNode = useRef<Remote<CybIpfsNode> | null>(null);

  const useGetAddress = defaultAccount?.account?.cyber?.bech32 || null;

  const channelRef = useRef<BcChannel>();

  useEffect(() => {
    (async () => {
      console.log(
        process.env.IS_DEV
          ? '🧪 Starting backend in DEV mode...'
          : '🧬 Starting backend in PROD mode...'
      );

      await dbApiService
        .init()
        .then(() => console.log('🔋 CozoDb worker started.', dbApiService));

      console.log('Loading backend worker...');

      await backendApi
        .init(proxy(dbApiService))
        .then(() => console.log('🔋 Background worker started.'));

      const ipfsOpts = getIpfsOpts();

      await loadIpfs(ipfsOpts);

      setIsInitialized(true);
    })();

    // Channel to sync worker's state with redux store
    channelRef.current = new BcChannel((msg) => dispatch(msg.data));
  }, [dispatch]);

  const loadIpfs = async (ipfsOpts: IpfsOptsType) => {
    setIsIpfsInitialized(false);
    await backendApi
      .startIpfs(ipfsOpts)
      .then((ipfsNodeRemote) => {
        ipfsNode.current = ipfsNodeRemote;
        setIsIpfsInitialized(true);
        setIpfsError(null);
        console.log('🔋 Ipfs started.');
      })
      .catch((err) => {
        ipfsNode.current = null;
        setIpfsError(err);
        console.log(`☠️ Ipfs error: ${err}`);
      });
  };

  console.log('--------ipfs backend', ipfsNode, ipfsError, isIpfsInitialized);

  const valueMemo = useMemo(
    () => ({
      startSyncTask: async () =>
        backendApi.syncDrive(useGetAddress, CYBER.CYBER_INDEX_HTTPS),
      backendApi: isInitialized ? backendApi : undefined,
      dbApi: isInitialized ? dbApiService : undefined,
      ipfsNode: isIpfsInitialized ? ipfsNode.current : undefined,
      loadIpfs,
      ipfsError,
    }),
    [useGetAddress, isInitialized, isIpfsInitialized, ipfsError]
  );

  return (
    <BackendContext.Provider value={valueMemo}>
      {children}
    </BackendContext.Provider>
  );
}

export default BackendProvider;

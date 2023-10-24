import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { proxy, Remote } from 'comlink';
import { backendApi } from 'src/services/backend/workers/background/service';

import BcChannel from 'src/services/backend/channels/BroadcastChannel';
import dbApiService from 'src/services/backend/workers/db/service';
import { CYBER } from 'src/utils/config';

import { CybIpfsNode, IpfsOptsType } from 'src/services/ipfs/ipfs';
import { getIpfsOpts } from 'src/services/ipfs/config';

type BackendProviderContextType = {
  startSyncTask?: () => void;
  dbApi?: typeof dbApiService;
  backendApi?: typeof backendApi;
  ipfsNode?: Remote<CybIpfsNode> | null;
  ipfsError: string | null;
  loadIpfs: () => Promise<void>;
  isIpfsInitialized: boolean;
  isDbInitialized: boolean;
  isReady: boolean;
};

const valueContext = {
  startSyncTask: undefined,
  backendApi: undefined,
};

const setupStoragePersistence = async () => {
  let isPersistedStorage = await navigator.storage.persisted();
  if (!isPersistedStorage) {
    await navigator.permissions.query({ name: 'persistent-storage' });
    isPersistedStorage = await navigator.storage.persisted();
  }
  const message = isPersistedStorage
    ? `🔰 Storage is persistent.`
    : `⚠️ Storage is non-persitent.`;
  console.log(message);
  return isPersistedStorage;
};

const BackendContext =
  React.createContext<BackendProviderContextType>(valueContext);

export function useBackend() {
  return useContext(BackendContext);
}

function BackendProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { defaultAccount } = useAppSelector((state) => state.pocket);
  const [isBackgroundInitialized, setBackgroundIsInitialized] = useState(false);
  const [isIpfsInitialized, setIsIpfsInitialized] = useState(false);
  const [isDbInitialized, setIsDbItialized] = useState(false);
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

      await setupStoragePersistence();

      const installDbApi = async () => {
        setIsDbItialized(false);
        dbApiService
          .init()
          .then(() => console.log('🔋 CozoDb worker started.', dbApiService));
        setIsDbItialized(true);
      };
      await Promise.all([loadIpfs(), installDbApi()]);

      await backendApi
        .installDbApi(proxy(dbApiService))
        .then(() => console.log('🔋 Background worker started.'));

      setBackgroundIsInitialized(true);
    })();

    // Channel to sync worker's state with redux store
    channelRef.current = new BcChannel((msg) => dispatch(msg.data));
  }, [dispatch]);

  const loadIpfs = async () => {
    setIsIpfsInitialized(false);

    const ipfsOpts = getIpfsOpts();
    await backendApi.ipfsApi.stop();
    await backendApi.ipfsApi
      .start(ipfsOpts)
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

  const valueMemo = useMemo(
    () => ({
      startSyncTask: async () =>
        backendApi.syncDrive(useGetAddress, CYBER.CYBER_INDEX_HTTPS),
      backendApi,
      dbApi: isDbInitialized ? dbApiService : undefined,
      isIpfsInitialized,
      isDbInitialized,
      ipfsNode: isIpfsInitialized ? ipfsNode.current : null,
      loadIpfs,
      ipfsError,
      isReady: isDbInitialized && isIpfsInitialized,
    }),
    [useGetAddress, isIpfsInitialized, isDbInitialized, ipfsError]
  );

  return (
    <BackendContext.Provider value={valueMemo}>
      {children}
    </BackendContext.Provider>
  );
}

export default BackendProvider;

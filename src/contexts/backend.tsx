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
  const [isIpfsInitialized, setIsIpfsInitialized] = useState(false);
  const [isDbInitialized, setIsDbItialized] = useState(false);
  const [ipfsError, setIpfsError] = useState(null);
  const ipfsNode = useRef<Remote<CybIpfsNode> | null>(null);
  const dbStatus = useAppSelector((state) => state.backend.services.db);
  const ipfsStatus = useAppSelector((state) => state.backend.services.ipfs);

  const useGetAddress = defaultAccount?.account?.cyber?.bech32 || null;

  const channelRef = useRef<BcChannel>();

  useEffect(() => {
    setIsDbItialized(dbStatus.status === 'started');
    (async () => {
      await backendApi.installDbApi(proxy(dbApiService));
    })();
  }, [dbStatus]);

  // useEffect(() => {
  //   // setIsIpfsInitialized(ipfsStatus.status === 'started');
  //   // attach db api to backend api

  // }, [ipfsStatus]);

  useEffect(() => {
    if (isDbInitialized && isIpfsInitialized) {
      console.log('🟢 Backend started.');
    }
  }, [isIpfsInitialized, isDbInitialized]);

  useEffect(() => {
    (async () => {
      console.log(
        process.env.IS_DEV
          ? '🧪 Starting backend in DEV mode...'
          : '🧬 Starting backend in PROD mode...'
      );
      await setupStoragePersistence();

      // Loading non-blocking, when ready  state.backend.services.* should be changef
      loadIpfs();
      initDbApi();
    })();

    // Channel to sync worker's state with redux store
    channelRef.current = new BcChannel((msg) => dispatch(msg.data));
  }, [dispatch]);

  const initDbApi = async () => {
    console.time('🔋 CozoDb worker started.');
    await dbApiService
      .init()
      .then(() => console.timeEnd('🔋 CozoDb worker started.'));
  };

  const loadIpfs = async () => {
    const ipfsOpts = getIpfsOpts();
    setIsIpfsInitialized(false);
    await backendApi.ipfsApi.stop();
    console.time('🔋 Ipfs started.');
    await backendApi.ipfsApi
      .start(ipfsOpts)
      .then((ipfsNodeRemote) => {
        ipfsNode.current = ipfsNodeRemote;
        setIpfsError(null);
        console.timeEnd('🔋 Ipfs started.');
        setIsIpfsInitialized(true);
      })
      .catch((err) => {
        ipfsNode.current = null;
        setIpfsError(err);
        console.log(`☠️ Ipfs error: ${err}`);
        setIsIpfsInitialized(false);
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

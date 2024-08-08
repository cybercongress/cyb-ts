import { invoke } from '@tauri-apps/api/tauri';
import { proxy, Remote } from 'comlink';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import RxBroadcastChannelListener from 'src/services/backend/channels/RxBroadcastChannelListener';
import { backgroundWorkerInstance } from 'src/services/backend/workers/background/service';
import { cozoDbWorkerInstance } from 'src/services/backend/workers/db/service';

import { selectCurrentAddress } from 'src/redux/features/pocket';
import DbApiWrapper from 'src/services/backend/services/DbApi/DbApi';
import { BackgroundWorker } from 'src/services/backend/workers/background/worker';
import { CozoDbWorker } from 'src/services/backend/workers/db/worker';
import { getIpfsOpts } from 'src/services/ipfs/config';

import { RESET_SYNC_STATE_ACTION_NAME } from 'src/redux/reducers/backend';
import { DB_NAME } from 'src/services/CozoDb/cozoDb';
// import BroadcastChannelListener from 'src/services/backend/channels/BroadcastChannelListener';

import { Observable } from 'rxjs';
import { EmbeddingApi } from 'src/services/backend/workers/background/api/mlApi';
import { RuneEngine } from 'src/services/scripting/engine';
import { Option } from 'src/types';
import { createSenseApi, SenseApi } from './services/senseApi';

const setupStoragePersistence = async () => {
  let isPersistedStorage: boolean;
  try {
    isPersistedStorage = await navigator.storage.persisted();
    if (!isPersistedStorage) {
      await navigator.permissions.query({ name: 'persistent-storage' });
      isPersistedStorage = true;
    }
  } catch (error) {
    console.log('[Backend] failed to get persistence status', error);
    isPersistedStorage = false;
  }

  console.log('[Backend] isPersistedStorage', isPersistedStorage);

  const message = isPersistedStorage
    ? `🔰 storage is persistent`
    : `⚠️ storage is non-persitent`;

  console.log(message);

  return isPersistedStorage;
};

type BackendProviderContextType = {
  cozoDbRemote: Remote<CozoDbWorker> | null;
  senseApi: SenseApi;
  ipfsApi: Remote<BackgroundWorker['ipfsApi']> | null;
  dbApi: DbApiWrapper | null;
  ipfsError?: string | null;
  isIpfsInitialized: boolean;
  isDbInitialized: boolean;
  isSyncInitialized: boolean;
  isReady: boolean;
  embeddingApi$: Promise<Observable<EmbeddingApi>>;
  rune: Remote<RuneEngine>;
};

const valueContext = {
  cozoDbRemote: null,
  senseApi: null,
  isIpfsInitialized: false,
  isDbInitialized: false,
  isSyncInitialized: false,
  isReady: false,
  dbApi: null,
  ipfsApi: null,
};

const BackendContext =
  React.createContext<BackendProviderContextType>(valueContext);

export function useBackend() {
  return useContext(BackendContext);
}

window.cyb.db = {
  clear: () => indexedDB.deleteDatabase(DB_NAME),
};

function BackendProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  // const { defaultAccount } = useAppSelector((state) => state.pocket);

  const [ipfsError, setIpfsError] = useState(null);

  const isDbInitialized = useAppSelector(
    (state) => state.backend.services.db.status === 'started'
  );
  const isIpfsInitialized = useAppSelector(
    (state) => state.backend.services.ipfs.status === 'started'
  );
  const isSyncInitialized = useAppSelector(
    (state) => state.backend.services.sync.status === 'started'
  );
  const [needPFSInitialize, setNeedPFSInitialize] = useState(
    !!process.env.IS_TAURI
  );

  const myAddress = useAppSelector(selectCurrentAddress);

  const { friends, following } = useAppSelector(
    (state) => state.backend.community
  );

  // // TODO: preload from DB
  const followings = useMemo(() => {
    return Array.from(new Set([...friends, ...following]));
  }, [friends, following]);

  const isReady =
    isDbInitialized &&
    isIpfsInitialized &&
    isSyncInitialized &&
    !needPFSInitialize;
  const [embeddingApi$, setEmbeddingApi] =
    useState<Option<Observable<EmbeddingApi>>>(undefined);
  // const embeddingApiRef = useRef<Observable<EmbeddingApi>>();
  useEffect(() => {
    console.log(
      process.env.IS_DEV
        ? '🧪 Starting backend in DEV mode...'
        : '🧬 Starting backend in PROD mode...'
    );

    (async () => {
      // embeddingApiRef.current = await backgroundWorkerInstance.embeddingApi$;
      const embeddingApiInstance$ =
        await backgroundWorkerInstance.embeddingApi$;
      setEmbeddingApi(embeddingApiInstance$);
    })();

    setupStoragePersistence();

    const channel = new RxBroadcastChannelListener(dispatch);

    backgroundWorkerInstance.ipfsApi
      .start(getIpfsOpts())
      .then(() => {
        setIpfsError(null);
      })
      .catch((err) => {
        setIpfsError(err);
        console.log(`☠️ Ipfs error: ${err}`);
      });

    cozoDbWorkerInstance.init().then(() => {
      // const dbApi = createDbApi();
      const dbApi = new DbApiWrapper();

      dbApi.init(proxy(cozoDbWorkerInstance));
      setDbApi(dbApi);
      // pass dbApi into background worker
      return backgroundWorkerInstance.injectDb(proxy(dbApi));
    });
  }, []);

  useEffect(() => {
    backgroundWorkerInstance.setParams({ myAddress });
    dispatch({ type: RESET_SYNC_STATE_ACTION_NAME });
  }, [myAddress, dispatch]);

  useEffect(() => {
    isReady && console.log('🟢 backend started!');
  }, [isReady]);

  useEffect(() => {
    if (process.env.IS_TAURI) {
      console.log('[Backend] need initialize IPFS for TAURI env');
      (async () => {
        try {
          const isIPFSRunning = await invoke('is_ipfs_running');

          if (isIPFSRunning) {
            setNeedPFSInitialize(false);
            console.log('[Backend] IPFS is already running');
            return;
          }

          console.log('[Backend] check if IPFS binary is downloaded');
          const ipfsExists = await invoke('check_ipfs');
          if (!ipfsExists) {
            await invoke('download_and_extract_ipfs');
            console.log('[Backend] IPFS downloaded successfully');
          }

          console.log('[Backend] check if IPFS is initialized');
          const ipfsInitialized = await invoke('is_ipfs_initialized');
          if (!ipfsInitialized) {
            await invoke('init_ipfs');
            console.log('[Backend] IPFS is initialized successfully');
          }

          console.log('[Backend] start IPFS...');
          await invoke('start_ipfs');
          console.log('[Backend] IPFS is successfully started');
        } catch (error) {
          console.error('Failed to run kubo IPFS', error);
        }
      })();
    }
  }, []);

  const [dbApi, setDbApi] = useState<DbApiWrapper | null>(null);

  const senseApi = useMemo(() => {
    if (isDbInitialized && dbApi && myAddress) {
      return createSenseApi(dbApi, myAddress, followings);
    }
    return null;
  }, [isDbInitialized, dbApi, myAddress, followings]);

  useEffect(() => {
    (async () => {
      backgroundWorkerInstance.setRuneDeps({
        address: myAddress,
        // TODO: proxify particular methods
        // senseApi: senseApi ? proxy(senseApi) : undefined,
        // signingClient: signingClient ? proxy(signingClient) : undefined,
      });
    })();
  }, [myAddress]);

  const ipfsApi = useMemo(
    () => (isIpfsInitialized ? backgroundWorkerInstance.ipfsApi : null),
    [isIpfsInitialized]
  );

  const valueMemo = useMemo(
    () =>
      ({
        rune: backgroundWorkerInstance.rune,
        embeddingApi$: backgroundWorkerInstance.embeddingApi$,
        cozoDbRemote: cozoDbWorkerInstance,
        ipfsApi,
        dbApi,
        senseApi,
        ipfsError,
        isIpfsInitialized,
        isDbInitialized,
        isSyncInitialized,
        isReady,
      } as BackendProviderContextType),
    [
      isReady,
      isIpfsInitialized,
      isDbInitialized,
      isSyncInitialized,
      ipfsError,
      senseApi,
      dbApi,
      ipfsApi,
    ]
  );

  return (
    <BackendContext.Provider value={valueMemo}>
      {children}
    </BackendContext.Provider>
  );
}

export default BackendProvider;

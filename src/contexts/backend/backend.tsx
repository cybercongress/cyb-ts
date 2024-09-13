import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { proxy, Remote } from 'comlink';
import { backgroundWorkerInstance } from 'src/services/backend/workers/background/service';
import { cozoDbWorkerInstance } from 'src/services/backend/workers/db/service';
import RxBroadcastChannelListener from 'src/services/backend/channels/RxBroadcastChannelListener';

import { CybIpfsNode } from 'src/services/ipfs/types';
import { getIpfsOpts } from 'src/services/ipfs/config';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import DbApiWrapper from 'src/services/backend/services/DbApi/DbApi';
import { CozoDbWorker } from 'src/services/backend/workers/db/worker';

import { DB_NAME } from 'src/services/CozoDb/cozoDb';
import { RESET_SYNC_STATE_ACTION_NAME } from 'src/redux/reducers/backend';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
// import BroadcastChannelListener from 'src/services/backend/channels/BroadcastChannelListener';

import { EmbeddingApi } from 'src/services/backend/workers/background/api/mlApi';
import { RuneEngine } from 'src/services/scripting/engine';
import {
  createP2PApi,
  P2PApi,
} from 'src/services/backend/workers/background/api/p2p/p2pApi';
import createIpfsApi, {
  IpfsApi,
} from 'src/services/backend/workers/background/api/ipfsApi';
import SyncIpfsService from 'src/services/backend/services/sync/services/p2p/SyncIpfsService';
import { SenseApi, createSenseApi } from './services/senseApi';
import { useBackendServiceLoaded, useFollowings } from './hooks';

const setupStoragePersistence = async () => {
  let isPersistedStorage = await navigator.storage.persisted();
  if (!isPersistedStorage) {
    await navigator.permissions.query({ name: 'persistent-storage' });
    isPersistedStorage = await navigator.storage.persisted();
  }
  const message = isPersistedStorage
    ? `🔰 storage is persistent`
    : `⚠️ storage is non-persitent`;

  console.log(message);

  return isPersistedStorage;
};

type BackendProviderContextType = {
  cozoDbRemote: Remote<CozoDbWorker> | null;
  senseApi: SenseApi;
  ipfsApi: IpfsApi | null;
  p2pApi: P2PApi | null;
  dbApi: DbApiWrapper | null;
  ipfsError?: string | null;
  isIpfsInitialized: boolean;
  isDbInitialized: boolean;
  isSyncInitialized: boolean;
  isReady: boolean;
  getEmbeddingApi: Remote<() => Promise<EmbeddingApi>>;
  rune: Remote<RuneEngine>;
  p2pSyncService: SyncIpfsService;
};

const valueContext = {
  cozoDbRemote: {} as Remote<CozoDbWorker>,
  senseApi: {} as SenseApi,
  isIpfsInitialized: false,
  isDbInitialized: false,
  isSyncInitialized: false,
  isReady: false,
  dbApi: {} as DbApiWrapper,
  ipfsApi: {} as IpfsApi,
  p2pApi: {} as P2PApi,
  rune: {} as RuneEngine,
  p2pSyncService: {} as SyncIpfsService,
  getEmbeddingApi: null,
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

  const isDbInitialized = useBackendServiceLoaded('db');
  const isIpfsInitialized = useBackendServiceLoaded('ipfs');
  const isSyncInitialized = useBackendServiceLoaded('sync');
  const isReady = isDbInitialized && isIpfsInitialized && isSyncInitialized;

  const myAddress = useAppSelector(selectCurrentAddress);

  const followings = useFollowings();

  const broadcastApi = useMemo(() => new BroadcastChannelSender(), []);

  const { api: p2pApi } = useMemo(
    () => createP2PApi(broadcastApi),
    [broadcastApi]
  );

  const { ipfsInstance$, api: ipfsApi } = useMemo(
    () => createIpfsApi(p2pApi, broadcastApi),
    [p2pApi, broadcastApi]
  );

  const p2pSyncService = useMemo(
    () => new SyncIpfsService(ipfsApi, p2pApi),
    [ipfsApi, p2pApi]
  );

  useEffect(() => {
    backgroundWorkerInstance.injectIpfsApi(proxy(ipfsApi));

    ipfsInstance$.subscribe((node: CybIpfsNode | undefined) => {
      if (node) {
        backgroundWorkerInstance.injectIpfsNode(proxy(node));
      }
    });
  }, [ipfsApi, ipfsInstance$]);

  useEffect(() => {
    console.log(
      process.env.IS_DEV
        ? '🧪 Starting backend in DEV mode...'
        : '🧬 Starting backend in PROD mode...'
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const channel = new RxBroadcastChannelListener(dispatch);

    getIpfsOpts().then((ipfsOpts) => {
      ipfsApi
        .start(ipfsOpts)
        .then(() => {
          setIpfsError(null);
        })
        .catch((err) => {
          setIpfsError(err);
          console.log(`☠️ Ipfs error: ${err}`);
        });
    });

    cozoDbWorkerInstance.init().then(() => {
      // const dbApi = createDbApi();
      const dbApi = new DbApiWrapper(proxy(cozoDbWorkerInstance));
      setDbApi(dbApi);
      // pass dbApi into background worker
      return backgroundWorkerInstance.injectDb(proxy(dbApi));
    });
  }, []);

  useEffect(() => {
    backgroundWorkerInstance.setParams({ myAddress });
    backgroundWorkerInstance.setRuneDeps({
      address: myAddress,
    });
    dispatch({ type: RESET_SYNC_STATE_ACTION_NAME });
  }, [myAddress, dispatch]);

  useEffect(() => {
    isReady && console.log('🟢 backend started!');
  }, [isReady]);

  const [dbApi, setDbApi] = useState<DbApiWrapper | null>(null);

  const senseApi = useMemo(() => {
    if (isDbInitialized && dbApi && myAddress) {
      return createSenseApi(dbApi, myAddress, followings);
    }
    return null;
  }, [isDbInitialized, dbApi, myAddress, followings]);

  // useEffect(() => {
  //   (async () => {
  //     backgroundWorkerInstance.setRuneDeps({
  //       address: myAddress,
  //     });
  //   })();
  // }, [myAddress]);

  const valueMemo = useMemo(
    () =>
      ({
        rune: backgroundWorkerInstance.rune,
        getEmbeddingApi: backgroundWorkerInstance.getEmbeddingApi,
        cozoDbRemote: cozoDbWorkerInstance,
        ipfsApi,
        p2pApi,
        dbApi,
        senseApi,
        ipfsError,
        isIpfsInitialized,
        isDbInitialized,
        isSyncInitialized,
        isReady,
        p2pSyncService,
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
      p2pApi,
      p2pSyncService,
    ]
  );

  return (
    <BackendContext.Provider value={valueMemo}>
      {children}
    </BackendContext.Provider>
  );
}

export default BackendProvider;

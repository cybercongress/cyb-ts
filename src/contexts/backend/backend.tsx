import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { proxy, ProxyMarked, Remote } from 'comlink';
import { backgroundWorkerInstance } from 'src/services/backend/workers/background/service';
import { cozoDbWorkerInstance } from 'src/services/backend/workers/db/service';
import RxBroadcastChannelListener from 'src/services/backend/channels/RxBroadcastChannelListener';

import { CybIpfsNode } from 'src/services/ipfs/types';
import { getIpfsOpts } from 'src/services/ipfs/config';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import DbApiWrapper from 'src/services/backend/services/DbApi/DbApi';
import { CozoDbWorker } from 'src/services/backend/workers/db/worker';
import { BackgroundWorker } from 'src/services/backend/workers/background/worker';

import { SyncEntryName } from 'src/services/backend/types/services';
import { DB_NAME } from 'src/services/CozoDb/cozoDb';
import { RESET_SYNC_STATE_ACTION_NAME } from 'src/redux/reducers/backend';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
// import BroadcastChannelListener from 'src/services/backend/channels/BroadcastChannelListener';

import { Observable, Observer } from 'rxjs';
import { EmbeddingApi } from 'src/services/backend/workers/background/api/mlApi';
import { SenseApi, createSenseApi } from './services/senseApi';
import { selectCurrentPassport } from 'src/features/passport/passports.redux';
import {
  selectRuneEntypoints,
  setEntrypoint,
} from 'src/redux/reducers/scripting';
import { UserContext } from 'src/services/scripting/types';
import { RuneEngine } from 'src/services/scripting/engine';

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

type BackendProviderContextType = {
  cozoDbRemote: Remote<CozoDbWorker> | null;
  senseApi: SenseApi;
  ipfsApi: Remote<BackgroundWorker['ipfsApi']> | null;
  dbApi: DbApiWrapper | null;
  ipfsNode?: Remote<CybIpfsNode> | null;
  ipfsError?: string | null;
  loadIpfs?: () => Promise<void>;
  restartSync?: (name: SyncEntryName) => void;
  isIpfsInitialized: boolean;
  isDbInitialized: boolean;
  isSyncInitialized: boolean;
  isReady: boolean;
  embeddingApi$: Observable<EmbeddingApi>;
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

// const dbApi = new DbApiWrapper();
const bcSender = new BroadcastChannelSender();

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

  const myAddress = useAppSelector(selectCurrentAddress);

  const { friends, following } = useAppSelector(
    (state) => state.backend.community
  );

  // // TODO: preload from DB
  const followings = useMemo(() => {
    return Array.from(new Set([...friends, ...following]));
  }, [friends, following]);

  const isReady = isDbInitialized && isIpfsInitialized && isSyncInitialized;

  const embeddingApiRef = useRef<Observable<EmbeddingApi>>();

  useEffect(() => {
    (async () => {
      embeddingApiRef.current = await backgroundWorkerInstance.embeddingApi$;
    })();
  }, []);

  useEffect(() => {
    backgroundWorkerInstance.setParams({ myAddress });
    dispatch({ type: RESET_SYNC_STATE_ACTION_NAME });
  }, [myAddress, dispatch]);

  useEffect(() => {
    isReady && console.log('🟢 Backend started.');
  }, [isReady]);

  const [dbApi, setDbApi] = useState<DbApiWrapper | null>(null);

  const senseApi = useMemo(() => {
    if (isDbInitialized && dbApi && myAddress) {
      return createSenseApi(dbApi, myAddress, followings);
    }
    return null;
  }, [isDbInitialized, dbApi, myAddress, followings]);

  const createDbApi = useCallback(() => {
    const dbApi = new DbApiWrapper();

    dbApi.init(proxy(cozoDbWorkerInstance));
    setDbApi(dbApi);
    return dbApi;
  }, []);

  const loadIpfs = async () => {
    const ipfsOpts = getIpfsOpts();
    await backgroundWorkerInstance.ipfsApi.stop();
    console.time('🔋 Ipfs started.');

    await backgroundWorkerInstance.ipfsApi
      .start(ipfsOpts)
      .then(() => {
        setIpfsError(null);
        console.timeEnd('🔋 Ipfs started.');
      })
      .catch((err) => {
        setIpfsError(err);
        console.log(`☠️ Ipfs error: ${err}`);
      });
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const channel = new BroadcastChannelListener((msg) => {
    // console.log('--------msg.data', msg.data);
    //   dispatch(msg.data);
    // });
    const channel = new RxBroadcastChannelListener(dispatch);

    const loadCozoDb = async () => {
      console.time('🔋 CozoDb worker started.');
      await cozoDbWorkerInstance
        .init()
        .then(async () => {
          const dbApi = createDbApi();
          // pass dbApi into background worker
          await backgroundWorkerInstance.injectDb(proxy(dbApi));
        })
        .then(() => console.timeEnd('🔋 CozoDb worker started.'));
    };

    (async () => {
      console.log(
        process.env.IS_DEV
          ? '🧪 Starting backend in DEV mode...'
          : '🧬 Starting backend in PROD mode...'
      );
      await setupStoragePersistence();

      const ipfsLoadPromise = async () => {
        const isInitialized = await backgroundWorkerInstance.isInitialized();
        if (isInitialized) {
          console.log('🔋 Background worker already active.');
          bcSender.postServiceStatus('ipfs', 'started');
          bcSender.postServiceStatus('sync', 'started');
          return Promise.resolve();
        }
        return loadIpfs();
      };

      const cozoDbLoadPromise = async () => {
        const isInitialized = await cozoDbWorkerInstance.isInitialized();
        if (isInitialized) {
          console.log('🔋 CozoDb worker already active.');
          bcSender.postServiceStatus('db', 'started');
          createDbApi();
          return Promise.resolve();
        }
        return loadCozoDb();
      };

      // Loading non-blocking, when ready  state.backend.services.* should be changef
      Promise.all([ipfsLoadPromise(), cozoDbLoadPromise()]);
    })();

    window.q = backgroundWorkerInstance.ipfsQueue;
    return () => channel.close();
  }, [dispatch, createDbApi]);

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

  const ipfsNode = useMemo(
    () =>
      isIpfsInitialized ? backgroundWorkerInstance.ipfsApi.getIpfsNode() : null,
    [isIpfsInitialized]
  );

  const valueMemo = useMemo(
    () =>
      ({
        // backgroundWorker: backgroundWorkerInstance,
        rune: backgroundWorkerInstance.rune,
        embeddingApi$: embeddingApiRef.current,
        cozoDbRemote: cozoDbWorkerInstance,
        ipfsApi,
        ipfsNode,
        restartSync: (name: SyncEntryName) =>
          backgroundWorkerInstance.restartSync(name),
        dbApi,
        senseApi,
        loadIpfs,
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
      ipfsNode,
    ]
  );

  return (
    <BackendContext.Provider value={valueMemo}>
      {children}
    </BackendContext.Provider>
  );
}

export default BackendProvider;

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
import { BackgroundWorker } from 'src/services/backend/workers/background/worker';

import { SyncEntryName } from 'src/services/backend/types/services';
import { DB_NAME } from 'src/services/CozoDb/cozoDb';
import { RESET_SYNC_STATE_ACTION_NAME } from 'src/redux/reducers/backend';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
// import BroadcastChannelListener from 'src/services/backend/channels/BroadcastChannelListener';

import { selectCurrentPassport } from 'src/features/passport/passports.redux';
import {
  selectRuneEntypoints,
  setContext,
  setEntrypoint,
} from 'src/redux/reducers/scripting';
import { RuneEngine } from 'src/services/scripting/engine';
import runeDeps from 'src/services/scripting/runeDeps';

import { SenseApi, createSenseApi } from './services/senseApi';
import { useSigningClient } from '../signerClient';
import { UserContext } from 'src/services/scripting/types';

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

type IpfsApiRemote = Remote<BackgroundWorker['ipfsApi']> | null;

type BackendProviderContextType = {
  cozoDbRemote: Remote<CozoDbWorker> | null;
  senseApi: SenseApi;
  mlApi: Remote<BackgroundWorker['mlApi']> | null;
  ipfsApi: IpfsApiRemote;
  defferedDbApi: Remote<BackgroundWorker['defferedDbApi']> | null;
  rune: Remote<RuneEngine> | null;
  dbApi: DbApiWrapper | null;
  ipfsNode?: Remote<CybIpfsNode> | null;
  ipfsError?: string | null;
  loadIpfs?: () => Promise<void>;
  restartSync?: (name: SyncEntryName) => void;
  isIpfsInitialized: boolean;
  isDbInitialized: boolean;
  isSyncInitialized: boolean;
  isReady: boolean;
};

const valueContext = {
  cozoDbRemote: null,
  senseApi: null,
  defferedDbApi: null,
  rune: null,
  isIpfsInitialized: false,
  isDbInitialized: false,
  isSyncInitialized: false,
  isReady: false,
  dbApi: null,
  ipfsApi: null,
  mlApi: null,
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

  const isRuneInitialized = useAppSelector(
    (state) => state.backend.services.rune.status === 'started'
  );

  const isMlInitialized = useAppSelector(
    (state) => state.backend.services.ml.status === 'started'
  );

  const runeEntryPoints = useAppSelector(selectRuneEntypoints);

  const myAddress = useAppSelector(selectCurrentAddress);
  const citizenship = useAppSelector(selectCurrentPassport);

  const { friends, following } = useAppSelector(
    (state) => state.backend.community
  );

  const followings = useMemo(() => {
    return Array.from(new Set([...friends, ...following]));
  }, [friends, following]);

  const isReady = isDbInitialized && isIpfsInitialized && isSyncInitialized;

  useEffect(() => {
    backgroundWorkerInstance.setParams({ myAddress });
    dispatch({ type: RESET_SYNC_STATE_ACTION_NAME });
  }, [myAddress, dispatch]);

  useEffect(() => {
    if (citizenship) {
      const particleCid = citizenship.extension.particle;
      backgroundWorkerInstance.rune.pushContext('user', {
        address: citizenship.owner,
        nickname: citizenship.extension.nickname,
        citizenship,
        particle: particleCid,
      } as UserContext);
    } else {
      backgroundWorkerInstance.rune.popContext(['user', 'secrets']);
    }
  }, [citizenship]);

  useEffect(() => {
    if (citizenship) {
      const particleCid = citizenship.extension.particle;

      if (particleCid && isIpfsInitialized) {
        (async () => {
          const result =
            await backgroundWorkerInstance.ipfsApi.fetchWithDetails(
              particleCid,
              'text'
            );

          dispatch(
            setEntrypoint({ name: 'particle', code: result?.content || '' })
          );
        })();
      }
    }
  }, [citizenship, isRuneInitialized, isIpfsInitialized, dispatch]);

  useEffect(() => {
    backgroundWorkerInstance.rune.setEntrypoints(runeEntryPoints);
  }, [runeEntryPoints]);

  useEffect(() => {
    isReady && console.log('🟢 Backend started.');
  }, [isReady]);

  const [dbApi, setDbApi] = useState<DbApiWrapper | null>(null);

  const { signer, signingClient } = useSigningClient();

  const senseApi = useMemo(() => {
    if (isDbInitialized && dbApi && myAddress) {
      return createSenseApi(dbApi, myAddress, followings);
    }
    return null;
  }, [isDbInitialized, dbApi, myAddress, followings]);

  useEffect(() => {
    (async () => {
      runeDeps.setExternalDeps({
        senseApi: senseApi ? proxy(senseApi) : undefined,
        address: myAddress,
        signingClient: signingClient ? proxy(signingClient) : undefined,
      });
    })();
  }, [senseApi, signingClient, myAddress]);

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
          await backgroundWorkerInstance.init(proxy(dbApi), {
            entrypoints: runeEntryPoints,
            secrets: {},
          });
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

  const ipfsApi = useMemo(
    () => (isIpfsInitialized ? backgroundWorkerInstance.ipfsApi : null),
    [isIpfsInitialized]
  );

  const ipfsNode = useMemo(
    () =>
      isIpfsInitialized ? backgroundWorkerInstance.ipfsApi.getIpfsNode() : null,
    [isIpfsInitialized]
  );

  const rune = useMemo(
    () => (isRuneInitialized ? backgroundWorkerInstance.rune : null),
    [isRuneInitialized]
  );

  const mlApi = useMemo(
    () => (isMlInitialized ? backgroundWorkerInstance.mlApi : null),
    [isMlInitialized]
  );

  const defferedDbApi = useMemo(
    () => (isDbInitialized ? backgroundWorkerInstance.defferedDbApi : null),
    [isDbInitialized]
  );

  const valueMemo = useMemo(
    () =>
      ({
        // backgroundWorker: backgroundWorkerInstance,
        cozoDbRemote: cozoDbWorkerInstance,
        ipfsApi,
        mlApi,
        defferedDbApi,
        rune,
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
      mlApi,
      ipfsApi,
      ipfsNode,
      defferedDbApi,
      rune,
      loadIpfs,
    ]
  );

  return (
    <BackendContext.Provider value={valueMemo}>
      {children}
    </BackendContext.Provider>
  );
}

export default BackendProvider;

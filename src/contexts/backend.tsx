import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { proxy, Remote } from 'comlink';
import { backgroundWorkerProxy } from 'src/services/backend/workers/background/service';

import BroadcastChannelListener from 'src/services/backend/channels/BroadcastChannelListener';
import dbApiService, {
  DbApiService,
} from 'src/services/backend/workers/db/service';
import { CYBER } from 'src/utils/config';

import { CybIpfsNode } from 'src/services/ipfs/ipfs';
import { getIpfsOpts } from 'src/services/ipfs/config';
import { selectCurrentPassport } from 'src/features/passport/passports.redux';
import { selectFollowings } from 'src/redux/features/currentAccount';
import useCommunityPassports from 'src/features/passport/hooks/useCommunityPassports';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import DbApiInstance, {
  DbApi,
} from 'src/services/backend/services/dataSource/indexedDb/dbApiWrapper';
import { NeuronAddress, ParticleCid } from 'src/types/base';

const createSenseApi = (dbApi: DbApi) => ({
  getSummary: () => dbApi.getSenseSummary(),
  getList: () => dbApi.getSenseList(),
  markAsRead: (id: NeuronAddress | ParticleCid) => dbApi.senseMarkAsRead(id),
});

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
  dbApi: DbApiService | null;
  senseApi: ReturnType<typeof createSenseApi> | null;
  backendApi: typeof backgroundWorkerProxy | null;
  ipfsNode?: Remote<CybIpfsNode> | null;
  ipfsError?: string | null;
  loadIpfs?: () => Promise<void>;
  isIpfsInitialized: boolean;
  isDbInitialized: boolean;
  isSyncInitialized: boolean;
  isReady: boolean;
};

const valueContext = {
  isIpfsInitialized: false,
  isDbInitialized: false,
  isSyncInitialized: false,
  isReady: false,
  dbApi: null,
  senseApi: null,
  backendApi: null,
};

const BackendContext =
  React.createContext<BackendProviderContextType>(valueContext);

export function useBackend() {
  return useContext(BackendContext);
}

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

  const isReady = isDbInitialized && isIpfsInitialized && isSyncInitialized;

  const myAddress = useAppSelector(selectCurrentAddress);
  const followings = useAppSelector(selectFollowings);
  // const passport = useAppSelector(selectCurrentPassport);
  // const passports = useCommunityPassports();
  // const useGetAddress = defaultAccount?.account?.cyber?.bech32 || null;

  useEffect(() => {
    backgroundWorkerProxy.setParams({ myAddress });
  }, [myAddress]);

  useEffect(() => {
    backgroundWorkerProxy.setParams({ followings });
  }, [followings]);

  useEffect(() => {
    if (isDbInitialized) {
      (async () => {
        // init dbApi
        DbApiInstance.init(proxy(dbApiService));
        // pass dbApi into background worker
        await backgroundWorkerProxy.installDbApi(proxy(DbApiInstance));
      })();
    }
  }, [isDbInitialized]);

  useEffect(() => {
    isReady && console.log('🟢 Backend started.');
  }, [isReady]);

  useEffect(() => {
    backgroundWorkerProxy.setParams({
      cyberIndexUrl: CYBER.CYBER_INDEX_HTTPS,
    });
    const channel = new BroadcastChannelListener((msg) => dispatch(msg.data));

    (async () => {
      console.log(
        process.env.IS_DEV
          ? '🧪 Starting backend in DEV mode...'
          : '🧬 Starting backend in PROD mode...'
      );
      await setupStoragePersistence();

      // Loading non-blocking, when ready  state.backend.services.* should be changef
      Promise.all([loadIpfs(), loadCozoDb()]);

      return () => channel.close();
    })();
  }, [dispatch]);

  const loadCozoDb = async () => {
    console.time('🔋 CozoDb worker started.');
    await dbApiService
      .init()
      .then(() => console.timeEnd('🔋 CozoDb worker started.'));
  };

  const loadIpfs = async () => {
    const ipfsOpts = getIpfsOpts();
    await backgroundWorkerProxy.ipfsApi.stop();
    console.time('🔋 Ipfs started.');

    await backgroundWorkerProxy.ipfsApi
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

  const valueMemo = useMemo(
    () => ({
      backendApi: backgroundWorkerProxy,
      dbApi: dbApiService,
      senseApi: isDbInitialized ? createSenseApi(DbApiInstance) : null,
      ipfsNode: isIpfsInitialized
        ? backgroundWorkerProxy.ipfsApi.getIpfsNode()
        : null,
      loadIpfs,
      ipfsError,
      isIpfsInitialized,
      isDbInitialized,
      isSyncInitialized,
      isReady,
    }),
    [isReady, isIpfsInitialized, isDbInitialized, isSyncInitialized, ipfsError]
  );

  return (
    <BackendContext.Provider value={valueMemo}>
      {children}
    </BackendContext.Provider>
  );
}

export default BackendProvider;

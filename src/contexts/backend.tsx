import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { proxy, Remote } from 'comlink';
import { backgroundWorkerInstance } from 'src/services/backend/workers/background/service';
import { cozoDbWorkerInstance } from 'src/services/backend/workers/db/service';
import BroadcastChannelListener from 'src/services/backend/channels/BroadcastChannelListener';

import { CYBER } from 'src/utils/config';

import { CybIpfsNode } from 'src/services/ipfs/ipfs';
import { getIpfsOpts } from 'src/services/ipfs/config';
import { selectFollowings } from 'src/redux/features/currentAccount';
// import { selectCurrentPassport } from 'src/features/passport/passports.redux';
// import useCommunityPassports from 'src/features/passport/hooks/useCommunityPassports';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import DbApiInstance, {
  DbApi,
} from 'src/services/backend/services/dataSource/indexedDb/dbApiWrapper';
import { NeuronAddress, ParticleCid } from 'src/types/base';
import { CozoDbWorker } from 'src/services/backend/workers/db/worker';
import { BackgroundWorker } from 'src/services/backend/workers/background/worker';

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
  cozoDbRemote: Remote<CozoDbWorker> | null;
  senseApi: ReturnType<typeof createSenseApi> | null;
  ipfsApi: Remote<BackgroundWorker['ipfsApi']> | null;
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
  ipfsApi: null,
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
    backgroundWorkerInstance.setParams({ myAddress });
  }, [myAddress]);

  useEffect(() => {
    backgroundWorkerInstance.setParams({ followings });
  }, [followings]);

  // useEffect(() => {
  //   if (isDbInitialized) {
  //     (async () => {
  //       // init dbApi
  //       DbApiInstance.init(proxy(cozoDbWorkerInstance));
  //       // pass dbApi into background worker
  //       await backgroundWorkerInstance.init(proxy(DbApiInstance));
  //     })();
  //   }
  // }, [isDbInitialized]);

  useEffect(() => {
    isReady && console.log('🟢 Backend started.');
  }, [isReady]);

  useEffect(() => {
    backgroundWorkerInstance.setParams({
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
    await cozoDbWorkerInstance
      .init()
      .then(() => {
        // init dbApi
        // TODO: refactor to use simple object instead of global instance
        DbApiInstance.init(proxy(cozoDbWorkerInstance));

        // pass dbApi into background worker
        backgroundWorkerInstance.init(proxy(DbApiInstance));
      })
      .then(() => console.timeEnd('🔋 CozoDb worker started.'));
  };

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

  const valueMemo = useMemo(
    () =>
      ({
        // backgroundWorker: backgroundWorkerInstance,
        cozoDbRemote: cozoDbWorkerInstance,
        ipfsApi: backgroundWorkerInstance.ipfsApi,
        ipfsNode: isIpfsInitialized
          ? backgroundWorkerInstance.ipfsApi.getIpfsNode()
          : null,
        senseApi: isDbInitialized ? createSenseApi(DbApiInstance) : null,
        loadIpfs,
        ipfsError,
        isIpfsInitialized,
        isDbInitialized,
        isSyncInitialized,
        isReady,
      } as BackendProviderContextType),
    [isReady, isIpfsInitialized, isDbInitialized, isSyncInitialized, ipfsError]
  );

  return (
    <BackendContext.Provider value={valueMemo}>
      {children}
    </BackendContext.Provider>
  );
}

export default BackendProvider;

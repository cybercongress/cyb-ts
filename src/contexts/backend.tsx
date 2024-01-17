import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { proxy, Remote } from 'comlink';
import { backgroundWorkerInstance } from 'src/services/backend/workers/background/service';
import { cozoDbWorkerInstance } from 'src/services/backend/workers/db/service';
import BroadcastChannelListener from 'src/services/backend/channels/BroadcastChannelListener';

import { CYBER } from 'src/utils/config';

import { CybIpfsNode } from 'src/services/ipfs/ipfs';
import { getIpfsOpts } from 'src/services/ipfs/config';
// import { selectCurrentPassport } from 'src/features/passport/passports.redux';
// import useCommunityPassports from 'src/features/passport/hooks/useCommunityPassports';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import DbApiWrapper from 'src/services/backend/services/dataSource/indexedDb/dbApiWrapper';
import { NeuronAddress, ParticleCid } from 'src/types/base';
import { CozoDbWorker } from 'src/services/backend/workers/db/worker';
import { BackgroundWorker } from 'src/services/backend/workers/background/worker';
import useDeepCompareEffect from 'src/hooks/useDeepCompareEffect';

const createSenseApi = (dbApi: DbApiWrapper, myAddress?: string) => ({
  getSummary: () => dbApi.getSenseSummary(myAddress),
  getList: () => dbApi.getSenseList(myAddress),
  markAsRead: (id: NeuronAddress | ParticleCid) =>
    dbApi.senseMarkAsRead(myAddress, id),
  getAllParticles: (fields: string[]) => dbApi.getParticles(fields),
  getLinks: (cid: ParticleCid) => dbApi.getLinks(cid),
  getTransactions: (neuron: NeuronAddress) => dbApi.getTransactions(neuron),
  getMyChats: (userAddress: NeuronAddress) => {
    if (!myAddress) {
      throw new Error('myAddress is not defined');
    }
    return dbApi.getMyChats(myAddress, userAddress);
  },
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
  defferedDbApi: Remote<BackgroundWorker['defferedDbApi']> | null;
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

const dbApi = new DbApiWrapper();

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

  const followings = useAppSelector(({ currentAccount }) => {
    const { friends, following } = currentAccount.community;
    return Array.from(new Set([...friends, ...following]));
  });

  useDeepCompareEffect(() => {
    backgroundWorkerInstance.setParams({ myAddress });
  }, [myAddress]);

  useDeepCompareEffect(() => {
    backgroundWorkerInstance.setParams({ followings });
  }, [followings]);

  useEffect(() => {
    isReady && console.log('🟢 Backend started.');
  }, [isReady]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const channel = new BroadcastChannelListener((msg) => dispatch(msg.data));
    backgroundWorkerInstance.setParams({
      cyberIndexUrl: CYBER.CYBER_INDEX_HTTPS,
    });

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
          return Promise.resolve();
        }
        return loadIpfs();
      };

      const cozoDbLoadPromise = async () => {
        const isInitialized = await cozoDbWorkerInstance.isInitialized();
        if (isInitialized) {
          console.log('🔋 CozoDb worker already active.');
          return Promise.resolve();
        }
        return loadCozoDb();
      };

      // Loading non-blocking, when ready  state.backend.services.* should be changef
      Promise.all([ipfsLoadPromise(), cozoDbLoadPromise()]);
    })();

    window.q = backgroundWorkerInstance.ipfsQueue;
    // return () => channel.close();
  }, [dispatch]);

  const loadCozoDb = async () => {
    console.time('🔋 CozoDb worker started.');
    await cozoDbWorkerInstance
      .init()
      .then(() => {
        // init dbApi
        // TODO: refactor to use simple object instead of global instance
        dbApi.init(proxy(cozoDbWorkerInstance));

        // pass dbApi into background worker
        backgroundWorkerInstance.init(proxy(dbApi));
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

  const senseApi = useMemo(
    () => (isDbInitialized ? createSenseApi(dbApi, myAddress) : null),
    [isDbInitialized, myAddress]
  );

  const valueMemo = useMemo(
    () =>
      ({
        // backgroundWorker: backgroundWorkerInstance,
        cozoDbRemote: cozoDbWorkerInstance,
        ipfsApi: backgroundWorkerInstance.ipfsApi,
        defferedDbApi: backgroundWorkerInstance.defferedDbApi,
        ipfsNode: isIpfsInitialized
          ? backgroundWorkerInstance.ipfsApi.getIpfsNode()
          : null,
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
      myAddress,
    ]
  );

  return (
    <BackendContext.Provider value={valueMemo}>
      {children}
    </BackendContext.Provider>
  );
}

export default BackendProvider;

import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { proxy, Remote } from 'comlink';
import { backendWorkerApiRemote } from 'src/services/backend/workers/background/service';

import BroadcastChannelListener from 'src/services/backend/channels/BroadcastChannelListener';
import dbApiWorkerRemove from 'src/services/backend/workers/db/service';
import { CYBER } from 'src/utils/config';

import { CybIpfsNode, IpfsOptsType } from 'src/services/ipfs/ipfs';
import { getIpfsOpts } from 'src/services/ipfs/config';
import { selectCurrentPassport } from 'src/features/passport/passports.redux';
import { selectFollowings } from 'src/redux/features/currentAccount';
import useCommunityPassports from 'src/features/passport/hooks/useCommunityPassports';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import dbApiWrapper from 'src/services/backend/services/dataSource/indexedDb/dbApiWrapper';

type BackendProviderContextType = {
  startSyncTask?: () => void;
  dbApi?: typeof dbApiWorkerRemove;
  senseApi: typeof backendWorkerApiRemote.senseApi;
  backendApi?: typeof backendWorkerApiRemote;
  ipfsNode?: Remote<CybIpfsNode> | null;
  ipfsError: string | null;
  loadIpfs: () => Promise<void>;
  isIpfsInitialized: boolean;
  isDbInitialized: boolean;
  isSyncInitialized: boolean;
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
  const [isSyncInitialized, setIsSyncInitialized] = useState(false);

  const [ipfsError, setIpfsError] = useState(null);
  const ipfsNode = useRef<Remote<CybIpfsNode> | null>(null);

  const dbStatus = useAppSelector((state) => state.backend.services.db);
  const ipfsStatus = useAppSelector((state) => state.backend.services.ipfs);
  const syncStatus = useAppSelector((state) => state.backend.services.sync);

  const myAddress = useAppSelector(selectCurrentAddress);
  const followings = useAppSelector(selectFollowings);
  // const passport = useAppSelector(selectCurrentPassport);
  // const passports = useCommunityPassports();
  // console.log('-----passport', passport, followings, passports);
  // const useGetAddress = defaultAccount?.account?.cyber?.bech32 || null;

  const channelRef = useRef<BroadcastChannelListener>();

  backendWorkerApiRemote.setParams({ cyberIndexUrl: CYBER.CYBER_INDEX_HTTPS });

  useEffect(() => {
    backendWorkerApiRemote.setParams({ myAddress });
  }, [myAddress]);

  useEffect(() => {
    backendWorkerApiRemote.setParams({ followings });
  }, [followings]);

  useEffect(() => {
    setIsDbItialized(dbStatus.status === 'started');
  }, [dbStatus]);

  useEffect(() => {
    setIsSyncInitialized(syncStatus.status === 'started');
  }, [syncStatus]);

  useEffect(() => {
    setIsIpfsInitialized(ipfsStatus.status === 'started');
  }, [ipfsStatus]);

  useEffect(() => {
    if (isDbInitialized) {
      // attach db api to backend api

      (async () => {
        await backendWorkerApiRemote.installDbApi(proxy(dbApiWorkerRemove));
      })();
    }

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
      loadCozoDb();
    })();

    // Channel to sync worker's state with redux store
    channelRef.current = new BroadcastChannelListener((msg) =>
      dispatch(msg.data)
    );
  }, [dispatch]);

  const loadCozoDb = async () => {
    console.time('🔋 CozoDb worker started.');
    await dbApiWorkerRemove
      .init()
      .then(() => console.timeEnd('🔋 CozoDb worker started.'));
  };

  const loadIpfs = async () => {
    const ipfsOpts = getIpfsOpts();
    await backendWorkerApiRemote.ipfsApi.stop();
    console.time('🔋 Ipfs started.');
    await backendWorkerApiRemote.ipfsApi
      .start(ipfsOpts)
      .then((ipfsNodeRemote) => {
        ipfsNode.current = ipfsNodeRemote;
        setIpfsError(null);
        console.timeEnd('🔋 Ipfs started.');
      })
      .catch((err) => {
        ipfsNode.current = null;
        setIpfsError(err);
        console.log(`☠️ Ipfs error: ${err}`);
      });
  };

  const valueMemo = useMemo(
    () => ({
      startSyncTask: async () => console.log('---legacy'),
      // backendWorkerApiRemote.syncDrive(
      //   useGetAddress,
      //   CYBER.CYBER_INDEX_HTTPS
      // ),
      backendApi: backendWorkerApiRemote,
      dbApi: isDbInitialized ? dbApiWorkerRemove : undefined,
      senseApi: backendWorkerApiRemote.senseApi,
      // dbApiWrapper: backendWorkerApiRemote.dbWrapperApi,

      ipfsNode: isIpfsInitialized ? ipfsNode.current : null,
      loadIpfs,
      ipfsError,
      isIpfsInitialized,
      isDbInitialized,
      isSyncInitialized,
      isReady: isDbInitialized && isIpfsInitialized && isSyncInitialized,
    }),
    [
      // useGetAddress,
      isIpfsInitialized,
      isDbInitialized,
      isSyncInitialized,
      ipfsError,
    ]
  );

  return (
    <BackendContext.Provider value={valueMemo}>
      {children}
    </BackendContext.Provider>
  );
}

export default BackendProvider;

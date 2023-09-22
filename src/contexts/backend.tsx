import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { useAppDispatch } from 'src/redux/hooks';
import { workerApi } from 'src/services/backend/service';
import BcChannel from 'src/services/backend/BroadcastChannel';

import { DbWorkerApi } from 'src/services/CozoDb/db.worker';

import { getIpfsOpts } from './ipfs';

type BackendProviderContextType = {
  startSyncTask: () => void;
  getDbApi: () => Promise<DbWorkerApi>;
};

const valueContext = {
  startSyncTask: () => {},
  getDbApi: () => Promise.resolve({}),
};

const BackendContext =
  React.createContext<BackendProviderContextType>(valueContext);

export function useBackend() {
  return useContext(BackendContext);
}

function BackendProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  const channelRef = useRef<BcChannel>();

  // Init backend worker
  // TODO: move DbApi as return ???
  useEffect(() => {
    (async () => {
      workerApi
        .init(getIpfsOpts())
        .then(() => console.log('⚙️ Backend initialized'));
    })();

    // Channel to sync backend(workers) state with reducer
    channelRef.current = new BcChannel((msg) => dispatch(msg.data));
  }, []);

  const valueMemo = useMemo(
    () => ({
      startSyncTask: async () => workerApi.syncIPFS(),
      getDbApi: async () => workerApi.getDbApi(),
    }),
    []
  );

  return (
    <BackendContext.Provider value={valueMemo}>
      {children}
    </BackendContext.Provider>
  );
}

export default BackendProvider;

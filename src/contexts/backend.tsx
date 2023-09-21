import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SyncState, WorkerStatus } from 'src/services/backend/types';
import { workerApi } from 'src/services/backend/service';
import { DualChannelSyncState } from 'src/services/backend/DualChannel';
import { useAppDispatch } from 'src/redux/hooks';
import dbService from 'src/services/CozoDb/db.service';

import { getIpfsOpts } from './ipfs';

type BackendProviderContextType = {
  syncStatus?: SyncState;
  startSyncTask?: () => void;
};

const valueContext = {};

const BackendContext =
  React.createContext<BackendProviderContextType>(valueContext);

export function useBackend() {
  return useContext(BackendContext);
}

function BackendProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  // const [syncStatus, setSyncStatus] = useState<SyncState>({ status: 'idle' });
  // const [contentUrl, setContentUrl] = useState<string>('');
  const channelRef = useRef<DualChannelSyncState>();

  useEffect(() => {
    const init = async () => workerApi.init(getIpfsOpts());
    init();
    dbService.init().then(() => {
      console.log('CozoDb initialized');
    });
    console.log('----init backend');
    channelRef.current = new DualChannelSyncState(
      'reciever',
      'cyb-broadcast-channel',
      (actionFactory: Function) => {
        dispatch(actionFactory());
      }
    );
  }, []);

  const valueMemo = useMemo(
    () => ({
      startSyncTask: async () => {
        await workerApi.syncIPFS();
      },
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

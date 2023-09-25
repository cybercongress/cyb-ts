import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { proxy } from 'comlink';
import { workerApi } from 'src/services/backend/workers/background/service';

import BcChannel from 'src/services/backend/channels/BroadcastChannel';
import dbService from 'src/services/backend/workers/db/service';

import { getIpfsOpts } from './ipfs';
import { useRobotContext } from 'src/pages/robot/robot.context';
import { CYBER } from 'src/utils/config';

type BackendProviderContextType = {
  startSyncTask: () => void;
};

const valueContext = {
  startSyncTask: () => {},
};

const BackendContext =
  React.createContext<BackendProviderContextType>(valueContext);

export function useBackend() {
  return useContext(BackendContext);
}

function BackendProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { defaultAccount } = useAppSelector((state) => state.pocket);

  const useGetAddress = defaultAccount?.account?.cyber?.bech32 || null;

  const channelRef = useRef<BcChannel>();

  useEffect(() => {
    (async () => {
      console.log(
        process.env.IS_DEV
          ? '🧪 Starting backend in DEV mode...'
          : '🧬 Starting backend in PROD mode...'
      );
      await dbService
        .init()
        .then(() => console.log('🔋 CozoDb initialized.', dbService));
      await workerApi
        .init(getIpfsOpts(), proxy(dbService))
        .then(() => console.log('🔋 Background initialized.'));
    })();

    // Channel to sync worker's state with redux store
    channelRef.current = new BcChannel((msg) => dispatch(msg.data));
  }, []);

  console.log('------userAddress2 ', useGetAddress);

  const valueMemo = useMemo(
    () => ({
      startSyncTask: async () =>
        workerApi.syncDrive(useGetAddress, CYBER.CYBER_INDEX_HTTPS),
      getDbApi: async () => dbService,
    }),
    [useGetAddress]
  );

  return (
    <BackendContext.Provider value={valueMemo}>
      {children}
    </BackendContext.Provider>
  );
}

export default BackendProvider;

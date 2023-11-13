import React, { useMemo, useState } from 'react';
import useCommunityPassports from 'src/features/passport/hooks/useCommunityPassports';
import { useAppSelector } from 'src/redux/hooks';
import { RootState } from 'src/redux/store';
import { getBalances } from '../hooks';
import { ObjKeyValue } from 'src/types/data';
import { Nullable } from 'src/types';

const TeleportContext = React.createContext<{
  accountBalances: Nullable<ObjKeyValue>;
  refreshBalances: () => void;
}>({
  accountBalances: null,
  refreshBalances: () => {},
});

export const useTeleport = () => React.useContext(TeleportContext);

function TeleportContextProvider({ children }: { children: React.ReactNode }) {
  useCommunityPassports();
  const { defaultAccount } = useAppSelector((state: RootState) => state.pocket);
  const addressActive = defaultAccount.account?.cyber;

  const { liquidBalances: accountBalances, refresh: refreshBalances } =
    getBalances(addressActive);

  const contextValue = useMemo(
    () => ({
      accountBalances,
      refreshBalances,
    }),
    [accountBalances]
  );

  return (
    <TeleportContext.Provider value={contextValue}>
      {children}
    </TeleportContext.Provider>
  );
}

export default TeleportContextProvider;

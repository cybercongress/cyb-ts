import React, { useMemo, useState } from 'react';
import useCommunityPassports from 'src/features/passport/hooks/useCommunityPassports';
import { useAppSelector } from 'src/redux/hooks';
import { RootState } from 'src/redux/store';
import { getBalances } from '../hooks';
import { ObjKeyValue } from 'src/types/data';
import { Nullable } from 'src/types';

const TeleportContext = React.createContext<{
  accountBalances: Nullable<ObjKeyValue>;
}>({
  accountBalances: null,
});

export const useTeleportContext = () => React.useContext(TeleportContext);

function TeleportContextProvider({ children }: { children: React.ReactNode }) {
  useCommunityPassports();
  const { defaultAccount } = useAppSelector((state: RootState) => state.pocket);
  const addressActive = defaultAccount.account?.cyber;

  const [updateState, setUpdateState] = useState(0);
  const { liquidBalances: accountBalances } = getBalances(
    addressActive,
    updateState
  );

  const update = () => {
    setUpdateState((item) => item + 1);
  };

  const contextValue = useMemo(
    () => ({
      accountBalances,
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

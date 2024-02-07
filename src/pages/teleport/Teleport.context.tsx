import React, { useMemo } from 'react';
import useCommunityPassports from 'src/features/passport/hooks/useCommunityPassports';
import { useAppSelector } from 'src/redux/hooks';
import { RootState } from 'src/redux/store';
import { ObjKeyValue } from 'src/types/data';
import { Nullable } from 'src/types';
import useGetBalances from 'src/hooks/getBalances';
import useGetTotalSupply from 'src/hooks/useGetTotalSupply';

const TeleportContext = React.createContext<{
  accountBalances: Nullable<ObjKeyValue>;
  totalSupplyProofList: Nullable<ObjKeyValue>;
  totalSupplyAll: Nullable<ObjKeyValue>;
  refreshBalances: () => void;
}>({
  accountBalances: null,
  totalSupplyProofList: undefined,
  totalSupplyAll: undefined,
  refreshBalances: () => undefined,
});

export const useTeleport = () => React.useContext(TeleportContext);

function TeleportContextProvider({ children }: { children: React.ReactNode }) {
  useCommunityPassports();
  const { defaultAccount } = useAppSelector((state: RootState) => state.pocket);
  const addressActive = defaultAccount.account?.cyber;

  const { totalSupplyProofList, totalSupplyAll } = useGetTotalSupply();
  const { liquidBalances: accountBalances, refresh: refreshBalances } =
    useGetBalances(addressActive);

  const contextValue = useMemo(
    () => ({
      accountBalances,
      refreshBalances,
      totalSupplyProofList,
      totalSupplyAll,
    }),
    [accountBalances, refreshBalances]
  );

  return (
    <TeleportContext.Provider value={contextValue}>
      {children}
    </TeleportContext.Provider>
  );
}

export default TeleportContextProvider;

import React, { useContext, useMemo } from 'react';
import useGetMarketData from 'src/hooks/useGetMarketData';
import { ObjKeyValue } from 'src/types/data';

type OptionObj<T> = T | object;

type ObjData = OptionObj<ObjKeyValue>;

type DataProviderContextType = {
  marketData: ObjData;
  dataTotalSupply: ObjData;
};

const valueContext = {
  marketData: {},
  dataTotalSupply: {},
};

const DataProviderContext =
  React.createContext<DataProviderContextType>(valueContext);

export function useAppData() {
  return useContext(DataProviderContext);
}

function DataProvider({ children }: { children: React.ReactNode }) {
  const { marketData, dataTotal } = useGetMarketData();

  const valueMemo = useMemo(
    () => ({
      marketData,
      dataTotalSupply: dataTotal,
    }),
    [marketData, dataTotal]
  );

  return (
    <DataProviderContext.Provider value={valueMemo}>
      {children}
    </DataProviderContext.Provider>
  );
}

export default DataProvider;

import React, { useContext, useMemo, useState } from 'react';
import { ObjKeyValue } from 'src/types/data';

type OptionObj<T> = T | object;

type UpdateFuncT = (newList: OptionObj<ObjKeyValue>) => void;

type ObjData = OptionObj<ObjKeyValue>;

type DataProviderContextType = {
  marketData: ObjData;
  dataTotalSupply: ObjData;
  updateMarketData: UpdateFuncT;
  updateDataTotalSupply: UpdateFuncT;
};

const valueContext = {
  marketData: {},
  dataTotalSupply: {},
  updateMarketData: () => {},
  updateDataTotalSupply: () => {},
};

const DataProviderContext =
  React.createContext<DataProviderContextType>(valueContext);

export function useAppData() {
  return useContext(DataProviderContext);
}

function DataProvider({ children }: { children: React.ReactNode }) {
  const [marketData, setMarketData] = useState<ObjData>({});
  const [dataTotalSupply, setDataTotalSupply] = useState<ObjData>({});

  const updateMarketData = (newData: ObjData) => {
    setMarketData((item) => ({
      ...item,
      ...newData,
    }));
  };

  const updateDataTotalSupply = (newData: ObjData) => {
    setDataTotalSupply((item) => ({
      ...item,
      ...newData,
    }));
  };

  const valueMemo = useMemo(
    () => ({
      marketData,
      dataTotalSupply,
      updateMarketData,
      updateDataTotalSupply,
    }),
    [marketData, dataTotalSupply]
  );

  return (
    <DataProviderContext.Provider value={valueMemo}>
      {children}
    </DataProviderContext.Provider>
  );
}

export default DataProvider;

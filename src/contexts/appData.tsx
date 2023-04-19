import React, { useContext, useEffect, useMemo, useState } from 'react';
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
  const [marketDataState, setMarketData] = useState<ObjData>({});
  const [dataTotalSupplyState, setDataTotalSupply] = useState<ObjData>({});

  useEffect(() => {
    if (Object.keys(marketData).length > 0) {
      setMarketData((item) => ({
        ...item,
        ...marketData,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketData]);

  useEffect(() => {
    if (Object.keys(dataTotal).length > 0) {
      setDataTotalSupply((item) => ({
        ...item,
        ...dataTotal,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTotal]);

  const valueMemo = useMemo(
    () => ({
      marketData: marketDataState,
      dataTotalSupply: dataTotalSupplyState,
    }),
    [marketDataState, dataTotalSupplyState]
  );

  return (
    <DataProviderContext.Provider value={valueMemo}>
      {children}
    </DataProviderContext.Provider>
  );
}

export default DataProvider;

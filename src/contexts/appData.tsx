import React, { useContext, useEffect, useMemo, useState } from 'react';
import useGetMarketData from 'src/hooks/useGetMarketData';
import { ObjKeyValue } from 'src/types/data';
import { useWebsockets } from 'src/websockets/context';

type OptionObj<T> = T | object;

type ObjData = OptionObj<ObjKeyValue>;

type DataProviderContextType = {
  marketData: ObjData;
  dataTotalSupply: ObjData;
  block: number | null;
};

const valueContext = {
  marketData: {},
  dataTotalSupply: {},
  block: null,
};

const DataProviderContext =
  React.createContext<DataProviderContextType>(valueContext);

export function useAppData() {
  return useContext(DataProviderContext);
}

function DataProvider({ children }: { children: React.ReactNode }) {
  const { marketData, dataTotal } = useGetMarketData();
  const { cyber } = useWebsockets();
  const [blockHeight, setBlockHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!cyber?.connected) {
      return;
    }

    const param = "tm.event='NewBlockHeader'";

    if (cyber.subscriptions.includes(param)) {
      return;
    }

    cyber.sendMessage({
      method: 'subscribe',
      params: [param],
      id: '1',
      jsonrpc: '2.0',
    });
  }, [cyber, cyber?.connected]);

  useEffect(() => {
    if (!cyber?.message?.result) {
      return;
    }

    const message = cyber?.message;

    if (
      Object.keys(message.result).length > 0 &&
      message.result.data.type === 'tendermint/event/NewBlockHeader'
    ) {
      const { height } = message.result.data.value.header;
      setBlockHeight(height);
    }
  }, [cyber?.message]);

  const valueMemo = useMemo(
    () => ({
      marketData,
      dataTotalSupply: dataTotal,
      block: blockHeight,
    }),
    [marketData, dataTotal, blockHeight]
  );

  return (
    <DataProviderContext.Provider value={valueMemo}>
      {children}
    </DataProviderContext.Provider>
  );
}

export default DataProvider;

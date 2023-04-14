import React, { useCallback, useEffect, useMemo, useState } from 'react';
import usePoolListInterval from 'src/hooks/usePoolListInterval';
import { useQueryClient } from 'src/contexts/queryClient';
import { Option } from 'src/types';
import {
  IbcDenomsArrType,
  TraseDenomFuncResponse,
  TraseDenomFuncType,
} from 'src/types/ibc';
import { NetworksListType } from 'src/types/networks';
import { $TsFixMe, $TsFixMeFunc } from 'src/types/tsfix';
import defaultNetworks from 'src/utils/defaultNetworks';
import {
  findDenomInTokenList,
  findPoolDenomInArr,
  getDenomHash,
  isNative,
} from 'src/utils/utils';

type NetworksContextType = {
  networks: Option<NetworksListType>;
  updateNetworks: (list: NetworksListType) => never;
};

const valueContext = {
  networks: {},
  updateNetworks: () => {},
};

export const NetworksContext =
  React.createContext<NetworksContextType>(valueContext);

function NetworksProvider({ children }: { children: React.ReactNode }) {
  const [networks, setNetworks] = useState<Option<NetworksListType>>(undefined);

  useEffect(() => {
    let networksTmp = {};
    const response = localStorage.getItem('CHAIN_PARAMS');
    if (response !== null) {
      const networksData: NetworksListType = JSON.parse(response);
      networksTmp = { ...networksData };
    } else {
      networksTmp = { ...defaultNetworks };
      localStorage.setItem('CHAIN_PARAMS', JSON.stringify(defaultNetworks));
    }

    setNetworks((item) => ({
      ...item,
      ...networksTmp,
    }));
  }, []);

  const updateNetworks = (newList: $TsFixMe) => {
    localStorage.setItem('CHAIN_PARAMS', JSON.stringify(newList));
    setNetworks((item) => ({
      ...item,
      ...newList,
    }));
  };

  return (
    <NetworksContext.Provider
      value={useMemo(
        () => ({ networks, updateNetworks } as NetworksContextType),
        [networks]
      )}
    >
      {children}
    </NetworksContext.Provider>
  );
}

export default NetworksProvider;

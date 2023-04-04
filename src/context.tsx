/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useEffect, useCallback } from 'react';
import { SigningCyberClient, CyberClient } from '@cybercongress/cyber-js';
import { CYBER } from './utils/config';
import configKeplr from './utils/keplrUtils';
import defaultNetworks from './utils/defaultNetworks';
import {
  getDenomHash,
  isNative,
  findDenomInTokenList,
  findPoolDenomInArr,
} from './utils/utils';
import { getDenomTraces } from './utils/search/utils';
import { OfflineSigner } from '@cybercongress/cyber-js/build/signingcyberclient';
import { Keplr } from '@keplr-wallet/types';
import { $TsFixMe, $TsFixMeFunc } from './types/tsfix';
import { Pool } from '@cybercongress/cyber-js/build/codec/tendermint/liquidity/v1beta1/liquidity';
import { Option } from './types/common';
import { QueryLiquidityPoolsResponse } from '@cybercongress/cyber-js/build/codec/tendermint/liquidity/v1beta1/query';

const getKeplr = async (): Promise<Keplr | undefined> => {
  if (window.keplr) {
    return window.keplr;
  }

  if (document.readyState === 'complete') {
    return window.keplr;
  }

  return new Promise((resolve) => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        resolve(window.keplr);
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};

type TraseDenom = {
  denom: $TsFixMe;
  coinDecimals: number;
  path: string;
  coinImageCid: string;
  native: boolean;
};

type TraseDenomFuncType = (denom: string) => {
  denom: string | TraseDenom;
  coinDecimals: number;
  path: string;
  coinImageCid: string;
  native: boolean;
};

type ValueContextType = {
  keplr: SigningCyberClient | null;
  jsCyber: CyberClient | null;
  ibcDataDenom: $TsFixMe;
  poolsData: Pool[] | null;
  networks: $TsFixMe;
  marketData: $TsFixMe;
  dataTotalSupply: $TsFixMe;
  updateNetworks: $TsFixMeFunc;
  updatetMarketData: $TsFixMeFunc;
  updateDataTotalSupply: $TsFixMeFunc;
  initSigner: () => void;
  traseDenom: TraseDenomFuncType;
};

const valueContext = {
  keplr: null,
  jsCyber: null,
  ibcDataDenom: {},
  poolsData: [],
  networks: {},
  marketData: {},
  dataTotalSupply: {},
  updateNetworks: () => {},
  updatetMarketData: () => {},
  updateDataTotalSupply: () => {},
  initSigner: () => {},
  traseDenom: () => {},
};

export const AppContext = React.createContext<ValueContextType>(valueContext);

// const useContextProvider = () => useContext(AppContext);

async function createClient(signer: OfflineSigner) {
  const options = { prefix: CYBER.BECH32_PREFIX_ACC_ADDR_CYBER };
  const client = await SigningCyberClient.connectWithSigner(
    CYBER.CYBER_NODE_URL_API,
    signer,
    options
  );

  return client;
}

function AppContextProvider({ children }) {
  const [value, setValue] = useState(valueContext);
  const [signer, setSigner] = useState<OfflineSigner | undefined>(undefined);
  const [client, setClient] = useState<CyberClient | undefined>(undefined);
  const [loadUrl, setLoadUrl] = useState(true);
  // const dataMarket = useGetMarketData(value.jsCyber, value.traseDenom);

  // console.log('dataMarket', dataMarket);

  useEffect(() => {
    let networks = {};
    const response = localStorage.getItem('CHAIN_PARAMS');
    if (response !== null) {
      const networksData = JSON.parse(response);
      networks = { ...networksData };
    } else {
      networks = { ...defaultNetworks };
      localStorage.setItem('CHAIN_PARAMS', JSON.stringify(defaultNetworks));
    }
    // getUplParam(networks);
    setValue((item) => ({
      ...item,
      networks,
    }));
  }, []);

  useEffect(() => {
    const createQueryCliet = async () => {
      setLoadUrl(true);
      const queryClient = await CyberClient.connect(CYBER.CYBER_NODE_URL_API);
      await getPools(queryClient);
      setValue((item: $TsFixMe) => ({
        ...item,
        jsCyber: queryClient,
      }));
      setLoadUrl(false);
    };
    createQueryCliet();
  }, []);

  const getPools = async (queryClient: CyberClient) => {
    if (queryClient) {
      try {
        const response: Option<QueryLiquidityPoolsResponse> =
          await queryClient.pools();
        if (response) {
          setValue((item: $TsFixMe) => ({
            ...item,
            poolsData: response.pools,
          }));
        }
        return;
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  useEffect(() => {
    const getIBCDenomData = async () => {
      // const responce = await queryClient.allDenomTraces();
      const responce = await getDenomTraces();
      // const { denomTraces } = responce;
      const { denom_traces: denomTraces } = responce;
      const ibcData = {};

      if (denomTraces && denomTraces.length > 0) {
        denomTraces.forEach((item) => {
          // const { path, baseDenom } = item;
          const { path, base_denom: baseDenom } = item;
          const ibcDenom = getDenomHash(path, baseDenom);

          // sourceChannelId
          const parts = path.split('/');
          const removetr = parts.filter((itemStr) => itemStr !== 'transfer');
          const sourceChannelId = removetr.join('/');

          ibcData[ibcDenom] = {
            sourceChannelId,
            baseDenom,
            ibcDenom,
          };
        });
      }

      if (Object.keys(ibcData).length > 0) {
        setValue((item) => ({
          ...item,
          ibcDataDenom: { ...ibcData },
        }));
      }
    };
    getIBCDenomData();
  }, []);

  useEffect(() => {
    if (signer) {
      const updateClient = async () => {
        const clientJs = await createClient(signer);
        setClient(clientJs);
      };
      updateClient();
    }
  }, [signer]);

  useEffect(() => {
    window.onload = async () => {
      const windowKeplr = await getKeplr();
      if (windowKeplr) {
        initSigner();
      }
    };
  }, []);

  useEffect(() => {
    window.addEventListener('keplr_keystorechange', () => {
      initSigner();
    });
  }, []);

  const initSigner = async () => {
    const windowKeplr = await getKeplr();
    if (windowKeplr) {
      if (windowKeplr?.experimentalSuggestChain) {
        await windowKeplr.experimentalSuggestChain(
          configKeplr(CYBER.BECH32_PREFIX_ACC_ADDR_CYBER)
        );
        await windowKeplr.enable(CYBER.CHAIN_ID);
        const offlineSigner = await windowKeplr.getOfflineSignerAuto(
          CYBER.CHAIN_ID
        );
        console.log(`offlineSigner`, offlineSigner);
        setSigner(offlineSigner);
      }
    }
  };

  useEffect(() => {
    if (client) {
      setValue((item: $TsFixMe) => ({
        ...item,
        keplr: client,
      }));
    }
  }, [client]);

  const updateNetworks = (newList: $TsFixMe) => {
    localStorage.setItem('CHAIN_PARAMS', JSON.stringify(newList));
    setValue((item) => ({
      ...item,
      networks: { ...newList },
    }));
  };

  const updatetMarketData = (newData: $TsFixMe) => {
    setValue((item) => ({
      ...item,
      marketData: { ...newData },
    }));
  };

  const updateDataTotalSupply = (newData: $TsFixMe) => {
    setValue((item) => ({
      ...item,
      dataTotalSupply: { ...newData },
    }));
  };

  const traseDenom = useCallback<TraseDenomFuncType>(
    (denomTrase: string) => {
      const infoDenomTemp: TraseDenom = {
        denom: denomTrase,
        coinDecimals: 0,
        path: '',
        coinImageCid: '',
        native: true,
      };
      let findDenom = '';

      const { ibcDataDenom, poolsData } = value;

      if (denomTrase.includes('pool') && poolsData.length > 0) {
        const findPool = findPoolDenomInArr(denomTrase, poolsData);
        if (findPool !== null) {
          const { reserveCoinDenoms } = findPool;
          infoDenomTemp.denom = [
            traseDenom(reserveCoinDenoms[0]),
            traseDenom(reserveCoinDenoms[1]),
          ];
        }
      } else if (!isNative(denomTrase)) {
        if (
          ibcDataDenom !== null &&
          Object.keys(ibcDataDenom).length > 0 &&
          Object.prototype.hasOwnProperty.call(ibcDataDenom, denomTrase)
        ) {
          const { baseDenom, sourceChannelId: sourceChannelIFromPath } =
            ibcDataDenom[denomTrase];
          findDenom = baseDenom;

          infoDenomTemp.native = false;

          const denomInfoFromList = findDenomInTokenList(findDenom);
          if (denomInfoFromList !== null) {
            const { denom, coinDecimals, coinImageCid, counterpartyChainId } =
              denomInfoFromList;
            infoDenomTemp.denom = denom;
            infoDenomTemp.coinDecimals = coinDecimals;
            infoDenomTemp.coinImageCid = coinImageCid || '';
            infoDenomTemp.path = `${counterpartyChainId}/${sourceChannelIFromPath}`;
          } else {
            infoDenomTemp.denom = baseDenom;
            infoDenomTemp.path = sourceChannelIFromPath;
          }
        }
      } else {
        findDenom = denomTrase;
        const denomInfoFromList = findDenomInTokenList(denomTrase);
        if (denomInfoFromList !== null) {
          const { denom, coinDecimals } = denomInfoFromList;
          infoDenomTemp.denom = denom;
          infoDenomTemp.coinDecimals = coinDecimals;
        } else {
          infoDenomTemp.denom = denomTrase.toUpperCase();
        }
      }

      return { ...infoDenomTemp };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value.ibcDataDenom, value.poolsData]
  );

  if (value.jsCyber && value.jsCyber === null) {
    return <div>...</div>;
  }

  if (loadUrl) {
    return <div>...</div>;
  }

  return (
    <AppContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        ...value,
        updateNetworks,
        updatetMarketData,
        traseDenom,
        updateDataTotalSupply,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;

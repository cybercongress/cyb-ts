import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import { SigningCosmosClient, GasPrice } from '@cosmjs/launchpad';
import { SigningCyberClient, CyberClient } from '@cybercongress/cyber-js';
import { Decimal } from '@cosmjs/math';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';

import queryString from 'query-string';
import { CYBER } from './utils/config';
import { configKeplr } from './utils/keplrUtils';
import useGetNetworks from './hooks/useGetNetworks';
import defaultNetworks from './utils/defaultNetworks';
import {
  getDenomHash,
  isNative,
  findDenomInTokenList,
  findPoolDenomInArr,
} from './utils/utils';
import { getDenomTraces } from './utils/search/utils';

export const getKeplr = async () => {
  if (window.keplr) {
    return window.keplr;
  }

  if (document.readyState === 'complete') {
    return window.keplr;
  }

  return new Promise((resolve) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === 'complete') {
        resolve(window.keplr);
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};

const valueContext = {
  keplr: null,
  ws: null,
  jsCyber: null,
  ibcDataDenom: {},
  poolsData: [],
  networks: {},
  updateNetworks: () => {},
  updatejsCyber: () => {},
  initSigner: () => {},
  traseDenom: () => {},
};

export const AppContext = React.createContext(valueContext);

export const useContextProvider = () => useContext(AppContext);

export async function createClient(signer) {
  if (signer) {
    const firstAddress = await signer.getAccounts();
    console.log('firstAddress', firstAddress);
    // const gasPrice = new GasPrice(Decimal.fromAtomics(0, 0), 'boot');
    const gasPrice = GasPrice.fromString('0.001boot');

    const gasLimits = {
      send: 200000,
      cyberlink: 256000,
      investmint: 160000,
      createRoute: 128000,
      editRoute: 128000,
      editRouteAlias: 128000,
      deleteRoute: 128000,
    };
    const options = { prefix: CYBER.BECH32_PREFIX_ACC_ADDR_CYBER };
    const client = await SigningCyberClient.connectWithSigner(
      CYBER.CYBER_NODE_URL_API,
      signer,
      options
    );

    // client.firstAddress = firstAddress;
    // const cosmJS = new SigningCyberClient(
    //   CYBER.CYBER_NODE_URL_LCD,
    //   firstAddress,
    //   signer,
    //   gasPrice,
    //   gasLimits,
    //   'sync'
    // );

    return client;
  }
  return null;
}

const AppContextProvider = ({ children }) => {
  const [value, setValue] = useState(valueContext);
  const [signer, setSigner] = useState(null);
  const [client, setClient] = useState(null);
  const [loadUrl, setLoadUrl] = useState(true);

  const updatejsCyber = (rpc) => {
    const createQueryCliet = async () => {
      const tendermintClient = await Tendermint34Client.connect(rpc);
      const queryClient = new CyberClient(tendermintClient);

      setValue((item) => ({
        ...item,
        jsCyber: queryClient,
      }));
    };
    createQueryCliet();
  };

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

  // const getUplParam = (dataNetworks) => {
  //   const urlOptions = queryString.parse(window.location.href.split('?')[1]);
  //   const LOCALSTORAGE_CHAIN_ID = localStorage.getItem('chainId');
  //   if (urlOptions.network) {
  //     const { network } = urlOptions;
  //     if (Object.prototype.hasOwnProperty.call(dataNetworks, network)) {
  //       console.log('LOCALSTORAGE_CHAIN_ID', LOCALSTORAGE_CHAIN_ID);
  //       console.log('network', network);
  //       if (
  //         LOCALSTORAGE_CHAIN_ID === null ||
  //         LOCALSTORAGE_CHAIN_ID !== network
  //       ) {
  //         localStorage.setItem('chainId', network);
  //       } else {
  //         localStorage.setItem('chainId', 'bostrom');
  //       }
  //     }
  //   }
  //   setLoadUrl(false);
  // };

  useEffect(() => {
    const createQueryCliet = async () => {
      const tendermintClient = await Tendermint34Client.connect(
        CYBER.CYBER_NODE_URL_API
      );
      const queryClient = new CyberClient(tendermintClient);
      setValue((item) => ({
        ...item,
        jsCyber: queryClient,
      }));
      getPools(queryClient);
    };
    createQueryCliet();
  }, []);

  const getPools = async (queryClient) => {
    if (queryClient) {
      try {
        const response = await queryClient.pools();
        if (response && response !== null && response.pools) {
          setValue((item) => ({ ...item, poolsData: response.pools }));
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  useEffect(() => {
    const getIBCDenomData = async (queryClient) => {
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

  // const getIBCDenomData = async (queryClient) => {
  //   const responce = await queryClient.allDenomTraces();
  //   const { denomTraces } = responce;
  //   const ibcData = {};

  //   if (denomTraces && denomTraces.length > 0) {
  //     denomTraces.forEach((item) => {
  //       const { path, baseDenom } = item;
  //       const ibcDenom = getDenomHash(path, baseDenom);

  //       // sourceChannelId
  //       const parts = path.split('/');
  //       const removetr = parts.filter((itemStr) => itemStr !== 'transfer');
  //       const sourceChannelId = removetr.join('/');

  //       ibcData[ibcDenom] = {
  //         sourceChannelId,
  //         baseDenom,
  //         ibcDenom,
  //       };
  //     });
  //   }

  //   if (Object.keys(ibcData).length > 0) {
  //     setValue((item) => ({
  //       ...item,
  //       ibcDataDenom: { ...ibcData },
  //     }));
  //   }
  // };

  useEffect(() => {
    if (signer !== null) {
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
    if (windowKeplr || window.getOfflineSignerAuto) {
      if (windowKeplr.experimentalSuggestChain) {
        await windowKeplr.experimentalSuggestChain(
          configKeplr(CYBER.BECH32_PREFIX_ACC_ADDR_CYBER)
        );
        await windowKeplr.enable(CYBER.CHAIN_ID);
        const offlineSigner = await window.getOfflineSignerAuto(CYBER.CHAIN_ID);
        console.log(`offlineSigner`, offlineSigner);
        setSigner(offlineSigner);
      }
    }
  };

  useEffect(() => {
    if (client !== null) {
      setValue((item) => ({
        ...item,
        keplr: client,
        ws: CYBER.CYBER_WEBSOCKET_URL,
      }));
    }
  }, [client]);

  const updateNetworks = (newList) => {
    localStorage.setItem('CHAIN_PARAMS', JSON.stringify(newList));
    setValue((item) => ({
      ...item,
      networks: { ...newList },
    }));
  };

  const traseDenom = useCallback(
    (denomTrase) => {
      const infoDenomTemp = {
        denom: denomTrase,
        coinDecimals: 0,
        path: '',
        coinImageCid: '',
      };
      let findDenom = null;

      const { ibcDataDenom, poolsData } = value;

      if (denomTrase.includes('pool') && poolsData.length > 0) {
        const findPool = findPoolDenomInArr(denomTrase, poolsData);
        if (findPool !== null) {
          const { reserveCoinDenoms } = findPool;
          infoDenomTemp.denom = [reserveCoinDenoms[0], reserveCoinDenoms[1]];
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
    [value.ibcDataDenom, value.poolsData]
  );

  if (value.jsCyber && value.jsCyber === null) {
    return <div>...</div>;
  }

  // if (loadUrl) {
  //   return <div>...</div>;
  // }

  return (
    <AppContext.Provider
      value={{
        ...value,
        updatejsCyber,
        initSigner,
        updateNetworks,
        traseDenom,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

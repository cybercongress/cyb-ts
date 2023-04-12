/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useEffect } from 'react';
import { SigningCyberClient, CyberClient } from '@cybercongress/cyber-js';
import { OfflineSigner } from '@cybercongress/cyber-js/build/signingcyberclient';
import { Keplr } from '@keplr-wallet/types';
import { CYBER } from './utils/config';
import configKeplr from './utils/keplrUtils';

import { $TsFixMe } from './types/tsfix';

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

type ValueContextType = {
  keplr: SigningCyberClient | null;
  jsCyber: CyberClient | null;
  initSigner: () => void;
};

const valueContext = {
  keplr: null,
  jsCyber: null,
  initSigner: () => {},
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

  // console.log('dataMarket', dataMarket);

  useEffect(() => {
    const createQueryCliet = async () => {
      setLoadUrl(true);
      const queryClient = await CyberClient.connect(CYBER.CYBER_NODE_URL_API);
      setValue((item: $TsFixMe) => ({
        ...item,
        jsCyber: queryClient,
      }));
      setLoadUrl(false);
    };
    createQueryCliet();
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
    const getKeplrFunc = async () => {
      const windowKeplr = await getKeplr();
      if (windowKeplr) {
        initSigner();
      }
    };
    getKeplrFunc();
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

  if (loadUrl) {
    return <div>...</div>;
  }

  return (
    <AppContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        ...value,
        initSigner,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;

import React, { useEffect, useMemo, useState } from 'react';
import { CyberClient, SigningCyberClient } from '@cybercongress/cyber-js';
import { CYBER } from 'src/utils/config';
import { Keplr } from '@keplr-wallet/types';
import configKeplr from 'src/utils/keplrUtils';
import { OfflineSigner } from '@cybercongress/cyber-js/build/signingcyberclient';

type SigningClientContextType = {
  readonly signingClient: null | SigningCyberClient;
};

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

async function createClient(signer: OfflineSigner): Promise<SigningCyberClient> {
  const options = { prefix: CYBER.BECH32_PREFIX_ACC_ADDR_CYBER };
  const client = await SigningCyberClient.connectWithSigner(
    CYBER.CYBER_NODE_URL_API,
    signer,
    options
  );

  return client;
}

const valueContext = {
  signingClient: null,
};

export const SignerClientContext =
  React.createContext<SigningClientContextType>(valueContext);

function SigningClientProvider({ children }: { children: React.ReactNode }) {
  const [signer, setSigner] = useState<OfflineSigner | undefined>(undefined);
  const [value, setValue] = useState<SigningClientContextType>(valueContext);

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
    if (signer) {
      const updateClient = async () => {
        const clientJs = await createClient(signer);
        setValue((item) => ({
          ...item,
          signingClient: clientJs,
        }));
      };
      updateClient();
    }
  }, [signer]);

  return (
    <SignerClientContext.Provider
      value={useMemo(() => ({ ...value } as SigningClientContextType), [value])}
    >
      {children}
    </SignerClientContext.Provider>
  );
}

export default SigningClientProvider;

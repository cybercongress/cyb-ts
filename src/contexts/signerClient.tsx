import React, { useEffect, useMemo, useState } from 'react';
import { SigningCyberClient } from '@cybercongress/cyber-js';
import { CYBER } from 'src/utils/config';
import { Keplr } from '@keplr-wallet/types';
import configKeplr from 'src/utils/keplrUtils';
import { OfflineSigner } from '@cybercongress/cyber-js/build/signingcyberclient';

type SigningClientContextType = {
  readonly signingClient: null | SigningCyberClient;
  readonly signer: null | OfflineSigner;
  initSigner: () => void;
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

async function createClient(
  signer: OfflineSigner
): Promise<SigningCyberClient> {
  const options = { prefix: CYBER.BECH32_PREFIX_ACC_ADDR_CYBER };
  const client = await SigningCyberClient.connectWithSigner(
    CYBER.CYBER_NODE_URL_API,
    signer,
    options
  );

  console.log('client', client);

  return client;
}

const valueContext = {
  signingClient: null,
  signer: null,
  initSigner: () => {},
};

export const SignerClientContext =
  React.createContext<SigningClientContextType>(valueContext);

function SigningClientProvider({ children }: { children: React.ReactNode }) {
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
    if (windowKeplr && windowKeplr.experimentalSuggestChain) {
      await windowKeplr.experimentalSuggestChain(
        configKeplr(CYBER.BECH32_PREFIX_ACC_ADDR_CYBER)
      );
      await windowKeplr.enable(CYBER.CHAIN_ID);
      const offlineSigner = await windowKeplr.getOfflineSignerAuto(
        CYBER.CHAIN_ID
      );

      const clientJs = await createClient(offlineSigner);
      setValue((item) => ({
        ...item,
        signer: offlineSigner,
        signingClient: clientJs,
      }));
    }
  };

  return (
    <SignerClientContext.Provider
      value={useMemo(
        () => ({ ...value, initSigner } as SigningClientContextType),
        [value]
      )}
    >
      {children}
    </SignerClientContext.Provider>
  );
}

export default SigningClientProvider;

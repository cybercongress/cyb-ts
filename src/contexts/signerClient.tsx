import React, { useEffect, useMemo, useState } from 'react';
import { SigningCyberClient } from '@cybercongress/cyber-js';
import { CYBER } from 'src/utils/config';
import configKeplr, { getKeplr } from 'src/utils/keplrUtils';
import { OfflineSigner } from '@cybercongress/cyber-js/build/signingcyberclient';
import { Option } from 'src/types/common';

// TO DO interface for keplr and OfflineSigner
// type SignerType = OfflineSigner & {
//   keplr: Keplr;
// };

// interface

type SigningClientContextType = {
  readonly signingClient: Option<SigningCyberClient>;
  readonly signer: Option<OfflineSigner>;
  initSigner: () => void;
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

  return client;
}

const valueContext = {
  signingClient: undefined,
  signer: undefined,
  initSigner: () => {},
};

export const SignerClientContext =
  React.createContext<SigningClientContextType>(valueContext);

function SigningClientProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<SigningClientContextType>(valueContext);

  useEffect(() => {
    const initWindowKeplr = async () => {
      // window.onload = async () => {
      const windowKeplr = await getKeplr();
      if (windowKeplr) {
        initSigner();
      }
      // };
    };
    initWindowKeplr();
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

      console.log('offlineSigner', offlineSigner);

      const clientJs = await createClient(offlineSigner);

      console.log('clientJs', clientJs);
      setValue((item) => ({
        ...item,
        signer: offlineSigner,
        signingClient: clientJs,
      }));
    }
  };

  const valueMemo = useMemo(() => ({ ...value, initSigner }), [value]);

  return (
    <SignerClientContext.Provider value={valueMemo}>
      {children}
    </SignerClientContext.Provider>
  );
}

export default SigningClientProvider;

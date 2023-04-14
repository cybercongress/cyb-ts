import React, { useContext, useEffect, useMemo, useState } from 'react';
import { SigningCyberClient } from '@cybercongress/cyber-js';
import { CYBER } from 'src/utils/config';
import configKeplr, { getKeplr } from 'src/utils/keplrUtils';
import { OfflineSigner } from '@cybercongress/cyber-js/build/signingcyberclient';
import { Option } from 'src/types/common';

// TODO: interface for keplr and OfflineSigner
// type SignerType = OfflineSigner & {
//   keplr: Keplr;
// };

type SignerClientContextType = {
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

export const SignerClientContext = React.createContext<SignerClientContextType>(
  {
    signer: undefined,
    signingClient: undefined,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    initSigner: () => {},
  }
);

export function useSigningClient() {
  const signingClient = useContext(SignerClientContext);
  return signingClient;
}

function SigningClientProvider({ children }: { children: React.ReactNode }) {
  const [signer, setSigner] = useState<SignerClientContextType['signer']>();
  const [signingClient, setSigningClient] =
    useState<SignerClientContextType['signingClient']>();

  async function initSigner() {
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

      setSigner(offlineSigner);
      setSigningClient(clientJs);
    }
  }

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

    window.addEventListener('keplr_keystorechange', () => {
      initSigner();
    });
  }, []);

  const value = useMemo(
    () => ({ initSigner, signer, signingClient }),
    [signer, signingClient]
  );

  return (
    <SignerClientContext.Provider value={value}>
      {children}
    </SignerClientContext.Provider>
  );
}

export default SigningClientProvider;

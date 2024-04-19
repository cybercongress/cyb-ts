import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SigningCyberClient } from '@cybercongress/cyber-js';
import { CYBER } from 'src/utils/config';
import configKeplr, { getKeplr } from 'src/utils/keplrUtils';
import { OfflineSigner } from '@cybercongress/cyber-js/build/signingcyberclient';
import { Option } from 'src/types';
import { useAppSelector } from 'src/redux/hooks';

// TODO: interface for keplr and OfflineSigner
// type SignerType = OfflineSigner & {
//   keplr: Keplr;
// };

type SignerClientContextType = {
  readonly signingClient: Option<SigningCyberClient>;
  readonly signer: Option<OfflineSigner>;
  readonly signerReady: boolean;
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

const SignerClientContext = React.createContext<SignerClientContextType>({
  signer: undefined,
  signingClient: undefined,
  signerReady: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  initSigner: () => {},
});

export function useSigningClient() {
  const signingClient = useContext(SignerClientContext);
  return signingClient;
}

function SigningClientProvider({ children }: { children: React.ReactNode }) {
  const { defaultAccount } = useAppSelector((state) => state.pocket);
  const [signer, setSigner] = useState<SignerClientContextType['signer']>();
  const [signerReady, setSignerReady] = useState(false);
  const [signingClient, setSigningClient] =
    useState<SignerClientContextType['signingClient']>();

  useEffect(() => {
    (async () => {
      const address = signer
        ? (await signer.getAccounts())[0].address
        : undefined;

      setSignerReady(
        Boolean(address) &&
          Boolean(defaultAccount.account) &&
          address === defaultAccount.account?.cyber.bech32
      );
    })();
  }, [defaultAccount, signer]);

  const initSigner = useCallback(async () => {
    const windowKeplr = await getKeplr();
    if (windowKeplr && windowKeplr.experimentalSuggestChain) {
      windowKeplr.defaultOptions = {
        sign: {
          preferNoSetFee: true,
        },
      };
      await windowKeplr.experimentalSuggestChain(
        configKeplr(CYBER.BECH32_PREFIX_ACC_ADDR_CYBER)
      );
      await windowKeplr.enable(CYBER.CHAIN_ID);
      const offlineSigner = await windowKeplr.getOfflineSignerAuto(
        CYBER.CHAIN_ID
      );

      const clientJs = await createClient(offlineSigner);

      setSigner(offlineSigner);
      setSigningClient(clientJs);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const windowKeplr = await getKeplr();
      if (windowKeplr) {
        initSigner();
      }
    })();
  }, [initSigner]);

  useEffect(() => {
    window.addEventListener('keplr_keystorechange', () => {
      initSigner();
    });
  }, [initSigner]);

  const value = useMemo(
    () => ({ initSigner, signer, signingClient, signerReady }),
    [signer, signingClient, signerReady, initSigner]
  );

  return (
    <SignerClientContext.Provider value={value}>
      {children}
    </SignerClientContext.Provider>
  );
}

export default SigningClientProvider;

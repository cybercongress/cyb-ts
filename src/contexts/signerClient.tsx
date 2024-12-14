import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import _ from 'lodash';
import { SigningCyberClient } from '@cybercongress/cyber-js';
import configKeplr, { getKeplr } from 'src/utils/keplrUtils';
import { OfflineSigner } from '@cybercongress/cyber-js/build/signingcyberclient';
import { Option } from 'src/types';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { Keplr } from '@keplr-wallet/types';
import { addAddressPocket, setDefaultAccount } from 'src/redux/features/pocket';
import { accountsKeplr } from 'src/utils/utils';
import usePrevious from 'src/hooks/usePrevious';
import { RPC_URL, CHAIN_ID } from 'src/constants/config';
import { Networks } from 'src/types/networks';
import defaultNetworks from 'src/constants/defaultNetworks';

// TODO: interface for keplr and OfflineSigner
// type SignerType = OfflineSigner & {
//   keplr: Keplr;
// };

type SignerClientContextType = {
  readonly signingClient: Option<SigningCyberClient>;
  readonly signer: Option<OfflineSigner>;
  readonly signerReady: boolean;
  readonly getSignClientByChainId: (
    chainId: Networks.BOSTROM | Networks.SPACE_PUSSY
  ) => Promise<Option<SigningCyberClient>>;
  initSigner: () => void;
};

async function createClient(
  signer: OfflineSigner
): Promise<SigningCyberClient> {
  const client = await SigningCyberClient.connectWithSigner(RPC_URL, signer);
  return client;
}

const SignerClientContext = React.createContext<SignerClientContextType>({
  signer: undefined,
  signingClient: undefined,
  signerReady: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  initSigner: () => {},
  getSignClientByChainId: () => {},
});

export function useSigningClient() {
  const signingClient = useContext(SignerClientContext);
  return signingClient;
}

function SigningClientProvider({ children }: { children: React.ReactNode }) {
  const { defaultAccount, accounts } = useAppSelector((state) => state.pocket);
  const dispatch = useAppDispatch();
  const [signer, setSigner] = useState<SignerClientContextType['signer']>();
  const [signerReady, setSignerReady] = useState(false);
  const [signingClient, setSigningClient] =
    useState<SignerClientContextType['signingClient']>();
  const prevAccounts = usePrevious(accounts);

  const selectAddress = useCallback(
    async (keplr: Keplr) => {
      if (!accounts || _.isEqual(prevAccounts, accounts)) {
        return;
      }
      const keyInfo = await keplr.getKey(CHAIN_ID);

      const findAccount = Object.keys(accounts).find((key) => {
        if (accounts[key].cyber.bech32 === keyInfo.bech32Address) {
          return key;
        }

        return undefined;
      });

      if (findAccount) {
        dispatch(setDefaultAccount({ name: findAccount }));
      } else {
        dispatch(addAddressPocket(accountsKeplr(keyInfo)));
      }
    },
    [accounts, prevAccounts, dispatch]
  );

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

  const getOfflineSigner = useCallback(
    async (chainId: Networks.BOSTROM | Networks.SPACE_PUSSY) => {
      const windowKeplr = await getKeplr();

      if (!windowKeplr || !windowKeplr.experimentalSuggestChain) {
        return undefined;
      }

      const { CHAIN_ID: _CHAIN_ID, BECH32_PREFIX: _BECH32_PREFIX } =
        defaultNetworks[chainId];

      if (CHAIN_ID === _CHAIN_ID) {
        selectAddress(windowKeplr);
      }

      windowKeplr.defaultOptions = {
        sign: {
          preferNoSetFee: true,
        },
      };
      await windowKeplr.experimentalSuggestChain(configKeplr(_BECH32_PREFIX));
      await windowKeplr.enable(CHAIN_ID);
      const offlineSigner = await windowKeplr.getOfflineSignerAuto(_CHAIN_ID);

      return offlineSigner;
    },
    [selectAddress]
  );

  const initSigner = useCallback(async () => {
    const offlineSigner = await getOfflineSigner(CHAIN_ID);

    if (!offlineSigner) {
      return;
    }

    const clientJs = await createClient(offlineSigner);

    setSigner(offlineSigner);
    setSigningClient(clientJs);
  }, [getOfflineSigner]);

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

  const getSignClientByChainId = useCallback(
    async (chainId: Networks.BOSTROM | Networks.SPACE_PUSSY) => {
      const offlineSigner = await getOfflineSigner(chainId);

      if (!offlineSigner) {
        return undefined;
      }

      const { RPC_URL: _RPC_URL } = defaultNetworks[chainId];

      return SigningCyberClient.connectWithSigner(_RPC_URL, offlineSigner);
    },
    [getOfflineSigner]
  );

  const value = useMemo(
    () => ({
      initSigner,
      signer,
      signingClient,
      signerReady,
      getSignClientByChainId,
    }),
    [signer, signingClient, signerReady, initSigner, getSignClientByChainId]
  );

  return (
    <SignerClientContext.Provider value={value}>
      {children}
    </SignerClientContext.Provider>
  );
}

export default SigningClientProvider;

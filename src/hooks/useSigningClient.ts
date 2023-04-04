import { useContext } from 'react';
import { SignerClientContext } from 'src/contexts/signerClient';

function useSigningClient() {
  const { signingClient, initSigner } = useContext(SignerClientContext);
  return { signingClient, initSigner };
}

export default useSigningClient;

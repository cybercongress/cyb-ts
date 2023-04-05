import { useContext } from 'react';
import { SignerClientContext } from 'src/contexts/signerClient';

function useSigningClient() {
  const { signingClient, signer, initSigner } = useContext(SignerClientContext);
  return { signingClient, signer, initSigner };
}

export default useSigningClient;

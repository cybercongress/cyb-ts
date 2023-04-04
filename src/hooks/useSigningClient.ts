import { useContext } from 'react';
import { SignerClientContext } from 'src/contexts/signerClient';

function useSigningClient() {
  const { signingClient } = useContext(SignerClientContext);
  return { signingClient };
}

export default useSigningClient;

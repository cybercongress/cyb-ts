import { useBackend } from 'src/contexts/backend';
import { useSigningClient } from 'src/contexts/signerClient';

const withIpfsAndKeplr = (Component) => (props) => {
  const { ipfsNode } = useBackend();
  const { signer, signingClient } = useSigningClient();

  return (
    <Component
      {...props}
      node={ipfsNode}
      signer={signer}
      signingClient={signingClient}
    />
  );
};

export default withIpfsAndKeplr;

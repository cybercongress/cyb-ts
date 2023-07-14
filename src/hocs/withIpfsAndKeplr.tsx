import { useIpfs } from 'src/contexts/ipfs';
import { useSigningClient } from 'src/contexts/signerClient';

const withIpfsAndKeplr = (Component) => (props) => {
  const { node } = useIpfs();
  const { signer, signingClient } = useSigningClient();

  return (
    <Component
      {...props}
      node={node}
      signer={signer}
      signingClient={signingClient}
    />
  );
};

export default withIpfsAndKeplr;

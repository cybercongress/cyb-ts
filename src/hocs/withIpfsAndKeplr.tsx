import { useBackend } from 'src/contexts/backend/backend';
import { useSigningClient } from 'src/contexts/signerClient';

const withIpfsAndKeplr = (Component) => (props) => {
  const { ipfsApi, senseApi } = useBackend();
  const { signer, signingClient } = useSigningClient();

  return (
    <Component
      {...props}
      ipfsApi={ipfsApi}
      signer={signer}
      signingClient={signingClient}
      senseApi={senseApi}
    />
  );
};

export default withIpfsAndKeplr;

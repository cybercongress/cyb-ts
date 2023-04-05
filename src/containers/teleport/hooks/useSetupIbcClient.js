/* eslint-disable no-restricted-syntax */
import { useState, useEffect } from 'react';
import { SigningStargateClient } from '@cosmjs/stargate';
import { getKeplr } from '../../ibc/useSetupIbc';
import { CYBER } from '../../../utils/config';
import useGetBalancesIbc from './useGetBalancesIbc';

import networks from '../../../utils/networkListIbc';
import useSigningClient from 'src/hooks/useSigningClient';

function useSetupIbcClient(denom, network) {
  const { signingClient } = useSigningClient();
  const [ibcClient, setIbcClient] = useState(null);
  const { balanceIbc, denomIbc } = useGetBalancesIbc(ibcClient, denom);

  useEffect(() => {
    const createClient = async () => {
      setIbcClient(null);

      let client = null;
      if (network && network !== CYBER.CHAIN_ID) {
        const keplr = await getKeplr();
        const { rpc, prefix, chainId } = networks[network];
        await keplr.enable(chainId);
        const offlineSigner = await keplr.getOfflineSignerAuto(chainId);
        const options = { prefix };
        client = await SigningStargateClient.connectWithSigner(
          rpc,
          offlineSigner,
          options
        );
      } else {
        client = signingClient;
      }
      setIbcClient(client);
    };
    createClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network, signingClient]);

  return { ibcClient, balanceIbc, denomIbc };
}

export default useSetupIbcClient;

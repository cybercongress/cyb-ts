/* eslint-disable no-restricted-syntax */
import { useState, useEffect } from 'react';
import { GasPrice, SigningStargateClient } from '@cosmjs/stargate';
import { useSigningClient } from 'src/contexts/signerClient';
import { getKeplr } from 'src/utils/keplrUtils';
import { Decimal } from '@cosmjs/math';
import useGetBalancesIbc from './useGetBalancesIbc';

import networks from '../../../utils/networkListIbc';
import { CHAIN_ID } from 'src/constants/config';

function useSetupIbcClient(denom, network) {
  const { signingClient } = useSigningClient();
  const [ibcClient, setIbcClient] = useState(null);
  const { balanceIbc, denomIbc } = useGetBalancesIbc(ibcClient, denom);

  useEffect(() => {
    const createClient = async () => {
      setIbcClient(null);

      let client = null;
      if (network && network !== CHAIN_ID) {
        const keplr = await getKeplr();
        const { rpc, prefix, chainId } = networks[network];
        await keplr.enable(chainId);
        const offlineSigner = await keplr.getOfflineSignerAuto(chainId);

        const chainInfos = await keplr.getChainInfosWithoutEndpoints();
        const chainInfoA = chainInfos.find((item) => item.chainId === chainId);
        const feeCurrenciesA = chainInfoA.feeCurrencies[0];

        const GasPriceA = new GasPrice(
          Decimal.fromUserInput(
            feeCurrenciesA.gasPriceStep?.average.toString() || '0',
            3
          ),
          feeCurrenciesA?.coinMinimalDenom
        );

        const options = { prefix, gasPrice: GasPriceA };
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

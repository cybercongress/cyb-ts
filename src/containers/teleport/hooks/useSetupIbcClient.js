/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import { SigningStargateClient } from '@cosmjs/stargate';
import { networkList } from '../utils';
import coinDecimalsConfig from '../../../utils/configToken';
import { getKeplr } from '../../ibc/useSetupIbc';
import { CYBER } from '../../../utils/config';
import useGetBalancesIbc from './useGetBalancesIbc';

import networks from '../../../utils/networkListIbc';

function useSetupIbcClient(denom, network, keplrCybre) {
  const [ibcClient, setIbcClient] = useState(null);
  const { balanceIbc, denomIbc } = useGetBalancesIbc(ibcClient, denom);

  useEffect(() => {
    const createClient = async () => {
      setIbcClient(null);

      let client = null;
      if (networkList[network] && networkList[network] !== CYBER.CHAIN_ID) {
        const keplr = await getKeplr();
        const { rpc, prefix, chainId } = networks[networkList[network]];
        await keplr.enable(chainId);
        const offlineSigner = await keplr.getOfflineSignerAuto(chainId);
        const options = { prefix };
        client = await SigningStargateClient.connectWithSigner(
          rpc,
          offlineSigner,
          options
        );
      } else {
        client = keplrCybre;
      }
      console.log('client', client);
      setIbcClient(client);
    };
    createClient();
  }, [network, denom]);

  // useEffect(() => {
  //   const createClient = async () => {
  //     setIbcClient(null);
  //     setIbcDenom(null);

  //     let client = null;
  //     if (denom.includes('ibc') && networkList[network] !== CYBER.CHAIN_ID) {
  //       if (Object.prototype.hasOwnProperty.call(coinDecimalsConfig, denom)) {
  //         const keplr = await getKeplr();
  //         const { rpc, prefix } = coinDecimalsConfig[denom];
  //         const chainId = networkList[network];
  //         await keplr.enable(chainId);
  //         const offlineSigner = await keplr.getOfflineSignerAuto(chainId);
  //         const options = { prefix };
  //         client = await SigningStargateClient.connectWithSigner(
  //           rpc,
  //           offlineSigner,
  //           options
  //         );
  //       } else {
  //         client = null;
  //       }
  //     } else {
  //       client = keplrCybre;
  //     }
  //     console.log('client', client);
  //     setIbcClient(client);
  //     setIbcDenom(denom);
  //   };
  //   createClient();
  // }, [network, denom]);

  return { ibcClient, balanceIbc, denomIbc };
}

export default useSetupIbcClient;

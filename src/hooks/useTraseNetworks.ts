import { useEffect, useState } from 'react';
import { Networks } from 'src/types/networks';
import { ObjectKey } from 'src/types/data';
import { Network } from 'src/types/hub';
import { useNetworks } from './useHub';

export function isNativeChainId(chain: string) {
  // temp
  if (chain && Networks[chain.toUpperCase()]) {
    return true;
  }
  return false;
}

const findChainIdInNetworkList = (
  chainId: string,
  networks: ObjectKey<Network>
) => {
  if (Object.prototype.hasOwnProperty.call(networks, chainId)) {
    return networks[chainId];
  }

  return undefined;
};

export const useTraseNetworks = (chainIdTrase: string) => {
  const { networks } = useNetworks();
  const [chainInfo, setChainInfo] = useState({
    chainId: chainIdTrase,
    chainName: chainIdTrase,
    chainIdImageCid: '',
  });

  useEffect(() => {
    if (networks) {
      let infoTemp = {};
      const chainInfoFromList = findChainIdInNetworkList(
        chainIdTrase,
        networks
      );

      if (chainInfoFromList) {
        const {
          chain_id: chainId,
          name: chainName,
          logo: chainIdImageCid,
        } = chainInfoFromList;
        infoTemp = {
          chainId,
          chainName,
          chainIdImageCid,
        };
      }

      if (Object.keys(infoTemp).length > 0) {
        setChainInfo((item) => ({ ...item, ...infoTemp }));
      }
    } else {
      const infoTemp = {
        chainId: chainIdTrase,
        chainName: chainIdTrase,
        chainIdImageCid: '',
      };
      setChainInfo((item) => ({ ...item, ...infoTemp }));
    }
  }, [chainIdTrase, networks]);

  return { chainInfo };
};

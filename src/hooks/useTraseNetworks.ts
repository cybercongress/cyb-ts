import { useEffect, useState } from 'react';
import networkList from '../utils/networksList';
import { useNetworks } from './useHub';
import { ObjectKey } from 'src/types/data';
import { Network } from 'src/types/hub';

export function isNativeChainId(chainId: string) {
  if (chainId) {
    if (chainId.includes('bostrom')) {
      return true;
    }

    if (chainId.includes('space-pussy')) {
      return true;
    }
  }
  return false;
}

const findChainIdInNetworkList = (chainId: string, networks: ObjectKey<Network>) => {
  
  if (Object.prototype.hasOwnProperty.call(networks, chainId)) {
    return networks[chainId]
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

import { useEffect, useState } from 'react';
import networkList from '../utils/networksList';

export function isNativeChainId(chainId) {
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

export const findChainIdInNetworkList = (chainId) => {
  let chainInfo = null;

  const findObj = networkList.find((item) => item.chainId === chainId);

  if (findObj) {
    chainInfo = { ...findObj };
  }

  return chainInfo;
};

export const useTraseNetworks = (chainIdTrase) => {
  const [chainInfo, setChainInfo] = useState({
    chainId: chainIdTrase,
    chainName: chainIdTrase,
    chainIdImageCid: '',
  });

  useEffect(() => {
    if (!isNativeChainId(chainIdTrase)) {
      let infoTemp = {};
      const chainInfoFromList = findChainIdInNetworkList(chainIdTrase);

      if (chainInfoFromList !== null) {
        const { chainId, chainName, chainIdImageCid } = chainInfoFromList;
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
  }, [chainIdTrase]);

  return { chainInfo };
};

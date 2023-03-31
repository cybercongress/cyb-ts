import React, { useContext } from 'react';
import Ipfs, { IpfsContext } from 'src/contexts/ipfs';

function useIpfs() {
  const ipfs = useContext(IpfsContext);
  return ipfs;
}

export default useIpfs;

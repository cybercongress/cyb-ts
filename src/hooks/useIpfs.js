import { useContext } from 'react';
import { IpfsContext } from 'src/contexts/ipfs';

function useIpfs() {
  const ipfs = useContext(IpfsContext);
  return ipfs;
}

export default useIpfs;

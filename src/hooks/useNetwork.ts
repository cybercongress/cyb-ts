import { useContext } from 'react';
import { NetworksContext } from 'src/contexts/networks';

function useNetworks() {
  const NetworksContextData = useContext(NetworksContext);

  return NetworksContextData;
}

export default useNetworks;

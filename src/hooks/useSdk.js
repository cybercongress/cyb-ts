import { useContext } from 'react';
import { SdkQueryClientContext } from 'src/contexts/queryClient';

function useSdk() {
  const { queryClient } = useContext(SdkQueryClientContext);
  return { queryClient };
}

export default useSdk;

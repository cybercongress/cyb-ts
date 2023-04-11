import { useContext } from 'react';
import { IbcDenomContext } from 'src/contexts/ibcDenom';

function useIbcDenom() {
  const IbcDenomData = useContext(IbcDenomContext);

  return IbcDenomData;
}

export default useIbcDenom;

import { useEffect, useState } from 'react';
import { isMobileTablet } from '../utils/utils';

function useIsMobileTablet() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const isMobileRsponse = isMobileTablet();
    setIsMobile(isMobileRsponse);
  }, []);

  return { isMobile };
}

export default useIsMobileTablet;

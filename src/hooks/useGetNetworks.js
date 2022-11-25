import { useState, useEffect } from 'react';

function useGetNetworks() {
  const [dataChain, setDataChain] = useState({});

  useEffect(() => {
    const CHAIN_PARAMS = localStorage.getItem('CHAIN_PARAMS');
    if (CHAIN_PARAMS !== null) {
      const CHAIN_PARAMS_DATA = JSON.parse(CHAIN_PARAMS);
      setDataChain(CHAIN_PARAMS_DATA);
    }
  }, []);

  return { ...dataChain };
}

export default useGetNetworks;

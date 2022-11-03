import { useEffect, useState } from 'react';

function useGetLocalStoge(updateState) {
  const [accounts, setAccounts] = useState(null);

  useEffect(() => {
    const getSigmaLocalStorage = async () => {
      const sigmaLocalStorage = await localStorage.getItem('sigmaAddress');
      if (sigmaLocalStorage !== null) {
        const sigmaLocalStorageData = JSON.parse(sigmaLocalStorage);
        setAccounts(sigmaLocalStorageData);
      }
    };
    getSigmaLocalStorage();
  }, [updateState]);

  return { accounts };
}

export default useGetLocalStoge;

import { useContext } from 'react';
import { DataProviderContext } from 'src/contexts/DataProvider';

function useAppData() {
  const DataProviderData = useContext(DataProviderContext);

  return DataProviderData;
}

export default useAppData;

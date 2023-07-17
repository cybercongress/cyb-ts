import React, { useState, useMemo } from 'react';

import { KeyValues, TableControlProps } from './TableControl';

const saveJsonToLocalStorage = (
  storageKey: string,
  data: { [key: string]: KeyValues }
) => {
  localStorage.setItem(storageKey, JSON.stringify(data));
};

function WithLocalStorage<T extends TableControlProps>(
  WrappedComponent: React.ComponentType<T>,
  storageKey: string
) {
  const [storedData, setStoredData] = useState<{ [key: string]: KeyValues }>(
    JSON.parse(localStorage.getItem(storageKey) || '{}')
  );

  const handleSave = (data: { [key: string]: KeyValues }) => {
    saveJsonToLocalStorage(storageKey, data);
    setStoredData(data);
  };

  return (
    <WrappedComponent {...({ data: storedData, onSave: handleSave } as T)} />
  );
}

export default WithLocalStorage;

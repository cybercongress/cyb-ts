import { useState } from 'react';

// import TableControl from './TableControl';
import { KeyValues } from './TableControl';
import EditableTable from './EditableTable';

const saveDataToLocalStorage = (
  storageKey: string,
  data: { [key: string]: KeyValues }
) => {
  localStorage.setItem(storageKey, JSON.stringify(data));
};

// eslint-disable-next-line import/no-unused-modules
function LocalStorageAsEditableTable({
  storageKey,
  columns,
}: {
  storageKey: string;
  columns: string[];
}) {
  const [storedData, setStoredData] = useState<{ [key: string]: KeyValues }>(
    JSON.parse(localStorage.getItem(storageKey) || '{}')
  );

  const handleSave = (data: { [key: string]: KeyValues }) => {
    saveDataToLocalStorage(storageKey, data);
    setStoredData(data);
  };

  return (
    <EditableTable data={storedData} onSave={handleSave} columns={columns} />
  );
}

export default LocalStorageAsEditableTable;

import { useState } from 'react';

// import TableControl from './TableControl';
import {
  loadDataFromLocalStorage,
  saveDataToLocalStorage,
  KeyValues,
} from 'src/utils/localStorage';
import EditableTable from './EditableTable';

// eslint-disable-next-line import/no-unused-modules
function LocalStorageAsEditableTable({
  storageKey,
  columns,
  onChange,
  defaultData = {},
}: {
  storageKey: string;
  columns: string[];
  onChange?: (items: KeyValues[]) => void;
  defaultData: { [key: string]: KeyValues };
}) {
  const [storedData, setStoredData] = useState<{ [key: string]: KeyValues }>(
    loadDataFromLocalStorage(storageKey, defaultData)
  );

  const handleSave = (data: { [key: string]: KeyValues }) => {
    saveDataToLocalStorage(storageKey, data);
    setStoredData(data);
    onChange && onChange(Object.values(data));
  };

  return (
    <EditableTable data={storedData} onSave={handleSave} columns={columns} />
  );
}

export default LocalStorageAsEditableTable;

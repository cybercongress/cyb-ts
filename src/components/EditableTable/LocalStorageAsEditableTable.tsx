import { useState } from 'react';

// import TableControl from './TableControl';
import {
  loadDataFromLocalStorage,
  saveDataToLocalStorage,
} from 'src/utils/localStorage';
import { ObjKeyValue } from 'src/types/data';
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
  onChange?: (items: ObjKeyValue[]) => void;
  defaultData: { [key: string]: ObjKeyValue };
}) {
  const [storedData, setStoredData] = useState<{ [key: string]: ObjKeyValue }>(
    loadDataFromLocalStorage(storageKey, defaultData)
  );

  const handleSave = (data: { [key: string]: ObjKeyValue }) => {
    saveDataToLocalStorage(storageKey, data);
    setStoredData(data);
    onChange && onChange(Object.values(data));
  };

  return (
    <EditableTable data={storedData} onSave={handleSave} columns={columns} />
  );
}

export default LocalStorageAsEditableTable;

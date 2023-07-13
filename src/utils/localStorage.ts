export type KeyValues = { [key: string]: string };

type TableData = { [key: string]: KeyValues };
const STORAGE_KEYS = {
  secrets: 'secrets',
  botConfig: 'chat_bot_config',
};

const saveDataToLocalStorage = (
  storageKey: string,
  data: TableData | string | number | boolean
) => {
  localStorage.setItem(storageKey, JSON.stringify(data));
};

const loadDataFromLocalStorage = (storageKey: string, defaultData: any) => {
  const raw = localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : defaultData;
};

const keyValuesToObject = (data: KeyValues[]) => {
  return Object.fromEntries(
    Object.values(data)
      .filter((row) => !!row?.key)
      .map((row) => [row.key, row.value])
  );
};

// const localStorageCache = {
//   [STORAGE_KEYS.secrets]: loadDataFromLocalStorage(STORAGE_KEYS.secrets, {}),
// };

export {
  saveDataToLocalStorage,
  loadDataFromLocalStorage,
  STORAGE_KEYS,
  keyValuesToObject,
};

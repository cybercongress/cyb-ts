import { KeyValueString, TabularKeyValues } from 'src/types/data';
import {
  ScriptEntrypoint,
  ScriptItem,
} from 'src/services/scripting/scritpting';

type JsonTypeKeys = 'secrets' | 'botConfig';

type StringTypeKeys = 'activeBotName' | ScriptEntrypoint;

const jsonKeyMap: Record<JsonTypeKeys, string> = {
  secrets: 'secrets',
  botConfig: 'chat_bot_config',
};

const stringKeyMap: Record<StringTypeKeys, string> = {
  activeBotName: 'active_bot_name',
  particle: 'script_particle',
  myParticle: 'script_my_particle',
};

const saveJsonToLocalStorage = (
  storageKey: JsonTypeKeys,
  data: TabularKeyValues
) => {
  localStorage.setItem(jsonKeyMap[storageKey], JSON.stringify(data));
};

const loadJsonFromLocalStorage = (
  storageKey: JsonTypeKeys,
  defaultData: TabularKeyValues
) => {
  const raw = localStorage.getItem(jsonKeyMap[storageKey]);
  return raw ? JSON.parse(raw) : defaultData;
};

const loadStringFromLocalStorage = (
  name: StringTypeKeys,
  defaultValue?: string
) => localStorage.getItem(stringKeyMap[name]) || defaultValue || '';

const saveStringToLocalStorage = (name: StringTypeKeys, value: string) => {
  localStorage.setItem(stringKeyMap[name], value);
};

const keyValuesToObject = (data: KeyValueString[]) => {
  return Object.fromEntries(
    Object.values(data)
      .filter((row) => !!row?.key)
      .map((row) => [row.key, row.value])
  );
};

export {
  saveJsonToLocalStorage,
  loadJsonFromLocalStorage,
  keyValuesToObject,
  loadStringFromLocalStorage,
  saveStringToLocalStorage,
};

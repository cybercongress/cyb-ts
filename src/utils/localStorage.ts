import { KeyValueString, TabularKeyValues } from 'src/types/data';
import { ScriptEntrypointNames } from 'src/types/scripting';

type JsonTypeKeys = 'secrets' | 'botConfig';

type StringTypeKeys =
  | 'activeBotName'
  | ScriptEntrypointNames
  | `${ScriptEntrypointNames[0]}_enabled`
  | `${ScriptEntrypointNames[1]}_enabled`;

const jsonKeyMap: Record<JsonTypeKeys, string> = {
  secrets: 'secrets',
  botConfig: 'chat_bot_config',
};

const stringKeyMap: Record<StringTypeKeys, string> = {
  activeBotName: 'active_bot_name',
  particle: 'script_particle',
  // myParticle: 'script_particle_inference',
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
) => {
  const keyName = stringKeyMap[name] || name;
  const result = localStorage.getItem(keyName) || defaultValue || '';
  return result;
};

const saveStringToLocalStorage = (name: StringTypeKeys, value: string) => {
  const keyName = stringKeyMap[name] || name;
  localStorage.setItem(keyName, value);
};

const keyValuesToObject = (data: KeyValueString[]) => {
  return Object.fromEntries(
    Object.values(data)
      .filter((row) => !!row?.key)
      .map((row) => [row.key, row.value])
  );
};

const getEntrypointKeyName = (
  name: ScriptEntrypointNames,
  prefix: 'enabled'
): StringTypeKeys => `${name}_${prefix}`;

export {
  saveJsonToLocalStorage,
  loadJsonFromLocalStorage,
  keyValuesToObject,
  loadStringFromLocalStorage,
  saveStringToLocalStorage,
  getEntrypointKeyName,
};

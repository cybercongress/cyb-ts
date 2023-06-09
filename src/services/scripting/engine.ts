/* eslint-disable import/no-unused-modules */
import { CyberClient } from '@cybercongress/cyber-js';
import initAsync, { initSync, compile } from 'rune';
import { AppIPFS } from 'src/utils/ipfs/ipfs';
import { v4 as uuidv4 } from 'uuid';
import defaultScripts from 'raw-loader!./scripts/default.rn';

const compileConfig = {
  budget: 1_000_000,
  experimental: false,
  instructions: true,
  options: [],
};

let rune;
let ipfs: AppIPFS;
let cyberClient: CyberClient;

export let isCyberScriptingLoaded = false;

export const setIpfs = (appIPFS: AppIPFS) => {
  ipfs = appIPFS;
};

export const setCyberClient = (cyber: CyberClient) => {
  cyberClient = cyber;
};

export const getIpfs = () => ipfs;
export const getCyberClient = () => cyberClient;

export const loadCyberScripingEngine = async () => {
  rune = await initAsync();
  window.rune = rune;
  console.log('⚡️ Rune initialized! 🔋');
  isCyberScriptingLoaded = true;
  return rune;
};

type ScriptCallbackStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'canceled'
  | 'error';

export type ScriptCallback = (
  refId: string,
  status: ScriptCallbackStatus,
  result: any
) => void;

const scriptCallbacks = new Map<string, ScriptCallback>();

export const executeCallback = (
  refId: string,
  status: ScriptCallbackStatus,
  result: any
): void => {
  const cb = scriptCallbacks.get(refId);
  cb && cb(refId, status, result);

  // if (['canceled', 'error', 'done'].indexOf(status) > -1) {
  //   scriptCallbacks.delete(refId);
  // }
};

export const runScript = async (
  code: string,
  callback: ScriptCallback,
  refId?: string
) => {
  // console.log('runeRun before', code, refId, callback);
  const paramRefId = refId || uuidv4().toString();
  scriptCallbacks.set(paramRefId, callback);
  const result = await compile(
    code,
    compileConfig,
    paramRefId,
    defaultScripts,
    { cid: 'xxx' }
  );
  console.log('----res', result);
  console.log('runeRun result', result, code);
  if (result.error) {
    console.log('runeRun error', result.error);
    throw Error(result.error);
  }

  scriptCallbacks.delete(paramRefId);

  return result.result;
};

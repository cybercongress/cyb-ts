/* eslint-disable import/no-unused-modules */
import { CyberClient } from '@cybercongress/cyber-js';
import initAsync, { compile } from 'rune';

import { AppIPFS } from 'src/utils/ipfs/ipfs';
import { v4 as uuidv4 } from 'uuid';
import defaultScripts from './scripts/default.rn';

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
  console.time('⚡️ Rune initialized! 🔋');
  rune = await initAsync();
  window.rune = rune;
  console.timeEnd('⚡️ Rune initialized! 🔋');
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

type ScriptResult = {
  data: any;
};

type ScriptScopeParams = {
  cid?: string;
  contentType?: string;
  content?: string;
  refId?: string;
};

type ScriptExecutionData = {
  error?: string;
  result?: any;
  diagnosticsOutput?: string;
  output?: string;
  // diagnostics: Object[];
  // instructions: string;
};

export const runScript = async (
  code: string,
  params: ScriptScopeParams = {},
  callback?: ScriptCallback,
  runtimeScript?: defaultScripts
): Promise<ScriptExecutionData> => {
  // console.log('runeRun before', code, refId, callback);
  const paramRefId = params.refId || uuidv4().toString();

  callback && scriptCallbacks.set(paramRefId, callback);

  // input: String, config: JsValue, ref_id: String, scripts:  String, params: JsValue
  const outputData = await compile(
    code,
    compileConfig,
    paramRefId,
    defaultScripts,
    params
  );
  const { result, output, error, diagnostics_output } = outputData;

  console.log('runeRun result', result, code);
  // if (result.error) {
  //   console.log('runeRun error', result.error);
  //   throw Error(result.error);
  // }

  scriptCallbacks.delete(paramRefId);

  return {
    result: result ? JSON.parse(result) : null,
    output,
    error,
    diagnosticsOutput: diagnostics_output,
  };
};

type ReactToParticleResult = {
  action: 'pass' | 'update' | 'skip' | 'error';
  cid?: string;
  content?: string;
};

export const reactToParticle = async (
  cid: string,
  contentType: string,
  content: string
): Promise<ReactToParticleResult> => {
  // const injectCode = `react_to_particle("${cid}", "${contentType}", "${content}")`;
  const scriptCode = `
  pub async fn main(refId) {
    let ctx = cyb::context;
    react_to_particle(ctx.cid, ctx.contentType, ctx.content).await
  }`;

  const result = await runScript(scriptCode, { cid, contentType, content });
  if (result.error) {
    console.log('---error', result);
    return { action: 'error' };
  }

  return result.result;
};

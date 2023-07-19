/* eslint-disable import/no-unused-modules */
import initAsync, { compile } from 'cyb-rune-wasm';

import { v4 as uuidv4 } from 'uuid';
import scriptParticleDefault from './scripts/default/particle.rn';
import scriptParticleRuntime from './scripts/runtime/particle.rn';
import { appContextManager } from './bus';
import {
  ScriptEntrypoint,
  ScriptItem,
  ScriptCallback,
  ScriptCallbackStatus,
  ScriptScopeParams,
  ScriptExecutionData,
} from './scritpting';

const compileConfig = {
  budget: 1_000_000,
  experimental: false,
  instructions: true,
  options: [],
};

let rune;

export const loadCyberScripingEngine = async () => {
  console.time('⚡️ Rune initialized! 🔋');
  rune = await initAsync();
  window.rune = rune;
  console.timeEnd('⚡️ Rune initialized! 🔋');
  return rune;
};

// export const loadScript = (scriptName: ScriptEntrypoint) =>
//   localStorage.getItem(`script_${scriptName}`);

// export const saveScript = (
//   scriptName: ScriptEntrypoint,
//   scriptCode: string
// ) => {
//   localStorage.setItem(`script_${scriptName}`, scriptCode);
//   scriptItemStorage[scriptName].user = scriptCode;
// };

// // Scripts cached to use on demand
// // Runtime - cyber scripts to hide extra functionality
// // User - user written scripts(or default)
// export const scriptItemStorage: Record<ScriptEntrypoint, ScriptItem> = {
//   particle: {
//     name: 'Particle post processor',
//     runtime: scriptParticleRuntime,
//     user: loadScript('particle') || scriptParticleDefault,
//   },
//   myParticle: {
//     name: 'My particle',
//     runtime: scriptParticleRuntime,
//     user: loadScript('particle') || scriptParticleDefault,
//   },
// };

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
  scriptCode: string,
  params: ScriptScopeParams = {},
  runtimeScript?: string,
  callback?: ScriptCallback,
  executeAfterCompile: boolean
): Promise<ScriptExecutionData> => {
  // console.log('runeRun before', code, refId, callback);
  const paramRefId = params.refId || uuidv4().toString();

  callback && scriptCallbacks.set(paramRefId, callback);
  // console.log('-------compile', {
  //   ...params,
  //   app: appContextManager.context,
  //   refId: paramRefId,
  // });
  const outputData = await compile(
    scriptCode,
    compileConfig,
    runtimeScript || '',
    {
      ...params,
      app: appContextManager.context,
      refId: paramRefId,
    },
    executeAfterCompile
  );
  const {
    result,
    output,
    error,
    diagnostics_output,
    instructions,
    diagnostics,
  } = outputData;

  // console.log('runeRun result', result, code);
  // if (result.error) {
  //   console.log('runeRun error', result.error);
  //   throw Error(result.error);
  // }

  scriptCallbacks.delete(paramRefId);
  try {
    return {
      result: result ? JSON.parse(result) : null,
      output,
      error,
      diagnosticsOutput: diagnostics_output,
      instructions,
      diagnostics,
    };
  } catch (e) {
    console.log('runeRun error', e, outputData);
    return {
      diagnosticsOutput: e.toString(),
    };
  }
};

type ReactToParticleResult = {
  action: 'pass' | 'update_cid' | 'update_content' | 'hide' | 'error';
  cid?: string;
  content?: string;
};

type ReactToInputResult = {
  action: 'pass' | 'answer' | 'error';
  answer?: string;
  nickname: string;
};

const reactToParticle = async (
  cid: string,
  contentType: string,
  content: string
): Promise<ReactToParticleResult> => {
  // const injectCode = `react_to_particle("${cid}", "${contentType}", "${content}")`;

  if (!appContextManager.deps.queryClient) {
    throw Error('Cyber queryClient is not set');
  }

  const scriptResult = await runScript(
    appContextManager.entrypoints.particle.user,
    {
      particle: {
        cid,
        contentType: contentType || '',
        content,
      },
    },
    appContextManager.entrypoints.particle.runtime,
    undefined,
    true
  );
  if (scriptResult.error) {
    console.log(`---reactToParticle ${cid} error: `, scriptResult);
    return { action: 'error' };
  }

  if (scriptResult.result?.action !== 'pass') {
    // console.log(`---reactToParticle ${cid} output: `, scriptResult);
  }

  // console.log('----react to particle', cid, contentType, content, result);
  return scriptResult.result;
};

const reactToInput = async (input: string): Promise<ReactToInputResult> => {
  // const injectCode = `react_to_particle("${cid}", "${contentType}", "${content}")`;

  if (!appContextManager.deps.queryClient) {
    throw Error('Cyber queryClient is not set');
  }

  const scriptResult = await runScript(
    appContextManager.entrypoints['my-particle'].user,
    {
      myParticle: {
        input,
      },
    },
    appContextManager.entrypoints['my-particle'].runtime,
    undefined,
    true
  );

  if (scriptResult.error) {
    return { action: 'error' };
  }

  return scriptResult.result;
};

export type { ReactToInputResult, ReactToParticleResult };

export { reactToParticle, reactToInput };

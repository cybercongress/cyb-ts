import initAsync, { compile } from 'cyb-rune-wasm';

import { v4 as uuidv4 } from 'uuid';

import { TabularKeyValues } from 'src/types/data';
import { keyValuesToObject } from 'src/utils/localStorage';

import { mapObjIndexed } from 'ramda';
import { removeBrokenUnicode } from 'src/utils/string';

import { extractRuneScript } from './helpers';

import {
  ScriptCallback,
  ScriptParticleParams,
  ScriptContext,
  ScriptParticleResult,
  // ScriptMyParticleParams,
  ScriptEntrypoints,
  ScriptExecutionResult,
  EntrypointParams,
  EngineContext,
  ScriptMyCampanion,
} from './types';

import runtimeScript from './rune/runtime.rn';

const compileConfig = {
  budget: 1_000_000,
  experimental: false,
  instructions: true,
  options: [],
};

type CompilerParams = {
  readOnly: boolean;
  execute: boolean;
  funcName: string;
  funcParams: EntrypointParams;
  config: typeof compileConfig;
};

const toRecord = (item: TabularKeyValues) =>
  keyValuesToObject(Object.values(item));

export type LoadParams = {
  entrypoints: ScriptEntrypoints;
  secrets: TabularKeyValues;
};

export interface RuneEngine {
  pushContext<K extends keyof ScriptContext>(
    key: K,
    value: ScriptContext[K]
  ): void;
  popContext(names: (keyof ScriptContext)[]): void;
  setEntrypoints(entrypoints: ScriptEntrypoints): void;
  // getSingleDep<T extends keyof EngineDeps>(name: T): EngineDeps[T];

  load(params: LoadParams): Promise<void>;

  run(
    script: string,
    compileParams: Partial<CompilerParams>,
    callback?: ScriptCallback
  ): Promise<ScriptExecutionResult>;
  askCompanion(
    cid: string,
    contentType: string,
    content: string,
    callback?: ScriptCallback
  ): Promise<ScriptMyCampanion>;
  personalProcessor(
    params: ScriptParticleParams
  ): Promise<ScriptParticleResult>;
  executeFunction(
    script: string,
    funcName: string,
    params: EntrypointParams
  ): Promise<ScriptParticleResult>;
  executeCallback(refId: string, data: any): Promise<void>;
}

// eslint-disable-next-line import/prefer-default-export
function enigine(): RuneEngine {
  let entrypoints: Partial<ScriptEntrypoints> = {};
  let context: EngineContext = { params: {}, user: {}, secrets: {} };

  const scriptCallbacks = new Map<string, ScriptCallback>();

  let rune;

  const load = async (params: LoadParams) => {
    entrypoints = params.entrypoints;
    pushContext('secrets', params.secrets);
    console.log('-----------rune engine initializing');
    console.time('⚡️ Rune initialized! 🔋');
    rune = await initAsync();
    // window.rune = rune; // debug
    console.timeEnd('⚡️ Rune initialized! 🔋');
  };

  const pushContext = <K extends keyof ScriptContext>(
    name: K,
    value: ScriptContext[K] | TabularKeyValues
  ) => {
    if (name === 'secrets') {
      context[name] = toRecord(value as TabularKeyValues);
      return;
    }

    context[name] = value;
  };

  const popContext = (names: (keyof ScriptContext)[]) => {
    const newContext = context;
    names.forEach((name) => {
      newContext[name] = {};
    });
    context = newContext;
  };

  const setEntrypoints = (scriptEntrypoints: ScriptEntrypoints) => {
    entrypoints = mapObjIndexed(
      (v) => ({ ...v, script: extractRuneScript(v.script) }),
      scriptEntrypoints
    );
  };

  const defaultCompilerParams: CompilerParams = {
    readOnly: false,
    execute: true,
    funcName: 'main',
    funcParams: {},
    config: compileConfig,
  };

  const run = async (
    script: string,
    compileParams: Partial<CompilerParams>,
    callback?: ScriptCallback
  ) => {
    const refId = uuidv4().toString();

    callback && scriptCallbacks.set(refId, callback);
    const scriptParams = {
      app: context,
      refId,
    };
    const compilerParams = {
      ...defaultCompilerParams,
      ...compileParams,
    };
    const outputData = await compile(
      script,
      runtimeScript,
      scriptParams,
      compilerParams
    );
    const { result, error } = outputData;

    try {
      scriptCallbacks.delete(refId);

      return {
        ...outputData,
        error,
        result: result
          ? JSON.parse(removeBrokenUnicode(result))
          : { action: 'error', message: 'No result' },
      };
    } catch (e) {
      scriptCallbacks.delete(refId);

      console.log(
        `engine.run err ${compilerParams.funcName}`,
        e,
        outputData,
        compilerParams
      );
      return {
        diagnosticsOutput: `scripting engine error ${e}`,
        ...outputData,
        result: { action: 'error', message: e?.toString() || 'Unknown error' },
      };
    }
  };

  const getParticleScriptOrAction = ():
    | ['error' | 'pass' | 'script', string] => {
    if (!entrypoints.particle) {
      return ['error', ''];
    }

    const { script, enabled } = entrypoints.particle;

    if (!enabled) {
      return ['pass', ''];
    }

    return ['script', script];
  };

  const personalProcessor = async (
    params: ScriptParticleParams
  ): Promise<ScriptParticleResult> => {
    const [resultType, script] = getParticleScriptOrAction();

    if (resultType === 'error') {
      return { action: 'error', message: 'No particle entrypoint' };
    }

    if (resultType !== 'script') {
      return { action: 'pass' };
    }

    const { cid, contentType, content } = params;
    const output = await run(script, {
      funcName: 'personal_processor',
      funcParams: [cid, contentType, content], //params as EntrypointParams,
    });

    const { action, content: outputContent } = output.result;

    if (action === 'error') {
      console.error(
        `RUNE: personalProcessor error: ${params.cid}`,
        params,
        output
      );
    }

    if (outputContent) {
      return { ...output.result, content: outputContent };
    }

    return output.result;
  };

  const executeFunction = async (
    script: string,
    funcName: string,
    funcParams: EntrypointParams
  ): Promise<ScriptParticleResult> => {
    const output = await run(script, {
      funcName,
      funcParams,
      readOnly: true, // block to sign tx and add to ipfs
    });

    return output.result;
  };

  // const particleInference = async (
  //   userScript: string,
  //   funcParams: EntrypointParams
  // ): Promise<ScriptMyParticleResult> => {
  //   const output = await run(userScript, {
  //     funcName: 'particle_inference',
  //     funcParams,
  //   });

  //   return output.result;
  // };

  const askCompanion = async (
    cid: string,
    contentType: string,
    content: string,
    callback?: ScriptCallback
  ): Promise<ScriptMyCampanion> => {
    const [resultType, script] = getParticleScriptOrAction();
    if (resultType === 'error') {
      return {
        action: 'error',
        metaItems: [{ type: 'text', text: 'No particle entrypoint' }],
      };
    }

    if (resultType === 'pass') {
      return { action: 'pass', metaItems: [] };
    }

    const output = await run(
      script,
      {
        funcName: 'ask_companion',
        funcParams: [cid, contentType, content],
      },
      callback
    );
    console.log('=====ask', cid, contentType, content, output.result);
    if (output.result.action === 'error') {
      return {
        action: 'error',
        metaItems: [{ type: 'text', text: output.error }],
      };
    }

    return { action: 'answer', metaItems: output.result.content };
  };

  const executeCallback = async (refId: string, data: any) => {
    const callback = scriptCallbacks.get(refId);

    if (callback) {
      await callback(data);
    }
  };

  return {
    load,
    run,
    // particleInference,
    askCompanion,
    personalProcessor,
    setEntrypoints,
    pushContext,
    popContext,
    executeFunction,
    executeCallback,
    getDebug: () => ({
      context,
      entrypoints,
    }),
  };
}

const scriptEngine = enigine();

export default scriptEngine;

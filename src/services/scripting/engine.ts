import {
  ScriptCallback,
  ScriptParticleParams,
  ScriptContext,
  ScriptMyParticleResult,
  ScriptParticleResult,
  ScriptMyParticleParams,
  ScriptEntrypoints,
  ScriptExecutionResult,
  EntrypointParams,
  EngineContext,
} from 'src/types/scripting';
import initAsync, { compile } from 'cyb-rune-wasm';

import { v4 as uuidv4 } from 'uuid';

import { AppIPFS } from 'src/utils/ipfs/ipfs';
import { CyberClient } from '@cybercongress/cyber-js';
import {
  OfflineSigner,
  SigningCyberClient,
} from '@cybercongress/cyber-js/build/signingcyberclient';
import { TabularKeyValues, KeyValueString } from 'src/types/data';
import { keyValuesToObject } from 'src/utils/localStorage';
import runtimeScript from './rune/runtime.rn';

const compileConfig = {
  budget: 1_000_000,
  experimental: false,
  instructions: true,
  options: [],
};

export type CompilerParams = {
  readOnly: boolean;
  execute: boolean;
  funcName: string;
  funcParams: EntrypointParams;
  config: typeof compileConfig;
};

// | { name: 'ipfs'; item: AppIPFS }
// | { name: 'queryClient'; item: CyberClient }
// | {
//     name: 'signer';
//     item: { signer?: OfflineSigner; signingClient: SigningCyberClient };
//   };

const toRecord = (item: TabularKeyValues) =>
  keyValuesToObject(Object.values(item));

type EngineDeps = {
  ipfs?: AppIPFS;
  queryClient?: CyberClient;
  signer?: OfflineSigner;
  signingClient?: SigningCyberClient;
};

type LoadParams = {
  entrypoints: ScriptEntrypoints;
  secrets: TabularKeyValues;
};

interface Engine {
  pushContext<K extends keyof ScriptContext>(
    key: K,
    value: ScriptContext[K]
  ): void;
  popContext(names: (keyof ScriptContext)[]): void;
  setEntrypoints(entrypoints: ScriptEntrypoints): void;
  setDeps(deps: Partial<EngineDeps>): void;
  getDeps(): EngineDeps;
  getSingleDep<T extends keyof EngineDeps>(name: T): EngineDeps[T];

  load(params: LoadParams): Promise<void>;

  run(
    script: string,
    compileParams: Partial<CompilerParams>,
    callback?: ScriptCallback
  ): Promise<ScriptExecutionResult>;
  particleInference(
    userScript: string,
    params: ScriptMyParticleParams
  ): Promise<ScriptMyParticleResult>;
  personalProcessor(
    params: ScriptParticleParams
  ): Promise<ScriptParticleResult>;
  executeFunction(
    script: string,
    funcName: string,
    params: EntrypointParams
  ): Promise<ScriptParticleResult>;
}

// eslint-disable-next-line import/prefer-default-export
function enigine(): Engine {
  let entrypoints: ScriptEntrypoints = {};
  let context: EngineContext = { params: {}, user: {}, secrets: {} };
  let deps: EngineDeps;

  const scriptCallbacks = new Map<string, ScriptCallback>();

  let rune;

  const load = async (params: LoadParams) => {
    entrypoints = params.entrypoints;
    pushContext('secrets', params.secrets);

    console.time('⚡️ Rune initialized! 🔋');
    rune = await initAsync();
    window.rune = rune; // debug
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

  const getDeps = () => deps;

  const setDeps = (appDeps: Partial<EngineDeps>) => {
    deps = { ...deps, ...appDeps };
  };

  const getSingleDep = (name: keyof EngineDeps) => deps[name];

  const setEntrypoints = (scriptEntrypoints: ScriptEntrypoints) => {
    entrypoints = scriptEntrypoints;
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
    const { result } = outputData;

    scriptCallbacks.delete(refId);

    try {
      return {
        ...outputData,
        result: result
          ? JSON.parse(result)
          : { action: 'error', message: 'No result' },
      };
    } catch (e) {
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

  const personalProcessor = async (
    params: ScriptParticleParams
  ): Promise<ScriptParticleResult> => {
    if (!entrypoints.particle) {
      return { action: 'error', message: 'No particle entrypoint' };
    }

    const { script, enabled } = entrypoints.particle;

    if (!enabled) {
      return { action: 'pass' };
    }

    const output = await run(script, {
      funcName: 'personal_processor',
      funcParams: params as EntrypointParams,
    });

    if (output.result.action !== 'pass') {
      console.log(`personalProcessor ${params.cid}`, params, output);
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

  const particleInference = async (
    userScript: string,
    funcParams: EntrypointParams
  ): Promise<ScriptMyParticleResult> => {
    const output = await run(userScript, {
      funcName: 'particle_inference',
      funcParams,
    });

    return output.result;
  };

  return {
    load,
    run,
    particleInference,
    personalProcessor,
    setEntrypoints,
    getDeps,
    getSingleDep,
    setDeps,
    pushContext,
    popContext,
    executeFunction,
    getDebug: () => ({
      context,
      entrypoints,
    }),
  };
}

const scriptEngine = enigine();
window.ngn = scriptEngine; // debug
export default scriptEngine;

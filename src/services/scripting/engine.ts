import {
  ScriptCallback,
  ScriptEntrypointNames,
  ScriptEntrypoint,
  ScriptParticleParams,
  ScriptContext,
  ScriptMyParticleResult,
  ScriptParticleResult,
  ScriptMyParticleParams,
  ScriptEntrypoints,
  ScriptExecutionResult,
  EntrypointParams,
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
import scriptingRuntime from './scripts/runtime.rn';

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

type EngineContext = Omit<ScriptContext, 'secrets'> & {
  secrets: KeyValueString;
};

// | { name: 'ipfs'; item: AppIPFS }
// | { name: 'queryClient'; item: CyberClient }
// | {
//     name: 'signer';
//     item: { signer?: OfflineSigner; signingClient: SigningCyberClient };
//   };

const getEntrypointScripts = (
  entrypoints: ScriptEntrypoints,
  name: ScriptEntrypointNames
) => {
  if (!entrypoints[name]) {
    throw Error(`No '${name}' script exist`);
  }

  const { script: user, enabled } = entrypoints[name] as ScriptEntrypoint;
  return { script: user, enabled };
};

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
    compilerParams: Partial<CompilerParams>,
    callback?: ScriptCallback
  ): Promise<ScriptExecutionResult>;
  reactToInput(
    userScript: string,
    params: ScriptMyParticleParams
  ): Promise<ScriptMyParticleResult>;
  reactToParticle(params: ScriptParticleParams): Promise<ScriptParticleResult>;
  executeFunction(
    script: string,
    funcName: string,
    params: EntrypointParams
  ): Promise<ScriptParticleResult>;
}

// eslint-disable-next-line import/prefer-default-export
function enigine(): Engine {
  let entrypoints: ScriptEntrypoints | undefined;
  let context: EngineContext = { params: {}, user: {}, secrets: {} };
  let deps: EngineDeps;

  const scriptCallbacks = new Map<string, ScriptCallback>();

  let rune;

  const load = async (params: LoadParams) => {
    entrypoints = params.entrypoints;
    pushContext('secrets', params.secrets);

    console.time('⚡️ Rune initialized! 🔋');
    rune = await initAsync();
    window.rune = rune;
    console.timeEnd('⚡️ Rune initialized! 🔋');
  };

  const pushContext = <K extends keyof ScriptContext>(
    name: K,
    value: ScriptContext[K]
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

  const run = async (
    script: string,
    compilerParams: Partial<CompilerParams>,
    callback?: ScriptCallback
  ) => {
    const refId = uuidv4().toString();

    callback && scriptCallbacks.set(refId, callback);
    const scriptParams = {
      app: context,
      refId,
    };

    const defaultCompilerParams: CompilerParams = {
      readOnly: false,
      execute: true,
      funcName: 'main',
      funcParams: {},
      config: compileConfig,
    };

    const outputData = await compile(script, scriptingRuntime, scriptParams, {
      ...defaultCompilerParams,
      ...compilerParams,
    });
    // console.log(`------ run ${funcName} outputData`, outputData);
    const { result } = outputData;

    scriptCallbacks.delete(refId);

    try {
      return {
        ...outputData,
        result: result ? JSON.parse(result) : null,
      };
    } catch (e) {
      console.log('runeRun error', e, outputData);
      return {
        diagnosticsOutput: `scripting engine error ${e}`,
        ...outputData,
      };
    }
  };

  const reactToParticle = async (
    params: ScriptParticleParams
  ): Promise<ScriptParticleResult> => {
    const { script, enabled } = entrypoints['particle'];

    if (!enabled) {
      return { action: 'pass' };
    }

    const scriptResult = await run(script, {
      funcName: 'personal_processor',
      funcParams: params as EntrypointParams,
    });
    if (scriptResult.error) {
      console.log(`---reactToParticle ${params.cid} error: `, scriptResult);
      return { action: 'error' };
    }

    // if (scriptResult.result?.action !== 'pass') {
    // }

    return scriptResult.result;
  };

  const executeFunction = async (
    script: string,
    funcName: string,
    funcParams: EntrypointParams
  ): Promise<ScriptParticleResult> => {
    const scriptResult = await run(script, {
      funcName,
      funcParams,
      readOnly: true, // don't allow to sign tx and add to ipfs
    });

    if (scriptResult.error) {
      console.log(
        `---executeFunction ${funcName} error: `,
        funcParams,
        scriptResult
      );
      return { action: 'error' };
    }

    return scriptResult.result;
  };

  const reactToInput = async (
    userScript: string,
    params: ScriptMyParticleParams
  ): Promise<ScriptMyParticleResult> => {
    const { script } = entrypoints?.myParticle;

    const scriptResult = await run(script, {
      funcName: 'particle_inference',
      funcParams: params as EntrypointParams,
    });

    if (scriptResult.error) {
      return { action: 'error' };
    }

    return scriptResult.result;
  };

  return {
    load,
    run,
    reactToInput,
    reactToParticle,
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
window.ngn = scriptEngine;
export default scriptEngine;

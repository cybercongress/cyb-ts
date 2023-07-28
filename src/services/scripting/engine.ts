import {
  ScriptCallback,
  ScriptEntrypointNames,
  ScriptEntrypoint,
  ScriptParticleParams,
  ScriptScopeParams,
  ScriptContext,
  ScriptMyParticleResult,
  ScriptParticleResult,
  ScriptMyParticleParams,
  ScriptEntrypoints,
  ScriptExecutionResult,
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

const compileConfig = {
  budget: 1_000_000,
  experimental: false,
  instructions: true,
  options: [],
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

  const { user, runtime } = entrypoints[name] as ScriptEntrypoint;
  return { userScript: user, runtimeScript: runtime };
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
    params: ScriptScopeParams,
    scriptRuntime: string,
    callback?: ScriptCallback,
    executeAfterCompile?: boolean
  ): Promise<ScriptExecutionResult>;
  reactToInput(
    userScript: string,
    params: ScriptMyParticleParams
  ): Promise<ScriptMyParticleResult>;
  reactToParticle(params: ScriptParticleParams): Promise<ScriptParticleResult>;
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
    params: ScriptScopeParams,
    scriptRuntime = '',
    callback?: ScriptCallback,
    executeAfterCompile?: boolean
  ) => {
    const paramRefId = params.refId || uuidv4().toString();

    callback && scriptCallbacks.set(paramRefId, callback);

    const outputData = await compile(
      script,
      compileConfig,
      scriptRuntime,
      {
        ...params,
        app: context,
        refId: paramRefId,
      },
      executeAfterCompile || false
    );
    const { result } = outputData;
    //TODO: refactor
    outputData.diagnosticsOutput = outputData.diagnostics_output;
    delete outputData.diagnostics_output;
    scriptCallbacks.delete(paramRefId);

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
    const { userScript, runtimeScript } = getEntrypointScripts(
      entrypoints,
      'particle'
    );

    const scriptResult = await run(
      userScript,
      {
        particle: params,
      },
      runtimeScript,
      undefined,
      true
    );
    if (scriptResult.error) {
      console.log(`---reactToParticle ${params.cid} error: `, scriptResult);
      return { action: 'error' };
    }

    if (scriptResult.result?.action !== 'pass') {
    }

    return scriptResult.result;
  };

  const reactToInput = async (
    userScript: string,
    params: ScriptMyParticleParams
  ): Promise<ScriptMyParticleResult> => {
    const { runtimeScript } = getEntrypointScripts(entrypoints, 'myParticle');

    const scriptResult = await run(
      userScript,
      {
        myParticle: params,
      },
      runtimeScript,
      undefined,
      true
    );
    console.log('-------reactToInput scriptResult', scriptResult);

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
    getDebug: () => ({
      context,
      entrypoints,
    }),
  };
}

const scriptEngine = enigine();
window.ngn = scriptEngine;
export default scriptEngine;

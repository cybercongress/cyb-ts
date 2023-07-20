import {
  ScriptCallback,
  ScriptEntrypoint,
  ScriptEntrypoints,
  ScriptItem,
  ScriptParticleParams,
  ScriptScopeParams,
  ScriptingContext,
  ReactToInputResult,
  ReactToParticleResult,
  ScriptMyParticleParams,
} from 'src/types/scripting';
import initAsync, { compile } from 'cyb-rune-wasm';

import { v4 as uuidv4 } from 'uuid';

import { AppIPFS } from 'src/utils/ipfs/ipfs';
import { CyberClient } from '@cybercongress/cyber-js';
import {
  OfflineSigner,
  SigningCyberClient,
} from '@cybercongress/cyber-js/build/signingcyberclient';

const compileConfig = {
  budget: 1_000_000,
  experimental: false,
  instructions: true,
  options: [],
};

// | { name: 'ipfs'; item: AppIPFS }
// | { name: 'queryClient'; item: CyberClient }
// | {
//     name: 'signer';
//     item: { signer?: OfflineSigner; signingClient: SigningCyberClient };
//   };

const getEntrypointScripts = (
  entrypoints: ScriptEntrypoints,
  name: ScriptEntrypoint
) => {
  if (!entrypoints[name]) {
    throw Error(`No '${name}' script exist`);
  }

  const { user, runtime } = entrypoints[name] as ScriptItem;
  return { userScript: user, runtimeScript: runtime };
};

type EngineDeps = {
  ipfs?: AppIPFS;
  queryClient?: CyberClient;
  signer?: OfflineSigner;
  signingClient?: SigningCyberClient;
};

interface Engine {
  setContext(context: Partial<ScriptingContext>): void;
  setEntrypoints(entrypoints: Partial<ScriptEntrypoints>): void;
  setDeps(deps: Partial<EngineDeps>): void;
  getDeps(): EngineDeps;
  getSingleDep<T extends keyof EngineDeps>(name: T): EngineDeps[T];

  load(): Promise<void>;

  run(
    script: string,
    params: ScriptScopeParams,
    scriptRuntime: string,
    callback?: ScriptCallback,
    executeAfterCompile?: boolean
  ): Promise<unknown>;
  reactToInput(params: ScriptMyParticleParams): Promise<ReactToInputResult>;
  reactToParticle(params: ScriptParticleParams): Promise<ReactToParticleResult>;
}

// eslint-disable-next-line import/prefer-default-export
function enigine(): Engine {
  const entrypoints: ScriptEntrypoints = {};
  let context: ScriptingContext = { params: {}, user: {}, secrets: {} };
  let deps: EngineDeps;

  const scriptCallbacks = new Map<string, ScriptCallback>();

  let rune;

  const load = async () => {
    console.time('⚡️ Rune initialized! 🔋');
    rune = await initAsync();
    window.rune = rune;
    console.timeEnd('⚡️ Rune initialized! 🔋');
  };

  const setContext = (appContext: Partial<ScriptingContext>) => {
    context = { ...context, ...appContext };
  };

  const getDeps = () => deps;

  const setDeps = (appDeps: Partial<EngineDeps>) => {
    deps = { ...deps, ...appDeps };
  };

  const getSingleDep = (name: keyof EngineDeps) => deps[name];

  const setEntrypoints = (scriptEntrypoints: ScriptEntrypoints) => {
    (Object.keys(scriptEntrypoints) as ScriptEntrypoint[]).forEach((name) => {
      entrypoints[name] = scriptEntrypoints[name];
    });
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
    const {
      result,
      //   output,
      //   error,
      //   diagnostics_output,
      //   instructions,
      //   diagnostics,
    } = outputData;
    outputData.diagnosticsOutput = outputData.diagnostics_output;
    delete outputData.diagnostics_output;

    scriptCallbacks.delete(paramRefId);

    try {
      return {
        ...outputData,
        result: result ? JSON.parse(result) : null,
        // output,
        // error,
        // diagnosticsOutput: diagnostics_output,
        // instructions,
        // diagnostics,
      };
    } catch (e) {
      console.log('runeRun error', e, outputData);
      return {
        diagnosticsOutput: `n-genie error ${e}`,
        ...outputData,
      };
    }
  };

  const reactToParticle = async (
    params: ScriptParticleParams
  ): Promise<ReactToParticleResult> => {
    // if (!deps.queryClient) {
    //   throw Error('Cyber queryClient is not set');
    // }

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
      // console.log(`---reactToParticle ${cid} output: `, scriptResult);
    }

    return scriptResult.result;
  };

  const reactToInput = async (
    params: ScriptMyParticleParams
  ): Promise<ReactToInputResult> => {
    // if (!deps.queryClient) {
    //   throw Error('Cyber queryClient is not set');
    // }
    console.log('-------reactToInput', entrypoints, params);
    const { userScript, runtimeScript } = getEntrypointScripts(
      entrypoints,
      'myParticle'
    );

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
      return { action: 'error', nickname: '' };
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
    setContext,
  };
}

const scriptEngine = enigine();

export default scriptEngine;

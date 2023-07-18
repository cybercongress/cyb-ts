import { runScript } from 'src/services/scripting/engine';
import {
  ScriptParticleParams,
  ScriptMyParticleParams,
  ScriptScopeParams,
} from 'src/services/scripting/scritpting';

const compileScript = (
  code: string,
  runtime: string,
  executeAfterCompile: boolean,
  params: ScriptScopeParams = {}
) => runScript(code, params, runtime, undefined, executeAfterCompile);

export { compileScript };

import {
  scriptItemStorage,
  runScript,
  saveScript,
} from 'src/services/scripting/engine';
import { ScriptParticleParams } from 'src/services/scripting/scritpting';

const compileScript = (
  code: string,
  executeAfterCompile: boolean,
  particle?: ScriptParticleParams,
  runtime: string
) =>
  runScript(
    code,
    {
      particle,
    },
    runtime,
    undefined,
    executeAfterCompile
  );

export { highlightErrors, compileScript };

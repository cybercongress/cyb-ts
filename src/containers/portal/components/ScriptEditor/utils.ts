import scriptEngine from 'src/services/scripting/engine';

import { ScriptScopeParams } from 'src/types/scripting';

const compileScript = (
  code: string,
  runtime: string,
  executeAfterCompile: boolean,
  params: ScriptScopeParams = {}
) => scriptEngine.run(code, params, runtime, undefined, executeAfterCompile);

export { compileScript };

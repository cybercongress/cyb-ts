import scriptEngine, { CompilerParams } from 'src/services/scripting/engine';

const compileScript = (code: string, compilerParams: Partial<CompilerParams>) =>
  scriptEngine.run(code, compilerParams);

export { compileScript };

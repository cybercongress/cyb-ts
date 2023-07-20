import { Citizenship } from './citizenship';

type ParamsContext = {
  path?: string[];
  query?: string;
  search?: { [k: string]: string };
};

type UserContext = {
  address?: string;
  nickname?: string;
  passport?: Citizenship;
  particle?: string | null;
};

type ScriptContext = {
  params: ParamsContext;
  user: UserContext;
  secrets: Record<string, string>;
};

type ScriptEntrypoint = { title: string; runtime: string; user: string };

type ScriptEntrypoints = {
  particle?: ScriptEntrypoint;
  myParticle?: ScriptEntrypoint;
};

type ScriptEntrypointNames = keyof ScriptEntrypoints;

type ScriptCallbackStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'canceled'
  | 'error';

type ScriptCallback = (
  refId: string,
  status: ScriptCallbackStatus,
  result: unknown
) => void;

type ScriptParticleParams = {
  cid?: string;
  contentType?: string;
  content?: string;
};

type ScriptMyParticleParams = {
  nickname?: string;
  input?: string;
};

type ScriptParticleResult = {
  action: 'pass' | 'update_cid' | 'update_content' | 'hide' | 'error';
  cid?: string;
  content?: string;
};

type ScriptMyParticleResult = {
  action: 'pass' | 'answer' | 'error';
  answer?: string;
  nickname: string;
};

type ScriptScopeParams = {
  particle?: ScriptParticleParams;
  myParticle?: ScriptMyParticleParams;
  refId?: string;
};

type ScriptExecutionResult = {
  error?: string;
  result?: ScriptParticleResult | ScriptMyParticleResult;
  diagnosticsOutput?: string;
  output?: string;
  diagnostics?: object[];
  instructions?: string;
};

export {
  ScriptContext,
  UserContext,
  ParamsContext,
  ScriptEntrypointNames,
  ScriptEntrypoint,
  ScriptCallbackStatus,
  ScriptCallback,
  ScriptParticleParams,
  ScriptMyParticleParams,
  ScriptScopeParams,
  ScriptExecutionResult,
  ScriptEntrypoints,
  ScriptMyParticleResult,
  ScriptParticleResult,
};

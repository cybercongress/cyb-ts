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

type ScriptingContext = {
  params: ParamsContext;
  user: UserContext;
  secrets: Record<string, string>;
};

type ScriptItem = { title: string; runtime: string; user: string };

type ScriptEntrypoints = {
  particle?: ScriptItem;
  myParticle?: ScriptItem;
};

type ScriptEntrypoint = keyof ScriptEntrypoints;

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

type ReactToParticleResult = {
  action: 'pass' | 'update_cid' | 'update_content' | 'hide' | 'error';
  cid?: string;
  content?: string;
};

type ReactToInputResult = {
  action: 'pass' | 'answer' | 'error';
  answer?: string;
  nickname: string;
};

type ScriptScopeParams = {
  particle?: ScriptParticleParams;
  myParticle?: ScriptMyParticleParams;
  refId?: string;
};

type ScriptExecutionData = {
  error?: string;
  result?: ReactToParticleResult | ReactToInputResult;
  diagnosticsOutput?: string;
  output?: string;
  diagnostics?: object[];
  instructions?: string;
};

export {
  ScriptingContext,
  UserContext,
  ParamsContext,
  ScriptEntrypoint,
  ScriptItem,
  ScriptCallbackStatus,
  ScriptCallback,
  ScriptParticleParams,
  ScriptMyParticleParams,
  ScriptScopeParams,
  ScriptExecutionData,
  ScriptEntrypoints,
  ReactToInputResult,
  ReactToParticleResult,
};

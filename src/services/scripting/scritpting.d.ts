export type ScriptEntrypoint = 'particle' | 'my-particle'; // | 'search';

export type ScriptItem = { title: string; runtime: string; user: string };

export type ScriptCallbackStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'canceled'
  | 'error';

export type ScriptCallback = (
  refId: string,
  status: ScriptCallbackStatus,
  result: any
) => void;

export type ScriptParticleParams = {
  cid?: string;
  contentType?: string;
  content?: string;
};

export type ScriptScopeParams = {
  particle?: ScriptParticleParams;
  refId?: string;
};

export type ScriptExecutionData = {
  error?: string;
  result?: any;
  diagnosticsOutput?: string;
  output?: string;
  diagnostics?: Object[];
  instructions?: string;
};

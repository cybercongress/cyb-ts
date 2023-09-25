import { wrap } from 'comlink';
import { BackendWorkerApi } from './worker';

const worker = new SharedWorker(new URL('./worker.ts', import.meta.url), {
  name: 'backend-worker',
});

export const backendApi = wrap<BackendWorkerApi>(worker.port);

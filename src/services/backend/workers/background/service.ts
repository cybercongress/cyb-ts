import { wrap } from 'comlink';
import { BackendWorkerApi } from './worker';

const worker = new SharedWorker(new URL('./worker.ts', import.meta.url), {
  name: 'cyb~backend',
});

export const backendApi = wrap<BackendWorkerApi>(worker.port);

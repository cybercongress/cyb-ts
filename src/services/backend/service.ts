import { wrap } from 'comlink';
import { BackendWorkerApi } from './worker';

const worker = new Worker(new URL('./worker.ts', import.meta.url));

export const workerApi = wrap<BackendWorkerApi>(worker);

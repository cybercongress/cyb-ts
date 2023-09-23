import { wrap } from 'comlink';
import { BackendWorkerApi } from './worker';

const worker = new SharedWorker(new URL('./worker.ts', import.meta.url));
// worker.port.start();

export const workerApi = wrap<BackendWorkerApi>(worker.port);

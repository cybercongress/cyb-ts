import { WorkerUrl } from 'worker-url';
import { BackendWorkerApi } from './worker';
import { createWorker } from '../factoryMethods';

const workerUrl = new WorkerUrl(new URL('./worker.ts', import.meta.url));

export const { apiProxy: backendApi } = createWorker<BackendWorkerApi>(
  workerUrl,
  'cyb~backend'
);

// export const backendApi;

import { WorkerUrl } from 'worker-url';
import { BackendWorkerApi } from './worker';
import { createWorkerApi } from '../factoryMethods';

const workerUrl = new WorkerUrl(new URL('./worker.ts', import.meta.url));

export const { apiProxy: backendApi } = createWorkerApi<BackendWorkerApi>(
  workerUrl,
  'cyb~backend'
);

// export const backendApi;

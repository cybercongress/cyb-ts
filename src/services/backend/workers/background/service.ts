import { WorkerUrl } from 'worker-url';
import { BackgroundWorkerApi } from './worker';
import { createWorkerApi } from '../factoryMethods';

const workerUrl = new WorkerUrl(new URL('./worker.ts', import.meta.url));

export const { workerApiProxy: backgroundWorkerProxy } =
  createWorkerApi<BackgroundWorkerApi>(workerUrl, 'cyb~backend');

// export const backendApi;

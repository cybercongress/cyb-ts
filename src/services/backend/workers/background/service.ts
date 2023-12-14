import { WorkerUrl } from 'worker-url';
import { BackgroundWorker } from './worker';
import { createWorkerApi } from '../factoryMethods';

const workerUrl = new WorkerUrl(new URL('./worker.ts', import.meta.url));

export const { workerApiProxy: backgroundWorkerInstance } =
  createWorkerApi<BackgroundWorker>(workerUrl, 'cyb~backend');

// export const backendApi;

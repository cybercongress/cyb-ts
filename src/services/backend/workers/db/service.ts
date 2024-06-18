/* eslint-disable import/prefer-default-export */
import { WorkerUrl } from 'worker-url';
import { CozoDbWorker } from './worker';
import { createWorkerApi } from '../factoryMethods';

const workerUrl = new WorkerUrl(new URL('./worker.ts', import.meta.url));

export const { workerApiProxy: cozoDbWorkerInstance } =
  createWorkerApi<CozoDbWorker>(workerUrl, 'cyb~cozodb');

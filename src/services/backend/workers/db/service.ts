import { proxy, transferHandlers } from 'comlink';
import { BehaviorSubject, concatMap, filter, from } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { WorkerUrl } from 'worker-url';
import { CozoDbWorker } from './worker';
import { createWorkerApi } from '../factoryMethods';

const workerUrl = new WorkerUrl(new URL('./worker.ts', import.meta.url));

export const { workerApiProxy: cozoDbWorkerInstance } =
  createWorkerApi<CozoDbWorker>(workerUrl, 'cyb~cozodb');

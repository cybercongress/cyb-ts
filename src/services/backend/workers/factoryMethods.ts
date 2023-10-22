import { wrap, Remote, expose, transferHandlers } from 'comlink';
import { IPFSContentTransferHandler } from './serializers';

type WorkerType = SharedWorker | Worker;

// apply serializers
function installTransferHandlers() {
  transferHandlers.set('IPFSContent', IPFSContentTransferHandler);
}

// Create Shared Worker with fallback to usual Worker(in case of DEV too)
export function createWorkerApi<T>(
  workerUrl: URL,
  workerName: string
): { worker: WorkerType; apiProxy: Remote<T> } {
  installTransferHandlers();

  const isSharedWorkersSupported = typeof SharedWorker !== 'undefined';

  if (isSharedWorkersSupported && !process.env.IS_DEV) {
    const worker = new SharedWorker(workerUrl, { name: workerName });
    return { worker, apiProxy: wrap<T>(worker.port) };
  }

  const worker = new Worker(workerUrl);
  return { worker, apiProxy: wrap<T>(worker) };
}

export function exposeWorkerApi<T>(worker: WorkerType, api: T) {
  installTransferHandlers();

  if (typeof worker.onconnect !== 'undefined') {
    worker.onconnect = (e) => expose(api, e.ports[0]);
  } else {
    expose(api);
  }
}

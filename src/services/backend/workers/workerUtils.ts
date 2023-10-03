import { wrap, Remote, expose } from 'comlink';

type WorkerType = SharedWorker | Worker;

// Create Shared Worker with fallback to usual Worker(in case of DEV too)
// eslint-disable-next-line import/prefer-default-export
export function createWorker<T>(
  workerUrl: URL,
  workerName: string
): { worker: WorkerType; apiProxy: Remote<T> } {
  const isSharedWorkersSupported = typeof SharedWorker !== 'undefined';

  if (isSharedWorkersSupported && !process.env.IS_DEV) {
    const worker = new SharedWorker(workerUrl, { name: workerName });
    return { worker, apiProxy: wrap<T>(worker.port) };
  }

  const worker = new Worker(workerUrl);
  return { worker, apiProxy: wrap<T>(worker) };
}

export function exposeWorker<T>(worker: WorkerType, api: T) {
  if (typeof worker.onconnect !== 'undefined') {
    worker.onconnect = (e) => expose(api, e.ports[0]);
  } else {
    expose(api);
  }
}

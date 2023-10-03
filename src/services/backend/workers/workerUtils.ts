import { wrap, Remote, expose } from 'comlink';

type WorkerType = SharedWorker | Worker;

// Create Shared Worker with fallback to usual Worker(in case of DEV too)
// eslint-disable-next-line import/prefer-default-export
export function createWorker<T>(
  workerUrl: URL,
  workerName: string
): { worker: WorkerType; apiProxy: Remote<T> } {
  let worker: WorkerType;
  let port: MessagePort | null = null;
  const isSharedWorkersSupported = typeof SharedWorker !== 'undefined';
  const isDev = process.env.IS_DEV;
  if (isSharedWorkersSupported && !isDev) {
    worker = new SharedWorker(workerUrl, { name: workerName });
    port = (worker as SharedWorker).port;
  } else {
    worker = new Worker(workerUrl);
    port = null;
  }

  const apiProxy = wrap<T>(port || worker);

  return { worker, apiProxy };
}

export function onConnect(api, e) {
  return expose(api, e.ports[0]);
}

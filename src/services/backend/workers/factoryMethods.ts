import { wrap, Remote, expose, transferHandlers } from 'comlink';
import IPFSContentTransferHandler from './serializers/IPFSContentTransferHandler';
import {
  ObservableHandler,
  SubscriptionHandler,
} from './serializers/ObservableTransferHandler';
import { installLoggingHandler, overrideLogging } from './serializers/logging';

type WorkerType = SharedWorker | Worker;

const isSharedWorkersSupported = typeof SharedWorker !== 'undefined';

const isSharedWorkerUsed = isSharedWorkersSupported && !process.env.IS_DEV;

// apply serializers for custom types
function installTransferHandlers() {
  transferHandlers.set('IPFSContent', IPFSContentTransferHandler);
  transferHandlers.set('observable', ObservableHandler);
  transferHandlers.set('subscription', SubscriptionHandler);
}

// Create Shared Worker with fallback to usual Worker(in case of DEV too)
export function createWorkerApi<T>(
  workerUrl: URL,
  workerName: string
): { worker: WorkerType; workerApiProxy: Remote<T> } {
  installTransferHandlers();

  if (isSharedWorkerUsed) {
    const worker = new SharedWorker(workerUrl, { name: workerName });
    installLoggingHandler(worker.port, workerName);
    return { worker, workerApiProxy: wrap<T>(worker.port) };
  }

  const worker = new Worker(workerUrl);

  return { worker, workerApiProxy: wrap<T>(worker) };
}

export function exposeWorkerApi<T>(worker: WorkerType, api: T) {
  installTransferHandlers();
  if (typeof worker.onconnect !== 'undefined') {
    worker.onconnect = (e) => {
      const port = e.ports[0];
      overrideLogging(port);

      expose(api, port);
    };
  } else {
    expose(api);
  }
}

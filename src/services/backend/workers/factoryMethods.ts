import { wrap, Remote, expose, transferHandlers } from 'comlink';
import { IPFSContentTransferHandler } from './serializers';

type WorkerType = SharedWorker | Worker;

const isSharedWorkersSupported = typeof SharedWorker !== 'undefined';

const isSharedWorkerUsed =
  isSharedWorkersSupported && !process.env.IS_DEV && !window.__TAURI__;

// apply serializers for custom types
function installTransferHandlers() {
  transferHandlers.set('IPFSContent', IPFSContentTransferHandler);
}

function safeStringify(obj: any): string {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    return String(obj);
  }
}

// Override console.log to send logs to main thread
function overrideLogging(worker: Worker | MessagePort) {
  const consoleLogMap = {
    log: { original: console.log },
    error: { original: console.error },
    warn: { original: console.warn },
  };
  const replaceConsoleLog = (method: keyof typeof consoleLogMap) => {
    const { original } = consoleLogMap[method];

    consoleLogMap[method].original = console[method];

    console[method] = (...args) => {
      original.apply(console, args);
      const serializableArgs = args.map((arg) => safeStringify(arg));

      worker.postMessage({ type: 'console', method, args: serializableArgs });
    };
  };

  Object.keys(consoleLogMap).forEach((method) =>
    replaceConsoleLog(method as keyof typeof consoleLogMap)
  );
}

// Install handlers for logging from worker
function installLoggingHandler(worker: Worker | MessagePort, name: string) {
  // Add event listener
  worker.addEventListener('message', (event) => {
    if (event.data.type === 'console') {
      const { method, args } = event.data;

      console[method](name, ...args);
    }
  });
}

// Create Shared Worker with fallback to usual Worker(in case of DEV too)
export function createWorkerApi<T>(
  workerUrl: URL,
  workerName: string
): { worker: WorkerType; workerApiProxy: Remote<T> } {
  installTransferHandlers();
  // && !process.env.IS_DEV
  if (isSharedWorkerUsed) {
    const worker = new SharedWorker(workerUrl, { name: workerName });
    installLoggingHandler(worker.port, workerName);
    return { worker, workerApiProxy: wrap<T>(worker.port) };
  }

  const worker = new Worker(workerUrl);
  // installLoggingHandler(worker, workerName);
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
    // overrideLogging(worker);
    expose(api);
  }
}

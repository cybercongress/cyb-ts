function safeStringify(obj: any): string {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    return String(obj);
  }
}

// Override console.log to send logs to main thread
export function overrideLogging(worker: Worker | MessagePort) {
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
export function installLoggingHandler(
  worker: Worker | MessagePort,
  name: string
) {
  // Add event listener
  worker.addEventListener('message', (event) => {
    if (event.data.type === 'console') {
      const { method, args } = event.data;

      console[method](name, ...args);
    }
  });
}

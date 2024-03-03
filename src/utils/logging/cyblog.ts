import _, { isEmpty } from 'lodash';

/* eslint-disable import/no-unused-modules */
type LogLevel = 'info' | 'warn' | 'error' | 'trace';
type LogContext<T> = {
  thread: 'main' | 'cozo' | 'bckd';
  module?: string;
  component?: string;
  method?: string;
  stacktrace?: any[];
  formatter?: (message: T) => string;
};

type LogItem = {
  timestamp: Date;
  level: LogLevel;
  message: any;
  context?: Omit<LogContext<any>, 'stacktrace' | 'formatter'>;
  stacktrace?: any[];
};

const LOCAL_STORAGE_USE_CONSOLE_LOG_KEY = 'use_console_log';

let isLogging = false;

const originalConsoleError = console.error;

// Override the console.error function
console.error = (...args) => {
  // Check if the current call is made by your custom logger
  if (isLogging) {
    // It's a call from your logger; directly call the original console.error to avoid loop
    originalConsoleError.apply(console, args);
  } else {
    // Mark as logging to avoid re-entrance
    isLogging = true;

    // Call your custom logger here
    // For demonstration, let's assume your logger has a method named logError
    cyblog.error(...args);

    // Optionally, call the original console.error function if you still want the error to be logged in the console
    originalConsoleError.apply(console, args);

    // Reset the flag
    isLogging = false;
  }
};

declare global {
  interface Window {
    cyblogConsoleOn: (val: boolean) => void;
  }
}

window.cyblogConsoleOn = (val: boolean) => {
  if (val) {
    localStorage.setItem(LOCAL_STORAGE_USE_CONSOLE_LOG_KEY, 'on');
  } else {
    localStorage.removeItem(LOCAL_STORAGE_USE_CONSOLE_LOG_KEY);
  }
};

const createCybLog = () => {
  const logList: LogItem[] = [];

  function appendLog(logItem: LogItem, truncate = true) {
    logList.push(logItem);

    while (truncate && logList.length > 1000) {
      logList.shift(); // Remove the first element to keep the list size <= 1000
    }
  }

  function consoleLog<T>(
    level: LogLevel,
    message: T,
    context?: Partial<LogContext<T>>
  ) {
    const ctx = _.omit(context, ['formatter']);
    const ctxItem = isEmpty(ctx) ? '' : ctx;

    if (Array.isArray(message)) {
      console[level](...message, ctxItem);
      return;
    }

    if (context?.formatter) {
      console[level](context?.formatter(message), ctxItem);
      return;
    }

    console[level](message, ctxItem);
  }

  // eslint-disable-next-line import/no-unused-modules
  function log<T>(
    level: LogLevel,
    message: string | T,
    context?: LogContext<string | T>
  ) {
    const formattedMessage = context?.formatter
      ? context?.formatter(message)
      : message;

    const logEntry = {
      timestamp: new Date(),
      level,
      message: formattedMessage,
      stacktrace: context?.stacktrace,
      context: _.omit(context, ['formatter', 'stacktrace']),
    };

    appendLog(logEntry);

    !!localStorage.getItem(LOCAL_STORAGE_USE_CONSOLE_LOG_KEY) &&
      consoleLog(level, message, context);
  }

  function info<T>(message: T, context?: LogContext<string | T>) {
    return log('info', message, context);
  }

  function error<T>(message: T, context?: LogContext<string | T>) {
    return log('error', message, context);
  }

  function warn<T>(message: T, context?: LogContext<string | T>) {
    return log('warn', message, context);
  }

  function trace<T>(message: T, context?: LogContext<string | T>) {
    return log('warn', message, context);
  }

  return {
    log,
    info,
    error,
    warn,
    trace,
    logList,
    clear: () => logList.splice(0, logList.length),
  };
};

export type CybLog = typeof createCybLog;

const cyblog = createCybLog();

export default cyblog;

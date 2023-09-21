import { wrap } from 'comlink';
import BackgroundWorker from 'worker-loader!./worker';
import { BackgroundWorkerApi } from './worker';

// Initialize the worker and wrap it with Comlink
export const workerApi = wrap<BackgroundWorkerApi>(new BackgroundWorker());

// Listen to messages from the BroadcastChannel

// Example usage:

// Initialize the worker
// workerApi.init();

// Call sync in a non-blocking way
async function syncData() {
  //   await workerApi.syncIPFS(node);
}

// syncData();

export default { syncData };
// requestSyncState();

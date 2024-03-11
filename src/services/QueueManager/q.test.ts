import rxjsOperators from 'rxjs';

import QueueManager from './QueueManager';
import { BehaviorSubject, of } from 'rxjs';
import { CybIpfsNode } from '../ipfs/ipfs';
import { QueueStrategy } from './QueueStrategy';
import { IDeferredDbSaver } from './types';
import { valuesExpected } from 'src/utils/test-utils/test-utils';
import { fetchIpfsContent } from 'src/services/ipfs/utils/utils-ipfs';

// const mockTimeout = () => (source) => {
//   console.log('TIMEOUT');
//   return source;
// };

// Replace the real timeout with the mock
// rxjsOperators.timeout = mockTimeout;

jest.mock('rxjs', () => {
  const originalOperators = jest.requireActual('rxjs');
  return {
    ...originalOperators,
    debounceTime: jest.fn().mockImplementation(() => (source$) => source$),
    // timeout: jest.fn().mockImplementation(() => (source$) => source$),

    // timeout: jest.fn().mockImplementation(
    //   (config) => (source$) =>
    //     new originalOperators.Observable((subscriber) => {
    //       console.log('______TTTTTTTT');
    //       // Implement the mock logic here
    //       // This is a simplified example:
    //       // const timeout = setTimeout(() => {
    //       //   subscriber.error(new Error('Timeout has occurred'));
    //       // }, config);

    //       return source$.subscribe({
    //         next(value) {
    //           // clearTimeout(timeout);
    //           subscriber.next(value);
    //         },
    //         error(err) {
    //           // clearTimeout(timeout);
    //           subscriber.error(err);
    //         },
    //         complete() {
    //           // clearTimeout(timeout);
    //           subscriber.complete();
    //         },
    //       });
    //     })
    // ),
  };
});

// const mockDebounceTime = jest.fn(() => (source) => source);

// jest.mock('rxjs', () => {
//   const originalRxjs = jest.requireActual('rxjs/operators');
//   return {
//     ...originalRxjs,
//     debounceTime: mockDebounceTime,
//   };
// });

jest.mock('../backend/services/DeferredDbSaver/DeferredDbSaver'); // adjust the path as needed
// jest.mock('./QueueStrategy'); // adjust the path as needed
jest.mock('../ipfs/utils/ipfsCacheDb');

jest.mock('src/services/ipfs/utils/cluster.ts', () => ({ add: jest.fn() }));
jest.mock('src/services/backend/channels/BroadcastChannelSender');

// jest.mock('src/services/ipfs/utils/utils-ipfs.ts');
const mockFetchIpfsContent = jest.fn();
jest.mock('src/services/ipfs/utils/utils-ipfs.ts', () => ({
  // getMimeFromUint8Array: jest.fn(),
  // toAsyncIterableWithMime: jest.fn(),
  ipfsCacheDb: jest.fn(),
  cyberCluster: jest.fn(),
  // contentToUint8Array: jest.fn(),
  // createTextPreview: jest.fn(),
  // catIPFSContentFromNode: jest.fn(),
  // fetchIpfsContent: async (...args) => {
  //   console.log('-----fetchIpfsContent', args);
  //   return mockFetchIpfsContent();
  // },
  fetchIpfsContent: jest.fn(),
  // fetchIpfsContent: mockFetchIpfsContent,
  addContenToIpfs: jest.fn(),
}));

const TIMEOUT_MS = 300;

const queueStrategy = new QueueStrategy(
  {
    db: { timeout: TIMEOUT_MS, maxConcurrentExecutions: 2 },
    node: { timeout: TIMEOUT_MS, maxConcurrentExecutions: 2 },
    gateway: { timeout: TIMEOUT_MS, maxConcurrentExecutions: 2 },
  },
  ['db', 'node', 'gateway']
);

const cid1 = 'cid1';
const cid2 = 'cid1';
const cid3 = 'cid1';

const nextTick = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
};

function wrapPromiseWithSignal(
  promise: Promise<string>,
  signal?: AbortSignal
): Promise<string> {
  return new Promise((resolve, reject) => {
    promise.then((result) => {
      resolve(result);
    });

    signal?.addEventListener('abort', (e) => {
      // @ts-ignore
      if (e?.target?.reason !== 'timeout') {
        reject(new DOMException('canceled', 'AbortError'));
      }
    });
  });
}

const getPromise = (
  result = 'result',
  timeout = 500,
  signal?: AbortSignal
): Promise<string> =>
  wrapPromiseWithSignal(
    new Promise<string>((resolve) => {
      setTimeout(() => resolve(`result ${result}`), timeout);
    }),
    signal
  );

const mockNode: jest.Mocked<CybIpfsNode> = {
  nodeType: 'helia',
  reconnectToSwarm: jest.fn(),
};
jest.useFakeTimers();

describe('QueueManager without timers', () => {
  let queueManager: QueueManager;

  beforeEach(() => {
    // setup QueueManager instance before each test
    const deferredDbSaverMock: IDeferredDbSaver = {
      enqueueIpfsContent: jest.fn(),
      enqueueLinks: jest.fn(),
    };
    queueManager = new QueueManager(of(mockNode), {
      strategy: queueStrategy,
      queueDebounceMs: 1,
      defferedDbSaver: deferredDbSaverMock,
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('should instantiate without errors', () => {
    expect(queueManager).toBeInstanceOf(QueueManager);
  });

  test('should keep in pending items thats is out of maxConcurrentExecutions', () => {
    (fetchIpfsContent as jest.Mock).mockResolvedValue(undefined);

    queueManager.enqueue('1', jest.fn);
    queueManager.enqueue('2', jest.fn);
    queueManager.enqueue('3', jest.fn);
    const itemList = queueManager.getQueueList();
    expect(itemList[0].status).toEqual('executing');
    expect(itemList[1].status).toEqual('executing');
    expect(itemList[2].status).toEqual('pending');
  });

  test('should cancel queue items', (done) => {
    const statuses = valuesExpected(['pending', 'executing', 'cancelled']);
    // (fetchIpfsContent as jest.Mock).mockReturnValue(Promise.resolve('aaaaa'));
    (fetchIpfsContent as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        setTimeout(resolve, 500);
      })
    );
    //   async (cid: string, source: string, { controller }) =>
    //     wrapPromiseWithSignal(getPromise('result', 1000), controller.signal)
    // );

    queueManager.enqueue(cid1, (cid, status) => {
      console.log(`----${cid1} - enqueue cb()`, cid, status);
      expect(cid).toBe(cid1);
      expect(status).toBe(statuses.next().value);

      if (status === 'cancelled') {
        expect(queueManager.getQueueList()[0]?.controller?.signal.aborted).toBe(
          true
        );
      }
    });
    console.log('----queueList()', queueManager.getQueueList());
    jest.runOnlyPendingTimers();
    queueManager.cancel(cid1);
    jest.runOnlyPendingTimers();
    expect(queueManager.getQueueList().length).toEqual(0);
    // waitUtilQueueDebounce(() => {
    //   expect(queueManager.getQueueList().length).toEqual(0);
    //   done();
    // });
  });

  // test('should enqueue item, try to resolve all sources and return not_found', (done) => {

  //   queueManager.enqueue(cid1, (cid, status, source, result) => {
  //     expect(cid).toBe(cid1);

  //     const [statusExpected, sourceExpected] = responsesExpected.next().value;
  //     expect(status).toBe(statusExpected);
  //     expect(source).toBe(sourceExpected);
  //     jest.runOnlyPendingTimers();
  //     if (statusExpected === 'not_found') {
  //       console.log('---res', statusExpected, cid, source, status, result);
  //       done();
  //     }
  //   });
  // });

  test('should enqueue item, try to resolve all sources and return not_found', (done) => {
    (fetchIpfsContent as jest.Mock).mockResolvedValue(undefined);
    const responsesExpected = valuesExpected([
      ['pending', 'db'],
      ['executing', 'db'],
      ['error', 'db'],
      ['pending', 'node'],
      ['executing', 'node'],
      ['error', 'node'],
      ['pending', 'gateway'],
      ['executing', 'gateway'],
      ['error', 'gateway'],
      ['not_found', 'gateway'],
    ]);

    queueManager.enqueue(cid1, (cid, status, source, result) => {
      expect(cid).toBe(cid1);

      const [statusExpected, sourceExpected] = responsesExpected.next().value;
      expect(status).toBe(statusExpected);
      expect(source).toBe(sourceExpected);
      jest.runOnlyPendingTimers();
      if (statusExpected === 'not_found') {
        console.log('---res', statusExpected, cid, source, status, result);
        // jest.clearAllTimers();
        done();
      }
      // expect(source).toBe('db');
      // done();
    });
  });
});

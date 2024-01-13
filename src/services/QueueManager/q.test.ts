import QueueManager from './QueueManager';
import { BehaviorSubject, of } from 'rxjs';
import { CybIpfsNode } from '../ipfs/ipfs';
import { QueueStrategy } from './QueueStrategy';
import { IDeferredDbSaver } from './types';

jest.mock('../backend/services/DeferredDbSaver/DeferredDbSaver'); // adjust the path as needed
// jest.mock('./QueueStrategy'); // adjust the path as needed
jest.mock('../ipfs/utils/ipfsCacheDb');

jest.mock('src/services/ipfs/utils/cluster.ts', () => ({ add: jest.fn() }));
jest.mock('src/services/backend/channels/BroadcastChannelSender');

const mockFetchIpfsContent = jest.fn();
jest.mock('src/services/ipfs/utils/utils-ipfs.ts', () => ({
  // getMimeFromUint8Array: jest.fn(),
  // toAsyncIterableWithMime: jest.fn(),
  ipfsCacheDb: jest.fn(),
  cyberCluster: jest.fn(),
  // contentToUint8Array: jest.fn(),
  // createTextPreview: jest.fn(),
  // catIPFSContentFromNode: jest.fn(),
  fetchIpfsContent: mockFetchIpfsContent,
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

jest.useFakeTimers();

describe('QueueManager', () => {
  let queueManager: QueueManager;
  let mockNode: jest.Mocked<CybIpfsNode>;

  beforeEach(() => {
    // setup QueueManager instance before each test
    const deferredDbSaverMock: IDeferredDbSaver = {
      enqueueIpfsContent: jest.fn(),
      enqueueLinks: jest.fn(),
    };
    queueManager = new QueueManager(of(mockNode), {
      strategy: queueStrategy,
      queueDebounceMs: 0,
      defferedDbSaver: deferredDbSaverMock,
    });
  });

  afterEach(() => {
    // cleanup after each test if needed
  });

  test('should instantiate without errors', () => {
    expect(queueManager).toBeInstanceOf(QueueManager);
  });

  // Add more tests here for each method of QueueManager
  // For example, if there's a method named `enqueue`, you might write:

  test('should enqueue item', (done) => {
    queueManager.enqueue(cid1, (cid, status, source) => {
      expect(cid).toBe(cid1);
      expect(status).toBe('pending');
      expect(source).toBe('db');
      done();
    });
  });
});

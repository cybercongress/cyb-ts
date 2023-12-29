import { of } from 'rxjs';

import { CybIpfsNode } from 'src/services/ipfs/ipfs';

import DbApi, {
  mockPutSyncQueue,
  mockPutSyncStatus,
  mockRemoveSyncQueue,
  mockUpdateSyncQueue,
} from '../../../dataSource/indexedDb/__mocks__/dbApiWrapperMock';
import SyncQueue from '../SyncQueue';
import { ServiceDeps } from '../types';
import { SyncQueueItem } from '../../types';

jest.mock('src/services/backend/services/sync/utils');
jest.mock('src/services/backend/services/dataSource/indexedDb/dbApiWrapper');
jest.mock('src/services/backend/channels/BroadcastChannelSender');

describe('SyncTransactionsLoop', () => {
  beforeEach(() => {
    mockPutSyncStatus.mockClear(); // = jest.fn();
    mockPutSyncQueue.mockClear();
    DbApi.mockClear();
  });

  it('start should subscribe to isInitialized$ and keep queue unprocessed', async () => {
    const resolveAndSaveParticle = jest.fn();
    const mockItems: SyncQueueItem[] = [
      {
        id: 'mockId',
        priority: 1,
      },
    ];
    const mockServiceDeps: ServiceDeps = {
      dbInstance$: of(new DbApi()),
      ipfsInstance$: of(undefined), // no ipfs instance - should not to be initialized
      params$: of({
        myAddress: null,
        followings: [],
      }),
      resolveAndSaveParticle,
    };
    const syncQueue = new SyncQueue(mockServiceDeps);
    await syncQueue.enqueue(mockItems);

    syncQueue.start().loop$.subscribe({
      next: console.log,
      error: console.error,
    });
    expect(mockPutSyncQueue).toHaveBeenCalledWith(mockItems);
    expect(resolveAndSaveParticle).toHaveBeenCalledTimes(0);
    expect([...syncQueue.queue.keys()]).toEqual([mockItems[0].id]);

    return Promise.resolve();
  });

  // Unit test for processSyncQueue method
  it('processSyncQueue should process the items in the sync queue', (done) => {
    const resolveAndSaveParticle = jest.fn();
    resolveAndSaveParticle.mockResolvedValueOnce({
      item: {},
      status: 'completed',
      source: 'db',
    });
    resolveAndSaveParticle.mockResolvedValueOnce({
      item: {},
      status: 'not_found',
      source: 'db',
    });

    const mockServiceDeps: ServiceDeps = {
      dbInstance$: of(new DbApi()),
      ipfsInstance$: of({} as CybIpfsNode),
      params$: of({
        myAddress: null,
        followings: [],
      }),
      resolveAndSaveParticle,
    };
    const syncQueue = new SyncQueue(mockServiceDeps);
    const mockItems = [
      {
        id: 'mockToOk',
        priority: 1,
      },
      {
        id: 'mockToNotFound',
        priority: 1,
      },
    ];
    syncQueue.enqueue(mockItems);

    syncQueue.start().loop$.subscribe({
      next: () => {
        expect(mockPutSyncQueue).toHaveBeenCalledWith(mockItems);
        expect(resolveAndSaveParticle).toHaveBeenCalledTimes(2);
        expect(mockRemoveSyncQueue).toHaveBeenCalledWith(['mockToOk']);
        expect(mockUpdateSyncQueue).toHaveBeenCalledWith([
          {
            id: 'mockToNotFound',
            status: -1,
          },
        ]);
        expect(syncQueue.queue.size).toEqual(0);
        done();
      },
      error: (err) => done(err),
    });
  });
});

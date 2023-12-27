import { of } from 'rxjs';

import { fetchCyberlinksAndGetStatus } from 'src/services/backend/services/sync/utils';
import SyncQueue from 'src/services/backend/services/sync/services/SyncQueue';
import { CybIpfsNode } from 'src/services/ipfs/ipfs';

import { ServiceDeps } from '../types';
import SyncParticlesLoop from '../SyncParticlesLoop';

import DbApi, {
  mockFindSyncStatus,
  mockPutSyncStatus,
} from '../../../dataSource/indexedDb/__mocks__/dbApiWrapperMock';

jest.mock('src/services/backend/services/sync/utils');
jest.mock('src/services/backend/services/dataSource/indexedDb/dbApiWrapper');
jest.mock('src/services/backend/channels/BroadcastChannelSender');

describe('SyncParticlesLoop', () => {
  let syncParticlesLoop: SyncParticlesLoop;
  let mockSyncQueue;
  beforeEach(() => {
    // putSyncStatusMock = jest.fn().mockResolvedValue(undefined);
    mockPutSyncStatus.mockClear(); // = jest.fn();
    DbApi.mockClear();
    // const db = new DbApi();
    mockFindSyncStatus.mockResolvedValueOnce([
      {
        id: 'cid',
        unreadCount: 0,
        timestampUpdate: 333,
        timestampRead: 222,
      },
    ]);

    const db = new DbApi();
    const mockServiceDeps: ServiceDeps = {
      dbInstance$: of(db),
      ipfsInstance$: of({} as CybIpfsNode), // replace with your mock data
      params$: of({
        myAddress: null,
        followings: [],
        cyberIndexUrl: 'test-index-url',
      }), // replace with your mock data
      resolveAndSaveParticle: jest.fn(), // replace with your mock data
    };
    mockSyncQueue = new SyncQueue(mockServiceDeps);

    syncParticlesLoop = new SyncParticlesLoop(mockServiceDeps, mockSyncQueue);
  });

  it('should call fetchCyberlinksAndGetStatus and putSyncStatus correctly', (done) => {
    const stubSyncStatus = {
      id: 'cid',
      entryType: 'particle',
      timestampUpdate: 123,
      timestampRead: 123,
      unreadCount: 0,
      lastId: 'neuron1',
      disabled: false,
      meta: { direction: 'from' },
    };

    (fetchCyberlinksAndGetStatus as jest.Mock).mockResolvedValueOnce(
      stubSyncStatus
    );

    syncParticlesLoop.start().loop$.subscribe({
      next: () => {
        expect(mockPutSyncStatus).toHaveBeenCalledWith([stubSyncStatus]);
        done();
      },
      error: (err) => done(err),
    });
  });
});

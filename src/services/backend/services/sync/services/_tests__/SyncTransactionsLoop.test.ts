import { of } from 'rxjs';

import {
  fetchTransactionsIterable,
  fetchCyberlinksIterable,
} from 'src/services/backend/services/dataSource/blockchain/requests';
import { CybIpfsNode } from 'src/services/ipfs/ipfs';

import DbApi, {
  mockFindSyncStatus,
  mockPutSyncStatus,
  mockGetSyncStatus,
} from 'src/services/backend/services/dataSource/indexedDb/__mocks__/dbApiWrapperMock';

import SyncQueue from '../SyncQueue';
import { ServiceDeps } from '../types';
import SyncTransactionsLoop from '../SyncTransactionsLoop';
import { createAsyncIterable } from 'src/utils/async/iterable';
import { CYBER_LINK_TRANSACTION_TYPE } from '../../../dataSource/blockchain/types';
import { CID_TWEET } from 'src/utils/consts';
import { EntryType } from 'src/services/CozoDb/types/entities';

jest.mock('src/services/backend/services/dataSource/blockchain/requests');
jest.mock('src/services/backend/services/dataSource/indexedDb/dbApiWrapper');
jest.mock('src/services/backend/channels/BroadcastChannelSender');

describe('SyncTransactionsLoop', () => {
  let syncTransactionsLoop: SyncTransactionsLoop;
  let mockSyncQueue;
  const myAddress = 'user-address';
  beforeEach(() => {
    mockPutSyncStatus.mockClear();
    mockGetSyncStatus.mockClear();

    DbApi.mockClear();
    mockGetSyncStatus.mockResolvedValueOnce({
      id: myAddress,
      unreadCount: 0,
      timestampUpdate: 333,
      timestampRead: 222,
    });
    // mockFindSyncStatus.mockResolvedValueOnce([
    //   {
    //     id: myAddress,
    //     unreadCount: 0,
    //     timestampUpdate: 333,
    //     timestampRead: 222,
    //   },
    // ]);

    const db = new DbApi();
    const mockServiceDeps: ServiceDeps = {
      dbInstance$: of(db),
      ipfsInstance$: of({} as CybIpfsNode),
      params$: of({
        myAddress,
        followings: [],
        cyberIndexUrl: 'test-index-url',
      }),
      resolveAndSaveParticle: jest.fn(),
    };
    mockSyncQueue = new SyncQueue(mockServiceDeps);

    syncTransactionsLoop = new SyncTransactionsLoop(
      mockServiceDeps,
      mockSyncQueue
    );
  });

  it('should call fetchTransactionsIterable and putSyncStatus correctly', (done) => {
    const particleTest = 'cid';

    const stubTransactionsBatched = [
      [
        {
          type: CYBER_LINK_TRANSACTION_TYPE,
          value: {
            links: [{ from: CID_TWEET, to: particleTest }],
          },
          transaction: {
            block: { timestamp: '2022-01-01' },
            transaction_hash: 'hash123',
          },
        },
      ],
    ];

    const stubCyberlinksData = [
      [{ from: particleTest, to: 'mockTo2', timestamp: '2022-01-10' }],
      [{ from: 'mockFrom1', to: particleTest, timestamp: '2022-01-01' }],
    ];

    (fetchTransactionsIterable as jest.Mock).mockReturnValue(
      createAsyncIterable(stubTransactionsBatched)
    );
    (fetchCyberlinksIterable as jest.Mock).mockReturnValue(
      createAsyncIterable(stubCyberlinksData)
    );

    syncTransactionsLoop.start().loop$.subscribe({
      next: () => {
        expect(mockPutSyncStatus).toHaveBeenCalledWith([
          {
            id: particleTest,
            entryType: EntryType.particle,
            timestampUpdate: 1641753000000,
            timestampRead: 0,
            unreadCount: 2,
            lastId: 'mockTo2',
            disabled: false,
            meta: { direction: 'from' },
          },
        ]);
        done();
      },
      error: (err) => done(err),
    });
  });
});

import { BehaviorSubject, combineLatest, defer, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SyncService } from './sync';
import { DbApi } from '../dataSource/indexedDb/dbApiWrapper';
import { CybIpfsNode } from 'src/services/ipfs/ipfs';
import { FetchIpfsFunc } from './types';
import BroadcastChannelSender from '../../channels/BroadcastChannelSender';
import {
  fetchTransactionsIterable,
  fetchTransactions,
  fetchCyberlinkSyncStats,
} from '../dataSource/blockchain/requests';

jest.mock('../../channels/BroadcastChannelSender');
jest.mock('../dataSource/blockchain/requests', () => ({
  fetchTransactions: jest.fn().mockImplementation(() => {
    // Your mock implementation here
    return [];
  }),
  fetchTransactionsIterable: jest.fn().mockImplementation(() => {
    // Your mock implementation here
    return [];
  }),
  fetchCyberlinkSyncStats: jest.fn().mockImplementation(() => {
    // Your mock implementation here
    return [];
  }),
}));
describe('SyncService', () => {
  let syncService: SyncService;
  let dbApiMock: jest.Mocked<DbApi>;
  let mockBroadcastChannelSender: jest.Mocked<BroadcastChannelSender>;

  // beforeEach(() => {
  //   channelApiMock =
  //     new BroadcastChannelSender() as jest.Mocked<BroadcastChannelSender>;
  //   const resolveAndSaveParticleMock = jest.fn();

  //   syncService = new SyncService(resolveAndSaveParticleMock);
  //   syncService.channelApi = channelApiMock;
  // });

  beforeEach(() => {
    // Reset the mock before each test
    BroadcastChannelSender.mockClear();

    // Create an instance of SyncService for testing
    syncService = new SyncService(jest.fn());

    // Get the mock instance of BroadcastChannelSender
    mockBroadcastChannelSender = BroadcastChannelSender.mock.instances[0];

    dbApiMock = {
      putParticles: jest.fn(),
      putCyberlinks: jest.fn(),
      findSyncStatus: jest.fn(),
    } as jest.Mocked<DbApi>;
  });

  it('should post "started" status when initialized', async () => {
    // Simulate initialization
    syncService.init(dbApiMock);
    syncService.initIpfs(/* mock ipfsNode */);

    // Assert that postSyncStatus was called with 'started'
    expect(mockBroadcastChannelSender.postSyncStatus).toHaveBeenCalledWith(
      'started'
    );
  });

  it('should create an instance of SyncService with mocked BroadcastChannelSender', () => {
    expect(syncService).toBeDefined();
    expect(channelApiMock.postServiceStatus).not.toHaveBeenCalled();
  });
});

describe('SyncService', () => {
  let syncService: SyncService;
  let dbApiMock: jest.Mocked<DbApi>;
  let ipfsNodeMock: jest.Mocked<CybIpfsNode>;
  let resolveAndSaveParticleMock: jest.Mocked<FetchIpfsFunc>;

  beforeEach(() => {
    dbApiMock = {
      putTransactions: jest.fn(),
      getSyncStatus: jest.fn(),
      putSyncStatus: jest.fn(),
      updateSyncStatus: jest.fn(),
      getPins: jest.fn(),
      deletePins: jest.fn(),
      putPins: jest.fn(),
      getParticles: jest.fn(),
      findSyncStatus: jest.fn(),
    } as jest.Mocked<DbApi>;

    ipfsNodeMock = {} as jest.Mocked<CybIpfsNode>;

    resolveAndSaveParticleMock = jest.fn();

    // jest.mock('../dataSource/blockchain/requests', () => ({
    //   fetchTransactions: jest.fn().mockImplementation(() => {
    //     // Your mock implementation here
    //     return [];
    //   }),
    // }));
    syncService = new SyncService(resolveAndSaveParticleMock);
    syncService.init(dbApiMock);
    syncService.initIpfs(ipfsNodeMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setParams', () => {
    it('should set the parameters', () => {
      const params = {
        myAddress: 'address',
        followings: ['address1', 'address2'],
      };
      syncService.setParams(params);

      expect(syncService['params']).toEqual(params);
    });
  });

  // describe('startBlockchainLoop', () => {
  //   it('should start the blockchain loop', () => {
  //     const createLoopObservableMock = jest.spyOn(
  //       syncService as any,
  //       'createLoopObservable'
  //     );
  //     const syncAllTransactionsMock = jest.spyOn(
  //       syncService as any,
  //       'syncAllTransactions'
  //     );

  //     syncService['startBlockchainLoop']();

  //     expect(createLoopObservableMock).toHaveBeenCalledWith(
  //       expect.any(Number),
  //       expect.any(Observable),
  //       syncService['dbInitialized$']
  //     );

  //     expect(syncAllTransactionsMock).toHaveBeenCalled();
  //   });
  // });

  // describe('startIpfsLoop', () => {
  //   it('should start the IPFS loop', () => {
  //     const createLoopObservableMock = jest.spyOn(
  //       syncService as any,
  //       'createLoopObservable'
  //     );
  //     const syncPinsMock = jest.spyOn(syncService as any, 'syncPins');

  //     syncService['startIpfsLoop']();

  //     expect(createLoopObservableMock).toHaveBeenCalledWith(
  //       expect.any(Number),
  //       expect.any(Observable),
  //       syncService['isInitialized$']
  //     );

  //     expect(syncPinsMock).toHaveBeenCalled();
  //   });
  // });

  describe('syncTransactions', () => {
    const address = 'address';

    beforeEach(() => {
      //   dbApiMock.getSyncStatus.mockResolvedValue({
      //     timestampRead: 0,
      //     unreadCount: 0,
      //     timestampUpdate: 0,
      //   }),
      //   putTransactions: jest.fn(),
      //   putSyncStatus: jest.fn(),
      //   findSyncStatus: jest.fn().mockResolvedValue({
      //     rows: [['cid', 0, 0, 0]],
      //   }),
      // } as jest.Mocked<DbApi>;
      dbApiMock.getSyncStatus.mockResolvedValue({
        timestampRead: 0,
        unreadCount: 0,
        timestampUpdate: 0,
      });
      // dbApiMock.getSyncStatus.mockResolvedValue({
      //   timestampRead: 123,
      //   unreadCount: 0,
      //   timestampUpdate: 0,
      // });
      dbApiMock.findSyncStatus = jest.fn().mockResolvedValue({
        headers: ['id', 'timestamp_read', 'unread_count', 'timestamp_update'],
        ok: true,
        rows: [['cid', 0, 0, 0]],
      });
      syncService = new SyncService(jest.fn());

      syncService.init(dbApiMock);
    });

    it('should sync transactions and update sync status', async () => {
      // console.log('----dbApiMock', dbApiMock);

      // console.log('----dbApiMock', dbApiMock.findSyncStatus({ id: address }));
      const putTransactionsMock = jest.spyOn(dbApiMock, 'putTransactions');
      const putSyncStatusMock = jest.spyOn(dbApiMock, 'putSyncStatus');

      (
        fetchTransactions as jest.MockedFunction<typeof fetchTransactions>
      ).mockResolvedValue([]); //transactions

      // await syncService['syncTransactions'](address, true);
      (
        fetchCyberlinkSyncStats as jest.MockedFunction<
          typeof fetchCyberlinkSyncStats
        >
      ).mockResolvedValue([]);
      expect(dbApiMock.getSyncStatus).toHaveBeenCalled(); // .toHaveBeenCalledWith(address);

      expect(putTransactionsMock).toHaveBeenCalled();

      expect(putSyncStatusMock).toHaveBeenCalledWith({
        entry_type: 'transactions',
        id: address,
        timestamp_update: expect.any(Number),
        unread_count: expect.any(Number),
        timestamp_read: expect.any(Number),
        disabled: false,
        last_id: expect.any(String),
        meta: {},
      });
    });
  });

  // describe('syncParticles', () => {
  //   beforeEach(() => {
  //     dbApiMock.findSyncStatus.mockResolvedValue({
  //       rows: [['cid', 0, 0, 0]],
  //     });
  //   });

  //   it('should sync particles and update sync status', async () => {
  //     const fetchCyberlinkSyncStatsMock = jest.fn().mockResolvedValue({
  //       firstTimestamp: 123,
  //       lastTimestamp: 456,
  //       count: 1,
  //       lastLinkedParticle: 'cid',
  //       isFrom: true,
  //     });
  //     const updateSyncStatusMock = jest.spyOn(dbApiMock, 'updateSyncStatus');

  //     jest
  //       .spyOn(syncService as any, 'fetchCyberlinkSyncStats')
  //       .mockImplementation(fetchCyberlinkSyncStatsMock);

  //     await syncService['syncParticles']();

  //     expect(dbApiMock.findSyncStatus).toHaveBeenCalledWith({
  //       entryType: 'particle',
  //     });

  //     expect(fetchCyberlinkSyncStatsMock).toHaveBeenCalledWith(
  //       expect.any(String),
  //       'cid',
  //       expect.any(Number)
  //     );

  //     expect(updateSyncStatusMock).toHaveBeenCalledWith(
  //       'cid',
  //       expect.any(Number),
  //       expect.any(Number),
  //       expect.any(Number),
  //       'cid',
  //       { direction: 'from' }
  //     );
  //   });
  // });

  describe('syncPins', () => {
    beforeEach(() => {
      dbApiMock.getPins.mockResolvedValue({
        rows: [['cid']],
      });
    });

    it('should sync pins and update pin and particle status', async () => {
      const fetchPinsMock = jest
        .fn()
        .mockResolvedValue([
          { cid: { toString: () => 'cid1' } },
          { cid: { toString: () => 'cid2' } },
        ]);
      const putPinsMock = jest.spyOn(dbApiMock, 'putPins');
      const deletePinsMock = jest.spyOn(dbApiMock, 'deletePins');
      const getParticlesMock = jest.spyOn(dbApiMock, 'getParticles');

      jest
        .spyOn(syncService as any, 'fetchPins')
        .mockImplementation(fetchPinsMock);

      await syncService['syncPins']();

      expect(fetchPinsMock).toHaveBeenCalledWith(ipfsNodeMock);

      expect(deletePinsMock).toHaveBeenCalledWith(['cid']);

      expect(putPinsMock).toHaveBeenCalledWith([
        expect.objectContaining({ cid: 'cid1' }),
        expect.objectContaining({ cid: 'cid2' }),
      ]);

      expect(getParticlesMock).toHaveBeenCalled();

      expect(resolveAndSaveParticleMock).toHaveBeenCalledWith('cid1');
      expect(resolveAndSaveParticleMock).toHaveBeenCalledWith('cid2');
    });
  });

  describe('syncMyTransactions', () => {
    it('should sync transactions for my address', async () => {
      syncService.setParams({ myAddress: 'address' });

      const syncTransactionsMock = jest.spyOn(
        syncService as any,
        'syncTransactions'
      );

      await syncService['syncMyTransactions']();

      expect(syncTransactionsMock).toHaveBeenCalledWith('address', true);
    });
  });

  describe('syncFollowingsTransactions', () => {
    it('should sync transactions for followings', async () => {
      syncService.setParams({ followings: ['address1', 'address2'] });

      const syncTransactionsMock = jest.spyOn(
        syncService as any,
        'syncTransactions'
      );

      await syncService['syncFollowingsTransactions']();

      expect(syncTransactionsMock).toHaveBeenCalledWith('address1', false);
      expect(syncTransactionsMock).toHaveBeenCalledWith('address2', false);
    });
  });

  describe('syncAllTransactions', () => {
    it('should sync all transactions', async () => {
      const syncMyTransactionsMock = jest.spyOn(
        syncService as any,
        'syncMyTransactions'
      );
      const syncParticlesMock = jest.spyOn(syncService as any, 'syncParticles');

      await syncService['syncAllTransactions']();

      expect(syncMyTransactionsMock).toHaveBeenCalled();
      expect(syncParticlesMock).toHaveBeenCalled();
    });
  });
});

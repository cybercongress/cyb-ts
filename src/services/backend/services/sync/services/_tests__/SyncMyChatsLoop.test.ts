import { of } from 'rxjs';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { dateToNumber } from 'src/utils/date';
import SyncMyChatsLoop from '../SyncMyChatsLoop/SyncMyChatsLoop';
import { ServiceDeps } from '../types';
import {
  MSG_MULTI_SEND_TRANSACTION_TYPE,
  MSG_SEND_TRANSACTION_TYPE,
} from '../../../dataSource/blockchain/types';

import DbApi, {
  mockFindSyncStatus,
  mockPutSyncStatus,
  mockGetSyncStatus,
  mockUpdateSyncStatus,
  mockGetTransactions,
} from '../../../dataSource/indexedDb/__mocks__/dbApiWrapperMock';

jest.mock('src/services/backend/channels/BroadcastChannelSender');

describe('SyncMyChatsLoop', () => {
  let syncMyChatsLoop: SyncMyChatsLoop;
  const myAddress = 'my-address';
  beforeEach(() => {
    mockPutSyncStatus.mockClear();
    mockGetSyncStatus.mockClear();
    mockFindSyncStatus.mockClear();
    mockUpdateSyncStatus.mockClear();

    const db = new DbApi();
    const mockServiceDeps: ServiceDeps = {
      params$: of({ myAddress, followings: [] }),
      dbInstance$: of(db),
      ipfsInstance$: of({} as any),
    };
    syncMyChatsLoop = new SyncMyChatsLoop(mockServiceDeps);
  });

  it('should sync my chats', (done) => {
    const mockTransactions = [
      {
        type: MSG_SEND_TRANSACTION_TYPE,
        value: {
          amount: [{ denom: 'ATOM', amount: '100' }],
          from_address: myAddress,
          to_address: 'receiver1',
        },
        transaction: {
          block: { timestamp: '2022-01-01' },
          transaction_hash: 'hash123',
        },
      },
      {
        type: MSG_SEND_TRANSACTION_TYPE,
        value: {
          amount: [{ denom: 'ATOM', amount: '10' }],
          from_address: myAddress,
          to_address: 'receiver1',
        },
        transaction: {
          block: { timestamp: '2022-01-10' },
          transaction_hash: 'hash321',
          memo: 'hello test',
        },
      },
      {
        type: MSG_MULTI_SEND_TRANSACTION_TYPE,
        value: {
          inputs: [
            { address: 'sender2', coins: [{ amount: '50', denom: 'ATOM' }] },
          ],
          outputs: [
            { address: myAddress, coins: [{ amount: '50', denom: 'ATOM' }] },
          ],
        },
        transaction: {
          block: { timestamp: '2022-01-02' },
          transaction_hash: 'hash456',
        },
      },
    ];

    mockFindSyncStatus.mockResolvedValueOnce([
      {
        id: 'sender2',
        timestampUpdate: dateToNumber('2022-01-01'),
        unreadCount: 1,
        timestampRead: 0,
        disabled: false,
        lastId: '',
        meta: {},
      },
    ]);

    mockGetTransactions.mockResolvedValueOnce(mockTransactions);

    syncMyChatsLoop.start().loop$.subscribe(() => {
      expect(mockFindSyncStatus).toHaveBeenCalledWith({
        entryType: EntryType.chat,
      });

      expect(mockUpdateSyncStatus).toHaveBeenCalledWith({
        id: 'sender2',
        timestampUpdate: dateToNumber('2022-01-02'),
        unreadCount: 1,
        meta: { amount: [{ denom: 'ATOM', amount: '50' }], memo: undefined },
      });

      expect(mockPutSyncStatus).toHaveBeenCalledWith({
        entryType: EntryType.chat,
        id: 'receiver1',
        timestampUpdate: dateToNumber('2022-01-10'),
        unreadCount: 2,
        timestampRead: 0,
        disabled: false,
        lastId: undefined,
        meta: { amount: [{ denom: 'ATOM', amount: '10' }], memo: 'hello test' },
      });
      done();
    });
  });
});

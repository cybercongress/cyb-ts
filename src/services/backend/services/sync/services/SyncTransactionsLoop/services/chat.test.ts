import { of } from 'rxjs';

import { EntryType } from 'src/services/CozoDb/types/entities';
import { dateToNumber } from 'src/utils/date';
import { ServiceDeps } from '../../types';
import {
  MSG_MULTI_SEND_TRANSACTION_TYPE,
  MSG_SEND_TRANSACTION_TYPE,
} from '../../../../dataSource/blockchain/types';

import DbApi, {
  mockFindSyncStatus,
  mockPutSyncStatus,
  mockGetSyncStatus,
  mockUpdateSyncStatus,
  mockGetTransactions,
} from '../../../../dataSource/indexedDb/__mocks__/dbApiWrapperMock';

import { syncMyChats } from './chat';

jest.mock('src/services/backend/channels/BroadcastChannelSender');

describe('SyncMyChatsLoop', () => {
  const myAddress = 'my-address';
  const db = new DbApi();

  beforeEach(() => {
    mockPutSyncStatus.mockClear();
    mockGetSyncStatus.mockClear();
    mockFindSyncStatus.mockClear();
    mockUpdateSyncStatus.mockClear();
  });

  it('should sync my chats', async () => {
    const mockTransactions = [
      {
        type: MSG_SEND_TRANSACTION_TYPE,
        value: {
          amount: [{ denom: 'ATOM', amount: '100' }],
          from_address: myAddress,
          to_address: 'receiver1',
        },
        timestamp: dateToNumber('2022-01-01'),
        hash: 'hash000',
      },
      {
        type: MSG_SEND_TRANSACTION_TYPE,
        value: {
          amount: [{ denom: 'ATOM', amount: '10' }],
          from_address: myAddress,
          to_address: 'receiver1',
        },
        timestamp: dateToNumber('2022-01-10'),
        hash: 'hash321',
        memo: 'hello test',
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
        timestamp: dateToNumber('2022-01-02'),
        hash: 'hash456',
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

    await syncMyChats(db, myAddress);
    expect(mockFindSyncStatus).toHaveBeenCalledWith({
      entryType: EntryType.chat,
      ownerId: 'my-address',
    });

    expect(mockPutSyncStatus).toHaveBeenCalledWith({
      entryType: EntryType.chat,
      id: 'receiver1',
      ownerId: 'my-address',
      timestampUpdate: dateToNumber('2022-01-10'),
      unreadCount: 2,
      timestampRead: 0,
      disabled: false,
      lastId: 'hash321',
      meta: {
        amount: [{ denom: 'ATOM', amount: '10' }],
        memo: 'hello test',
        direction: 'to',
      },
    });

    expect(mockUpdateSyncStatus).toHaveBeenCalledWith({
      id: 'sender2',
      timestampUpdate: dateToNumber('2022-01-02'),
      unreadCount: 1,
      ownerId: 'my-address',
      meta: {
        amount: [{ denom: 'ATOM', amount: '50' }],
        direction: 'from',
        memo: undefined,
      },
    });
  });
});

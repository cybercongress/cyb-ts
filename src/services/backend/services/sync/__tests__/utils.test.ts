import { CID_TWEET } from 'src/utils/consts';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { dateToNumber } from 'src/utils/date';

import { extractParticlesResults, fetchCyberlinksAndGetStatus } from '../utils';
import { CYBER_LINK_TRANSACTION_TYPE } from '../../dataSource/blockchain/types';
import { fetchCyberlinksIterable } from '../../dataSource/blockchain/requests';
import { createAsyncIterable } from 'src/utils/async/iterable';

jest.mock('../../dataSource/blockchain/requests', () => ({
  fetchCyberlinksIterable: jest.fn(),
}));

test('extractParticlesResults should return correct results', () => {
  // Mock input batch
  const batch = [
    {
      type: CYBER_LINK_TRANSACTION_TYPE,
      value: {
        links: [
          { from: CID_TWEET, to: 'to1' },
          { from: CID_TWEET, to: 'to2' },
        ],
      },
      transaction: {
        block: { timestamp: new Date() },
      },
    },
    {
      type: 'ANOTHER_TRANSACTION_TYPE',
      value: {
        // Add relevant data for the new transaction type
      },
      transaction: {
        block: { timestamp: new Date() },
      },
    },
    {
      type: CYBER_LINK_TRANSACTION_TYPE,
      value: {
        links: [{ from: CID_TWEET, to: 'to3' }],
      },
      transaction: {
        block: { timestamp: new Date() },
      },
    },
    // Add more mock transactions as needed
  ];

  // Call the function
  const result = extractParticlesResults(batch);
  // Assert the expected output
  expect(result.tweets).toEqual({
    to1: {
      timestamp: expect.any(Number),
      direction: 'from',
      from: CID_TWEET,
      to: 'to1',
    },
    to2: {
      timestamp: expect.any(Number),
      direction: 'from',
      from: CID_TWEET,
      to: 'to2',
    },
    to3: {
      timestamp: expect.any(Number),
      direction: 'from',
      from: CID_TWEET,
      to: 'to3',
    },
  });
  expect(result.tweets).toEqual(
    expect.objectContaining({
      to1: expect.any(Object),
      to2: expect.any(Object),
      to3: expect.any(Object),
    })
  );
  expect(result.particlesFound).toEqual(
    expect.arrayContaining([CID_TWEET, 'to1', 'to2', 'to3'])
  );
  expect(result.links.length).toBe(3); // Update the expected links count
});

test('fetchCyberlinksAndGetStatus should return correct status', async () => {
  // Mock input parameters
  const cid = 'mockCid';
  const resolveAndSaveParticle = jest.fn();
  const pushToSyncQueue = jest.fn();

  // WARN fetchCyberlinksIterable should return values in descending order
  const mockCyberlinksData = [
    [{ from: 'mockFrom2', to: 'mockTo2', timestamp: '2022-01-10' }],
    [{ from: 'mockFrom1', to: 'mockTo1', timestamp: '2022-01-01' }],
  ];

  (fetchCyberlinksIterable as jest.Mock).mockReturnValue(
    createAsyncIterable(mockCyberlinksData)
  );

  const result = await fetchCyberlinksAndGetStatus(
    'mockUrl',
    cid,
    0,
    0,
    0,
    resolveAndSaveParticle,
    pushToSyncQueue
  );
  // Assert the expected output based on the mockCyberlinksData
  expect(result).toEqual({
    id: cid,
    timestampUpdate: dateToNumber(mockCyberlinksData[0][0].timestamp),
    timestampRead: 0,
    unreadCount: 2,
    lastId: 'mockFrom2',
    meta: { direction: 'to' },
    disabled: false,
    entryType: EntryType.particle,
  });

  expect(resolveAndSaveParticle).toHaveBeenCalledWith('mockFrom2');
});

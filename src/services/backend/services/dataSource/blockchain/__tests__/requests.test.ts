// Assuming you are using a testing framework like Jest

import {
  fetchTransactionsIterable,
  fetchTransactions,
  fetchCyberlinksIterable,
  fetchCyberlinkSyncStats,
} from '../requests';
import { request } from 'graphql-request';
import { gql } from 'graphql-tag';
import { dateToNumber } from 'src/utils/date';

jest.mock('graphql-request');

describe('fetchTransactionsIterable', () => {
  it('should iterate over fetched transactions', async () => {
    const mockResponse = {
      messages_by_address: [
        { id: 1, value: 100 },
        { id: 2, value: 200 },
      ],
    };
    const mockCyberIndexUrl = 'mockUrl';
    const mockNeuronAddress = 'mockAddress';
    const mockTimestamp = 12345;

    request.mockResolvedValue(mockResponse);

    const iterable = fetchTransactionsIterable(
      mockCyberIndexUrl,
      mockNeuronAddress,
      mockTimestamp
    );

    const result1 = await iterable.next();
    expect(result1.value).toEqual([
      { id: 1, value: 100 },
      { id: 2, value: 200 },
    ]);
  });
});

describe('fetchTransactions', () => {
  it('should fetch transactions by address', async () => {
    const mockResponse = {
      messages_by_address: [
        { id: 1, value: 100 },
        { id: 2, value: 200 },
      ],
    };
    const mockCyberIndexUrl = 'mockUrl';
    const mockNeuronAddress = 'mockAddress';
    const mockTimestampFrom = 12345;

    request.mockResolvedValue(mockResponse);

    const result = await fetchTransactions(
      mockCyberIndexUrl,
      mockNeuronAddress,
      mockTimestampFrom
    );

    expect(result).toEqual([
      { id: 1, value: 100 },
      { id: 2, value: 200 },
    ]);
  });
});

describe('fetchCyberlinksIterable', () => {
  it('should iterate over fetched cyberlinks', async () => {
    const mockResponse = {
      cyberlinks: [
        { id: 1, from: 'A', to: 'B' },
        { id: 2, from: 'C', to: 'D' },
      ],
    };
    const mockCyberIndexUrl = 'mockUrl';
    const mockParticleCid = 'mockCid';
    const mockTimestamp = 12345;

    request.mockResolvedValue(mockResponse);

    const iterable = fetchCyberlinksIterable(
      mockCyberIndexUrl,
      mockParticleCid,
      mockTimestamp
    );

    const result1 = await iterable.next();
    expect(result1.value).toEqual([
      { id: 1, from: 'A', to: 'B' },
      { id: 2, from: 'C', to: 'D' },
    ]);
  });
});

describe('fetchCyberlinkSyncStats', () => {
  it('should fetch sync stats for cyberlinks', async () => {
    const mockResponse = {
      first: [{ timestamp: '2022-01-01' }],
      last: [{ timestamp: '2022-01-10', to: 'A', from: 'B' }],
      cyberlinks_aggregate: { aggregate: { count: 5 } },
    };
    request.mockResolvedValue(mockResponse);

    const result = await fetchCyberlinkSyncStats('mockUrl', 'A', 12345);

    expect(result).toEqual({
      firstTimestamp: 1640975400000, // timestamp converted to number
      lastTimestamp: 1641753000000, // timestamp converted to number
      lastLinkedParticle: 'B', // last linked particle
      isFrom: false, // example value, based on the mock response
      count: 5, // count of cyberlinks
    });
  });
});

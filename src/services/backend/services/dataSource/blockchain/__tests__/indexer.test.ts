import { fetchCyberlinksIterable } from '../indexer';
import { fetchTransactionsIterable } from '../../../indexer/transactions';
import { request } from 'graphql-request';

jest.mock('graphql-request');

describe('fetchTransactionsIterable', () => {
  it('should iterate over fetched transactions', async () => {
    const mockResponse = [
      [
        { id: 1, value: 100 },
        { id: 2, value: 200 },
      ],
      [{ id: 3, value: 300 }],
    ];

    const mockCyberIndexUrl = 'mockUrl';
    const mockNeuronAddress = 'mockAddress';
    const mockTimestamp = 12345;

    (request as jest.Mock).mockResolvedValueOnce({
      messages_by_address: mockResponse[0],
    });
    (request as jest.Mock).mockResolvedValueOnce({
      messages_by_address: mockResponse[1],
    });
    (request as jest.Mock).mockResolvedValueOnce({
      messages_by_address: [],
    });
    const iterable = fetchTransactionsIterable(
      mockCyberIndexUrl,
      mockNeuronAddress,
      mockTimestamp
    );

    const result1 = await iterable.next();
    expect(result1.value).toEqual(mockResponse[0]);
    const result2 = await iterable.next();
    expect(result2.value).toEqual(mockResponse[1]);
    const result3 = await iterable.next();
    expect(result3.done).toEqual(true);
  });
});

// const mockResponse = {
//   messages_by_address: [
//     {
//       transaction_hash: 'th1',
//       value: {
//         msg: 'msg1==',
//         funds: [],
//         sender: 'sender-addr',
//         contract: 'contact-addr',
//       },
//       transaction: {
//         success: true,
//         block: {
//           timestamp: '2023-12-18T10:28:13.942406',
//           height: 11324342,
//         },
//         memo: '[bostrom] cyb.ai, using keplr',
//       },
//       type: 'cosmwasm.wasm.v1.MsgExecuteContract',
//     },
//     {
//       transaction_hash: 'th2',
//       value: {
//         links: [
//           {
//             to: 'cid1',
//             from: 'cid2',
//           },
//         ],
//         neuron: 'neuron-addre',
//       },
//     },
//   ],
// };

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

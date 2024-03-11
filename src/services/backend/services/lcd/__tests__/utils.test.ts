import { getTransaction } from '../lcd';
import { mapLcdTransactionsToDto } from '../utils';

// Simplified mock response focusing on utilized fields
const mockResponses = {
  txs: [
    {
      body: {
        messages: [
          {
            '@type': '/cosmos.bank.v1beta1.MsgSend',
            from_address: 'from_addr',
            to_address: 'to_addr',
            amount: [{ denom: 'boot', amount: '1' }],
          },
        ],
        memo: 'Test memo',
      },
      tx_response: {
        txhash: 'TESTHASH123456',
        code: 0,
        timestamp: '2024-02-14T12:04:00Z',
      },
    },
  ],
};

describe('mapLcdTransactionsToDto', () => {
  it('correctly maps LCD transactions to DTO format', () => {
    const neuron = 'neuronXYZ';
    const result = mapLcdTransactionsToDto(neuron, mockResponses);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          hash: 'TESTHASH123456',
          type: 'cosmos.bank.v1beta1.MsgSend',
          memo: 'Test memo',
          neuron: 'neuronXYZ',
          success: true,
          value: expect.objectContaining({
            from_address: 'from_addr',
            to_address: 'to_addr',
            amount: expect.arrayContaining([
              expect.objectContaining({
                denom: 'boot',
                amount: '1',
              }),
            ]),
          }),
        }),
      ])
    );
  });

  it('correctly fetch and map real transaction', async () => {
    const neuron = 'neuronXYZ';
    const msgSendTransaction =
      '67FD87EBCC1633B779C154C1CAFD48DE71350074A04F742DAD418F69F1D05BB0';
    const response = await getTransaction(msgSendTransaction);
    const result = mapLcdTransactionsToDto(neuron, response.data);
    console.log('---r', result);
  });
});

import { TransactionDto } from 'src/services/CozoDb/types/dto';
import { NeuronAddress } from 'src/types/base';
import { dateToUtcNumber } from 'src/utils/date';

// eslint-disable-next-line import/no-unused-modules, import/prefer-default-export
export const mapLcdTransactionsToDto = (
  neuron: NeuronAddress,
  response: any
) => {
  const transactions: TransactionDto[] = [];

  response.txs.forEach((item) => {
    const {
      timestamp,
      body: { memo, messages, height },
      tx_response: { txhash, code },
    } = item;

    messages.forEach((msg: any, index: number) => {
      const type = msg['@type'].substring(1);
      delete msg['@type'];
      transactions.push({
        hash: txhash,
        index,
        type,
        timestamp: dateToUtcNumber(timestamp),
        value: msg,
        memo,
        neuron,
        blockHeight: height,
        success: code === 0,
      });
    });
  });

  return transactions;
};

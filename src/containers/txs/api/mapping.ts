import { CosmosTxV1Beta1GetTxResponse } from 'src/generated/data-contracts';

export const mapResponseDataGetTxs = (
  dataTxs: CosmosTxV1Beta1GetTxResponse
) => {
  return {
    info: {
      txHash: dataTxs.tx_response?.txhash || '',
      height: dataTxs.tx_response?.height || '',
      status: dataTxs.tx_response?.code === 0,
      timestamp: dataTxs.tx_response?.timestamp || '',
      memo: dataTxs.tx?.body?.memo || '',
    },
    rawLog:
      dataTxs.tx_response?.code !== 0
        ? dataTxs.tx_response?.raw_log
        : undefined,
    messages: dataTxs.tx?.body?.messages || [],
  };
};

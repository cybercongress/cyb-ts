import {
  GetTxsEventRequest,
  GetTxsEventResponse,
  GetTxsEventResponseAmino,
} from '@cybercongress/cyber-ts/cosmos/tx/v1beta1/service';
import axios from 'axios';
import { LCD_URL } from 'src/constants/config';

type PropsTx = {
  events: ReadonlyArray<{ key: string; value: string }>;
  pagination?: GetTxsEventRequest['pagination'];
  orderBy?: GetTxsEventRequest['orderBy'];
};

// eslint-disable-next-line import/prefer-default-export
export async function getTransactions({
  events,
  pagination = { limit: 20, offset: 0 },
  orderBy,
  config,
}: PropsTx) {
  const { offset, limit } = pagination;
  const response = await axios.get<GetTxsEventResponseAmino>(
    `${LCD_URL}/cosmos/tx/v1beta1/txs`,
    {
      params: {
        'pagination.offset': offset,
        'pagination.limit': limit,
        orderBy,
        events: events.map((evn) => `${evn.key}='${evn.value}'`),
      },
      paramsSerializer: {
        indexes: null,
      },
      signal: config?.signal,
    }
  );

  const { txs } = response.data;

  // bullshit formatting FIXME:
  //   const formatted = GetTxsEventResponse.fromAmino(response.data);
  // from amino to protobuf
  const formatted = {
    txs,
    pagination: response.data.pagination || {},
    txResponses: response.data.tx_responses,
  } as GetTxsEventResponse;

  if (!formatted.pagination?.total) {
    formatted.pagination.total = formatted.txResponses.length;
  }

  return formatted;
}

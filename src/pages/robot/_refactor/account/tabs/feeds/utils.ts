import dateFormat from 'dateformat';
import { RegistryTypes } from 'src/services/soft.js/types';
// import { TxResponse } from '@cybercongress/cyber-ts/cosmos/base/abci/v1beta1/abci';
import { LogItem } from './type';

export const mapLogData = (data: any): LogItem[] =>
  data.reduce((acc, item) => {
    return acc;
    // debugger;
    // const t = TxResponse.decode(item.tx.value);

    let cyberLinkMessage = item.tx.body.messages[0];

    if (!cyberLinkMessage) {
      return acc;
    }

    if (cyberLinkMessage['@type'] === RegistryTypes.MsgExec) {
      [cyberLinkMessage] = cyberLinkMessage.msgs;
    }

    const cid = cyberLinkMessage.links[0].to;

    if (!cid) {
      return acc;
    }

    return [
      ...acc,
      {
        timestamp: item.timestamp,
        txhash: item.txhash,
        cid,
      },
    ];
  }, []);

type LogItemByDate = {
  [key: string]: LogItem[];
};

export const reduceByDate = (data: LogItem[]) => {
  return Object.entries(
    data.reduce<LogItemByDate>((acc, item) => {
      const date = dateFormat(item.timestamp, 'yyyy-mm-dd');

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(item);

      return acc;
    }, {})
  );
};

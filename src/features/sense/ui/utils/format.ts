import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import {
  MsgMultiSendTransaction,
  MsgSendTransaction,
} from 'src/services/backend/services/dataSource/blockchain/types';
import { SenseMetaType } from 'src/services/backend/types/sense';

import { SenseItem } from '../../redux/sense.redux';

// eslint-disable-next-line import/prefer-default-export, import/no-unused-modules
export function formatSenseItemDataToUI(
  senseItem: SenseItem,
  currentAddress: string
): {
  text: string;
  timestamp: string;
  amount: Coin[] | undefined;
  amountSendDirection: 'to' | 'from' | undefined;
  from: string;
  // isAmountSend: boolean;
  cid: string | undefined;
  hash: string;
} {
  const { timestamp, type, memo, meta } = senseItem;

  let from;
  let amount: Coin[] | undefined;
  let isAmountSend = false;
  let cid;

  switch (type) {
    case 'cosmos.bank.v1beta1.MsgSend': {
      const { amount: a } = meta as MsgSendTransaction['value'];

      if (a && !Array.isArray(a)) {
        debugger;
        break;
      }

      amount = a;

      break;
    }

    case 'cosmos.bank.v1beta1.MsgMultiSend': {
      const v = meta as MsgMultiSendTransaction['value'];

      // from = v.inputs[0].address;
      amount = v.outputs.find(
        (output) => output.address === currentAddress
      )?.coins;

      break;
    }

    case 'cyber.graph.v1beta1.MsgCyberlink': {
      cid = meta.to;

      break;
    }

    default: {
      break;
    }
  }

  return {
    ...senseItem,
    text: memo,
    amount,
    cid,
  };

  // switch (type) {

  //   case SenseMetaType.particle: {
  //     // const item = senseItem as LinkDbEntity;

  //     from = senseItem.from;
  //     hash = senseItem.transactionHash;
  //     cid = senseItem.lastId;

  //     break;
  //   }

  //   case SenseMetaType.follow: {
  //     debugger;

  //     break;
  //   }
  //   case SenseMetaType.tweet: {
  //     text = senseItem.text;
  //     from = senseItem.neuron;
  //     cid = senseItem.to;

  //     break;
  //   }

  //   case SenseMetaType.transaction: {
  //     text = senseItem.text;
  //     from = senseItem.neuron;
  //     cid = senseItem.to;

  //     break;
  //   }

  //   default: {
  //     console.error('unknown type');
  //     console.log(senseItem);
  //   }
  // }

  // return {
  //   timestamp,
  //   text,
  //   amount,
  //   from,
  //   hash,
  //   cid,
  //   amountSendDirection: isAmountSend ? 'from' : 'to',
  // };
}

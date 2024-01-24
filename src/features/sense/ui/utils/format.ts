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
  timestamp: string;
  text: string;
  amount: Coin[] | undefined;
  amountSendDirection: 'to' | 'from' | undefined;
  from: string;
  // isAmountSend: boolean;
  cid: string | undefined;
  hash: string;
} {
  const { timestamp, itemType, id, value, memo, meta } = senseItem;

  let from;
  let text = memo;
  let amount: Coin[] | undefined;
  let isAmountSend = false;
  let hash = senseItem.hash;
  let cid;

  switch (itemType) {
    case SenseMetaType.send: {
      const v = value as MsgSendTransaction['value'];

      from = v?.from_address || id;

      if (v.amount) {
        // FIXME: move to redux
        amount = Array.isArray(v.amount) ? v.amount : Object.values(v.amount);
      }

      text = memo;
      isAmountSend = from === currentAddress;

      if (senseItem.type === 'cosmos.bank.v1beta1.MsgMultiSend') {
        const v = value as MsgMultiSendTransaction['value'];

        from = v.inputs[0].address;
        amount = v.outputs.find(
          (output) => output.address === currentAddress
        )?.coins;
      }

      break;
    }

    case SenseMetaType.particle: {
      // const item = senseItem as LinkDbEntity;

      from = senseItem.from;
      hash = senseItem.transactionHash;
      cid = senseItem.lastId;

      break;
    }

    case SenseMetaType.follow: {
      debugger;

      break;
    }
    case SenseMetaType.tweet: {
      text = senseItem.text;
      from = senseItem.neuron;
      cid = senseItem.to;

      break;
    }

    case SenseMetaType.transaction: {
      text = senseItem.text;
      from = senseItem.neuron;
      cid = senseItem.to;

      break;
    }

    default: {
      console.error('unknown type');
      // debugger;
      console.log(senseItem);
    }
  }

  return {
    timestamp,
    text,
    amount,
    from,
    hash,
    cid,
    amountSendDirection: isAmountSend ? 'to' : 'from',
  };
}

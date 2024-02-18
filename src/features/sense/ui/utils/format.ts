import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import {
  MsgMultiSendTransaction,
  MsgSendTransaction,
} from 'src/services/backend/services/indexer/types';

import { SenseItem } from '../../redux/sense.redux';

// eslint-disable-next-line import/prefer-default-export, import/no-unused-modules
export function formatSenseItemDataToUI(
  senseItem: SenseItem,
  currentAddress: string
): SenseItem & {
  text: string;
  cid: string | undefined;
  amount: Coin[] | undefined;
  isAmountSendToMyAddress: boolean;
} {
  const { type, memo, meta } = senseItem;

  let amount: Coin[] | undefined;
  let isAmountSendToMyAddress = false;
  let cid;

  switch (type) {
    case 'cosmos.bank.v1beta1.MsgSend': {
      const { amount: a, to_address: toAddress } =
        meta as MsgSendTransaction['value'];

      if (a && !Array.isArray(a)) {
        debugger;
        break;
      }

      amount = a;
      isAmountSendToMyAddress = toAddress === currentAddress;

      break;
    }

    case 'cosmos.bank.v1beta1.MsgMultiSend': {
      const v = meta as MsgMultiSendTransaction['value'];

      const a = v.outputs.find(
        (output) => output.address === currentAddress
      )?.coins;

      if (a) {
        amount = a;
        isAmountSendToMyAddress = true;
      }

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
    text: memo || '',
    cid,
    amount,
    isAmountSendToMyAddress,
  };
}

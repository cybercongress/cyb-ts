import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';

import { TransactionDto } from 'src/services/CozoDb/types/dto';
import { NeuronAddress } from 'src/types/base';
import {
  MsgSendTransaction,
  CyberLinkTransaction,
} from '../services/dataSource/blockchain/types';

export type SenseChatMessage = {
  amount: Coin[];
  memo?: string;
};

export type SenseChat = {
  userAddress: NeuronAddress;
  last: SenseChatMessage;
  transactions: TransactionDto[];
};

export type SenseTransaction =
  | MsgSendTransaction
  | MsgSendTransaction
  | CyberLinkTransaction;

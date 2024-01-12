import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';

import { TransactionDto } from 'src/services/CozoDb/types/dto';
import { NeuronAddress, ParticleCid } from 'src/types/base';
import {
  MsgSendTransaction,
  CyberLinkTransaction,
  MsgMultiSendTransaction,
} from '../services/dataSource/blockchain/types';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { LinkDirection } from '../services/sync/types';

export type SenseChat = {
  userAddress: NeuronAddress;
  last: SenseChatMessage;
  transactions: TransactionDto[];
};

export type SenseUnread = {
  entryType: EntryType;
  unread: number;
};

type SenseParticleMeta = {
  id: { text: string; mime: string };
  lastId: { text: string; mime: string };
  direction: LinkDirection;
};

type SenseUserMeta = {
  value: SenseTransaction['value'];
  memo?: string;
  type: string;
};

export type SenseChatMessage = {
  amount: Coin[];
  memo?: string;
};

export type SenseMeta = SenseParticleMeta | SenseUserMeta | SenseChatMessage;

export type SenseListItem = {
  entryType: EntryType;
  id: NeuronAddress | ParticleCid;
  unreadCont: number;
  timestampUpdate: number;
  timestampRead: number;
  lastId: NeuronAddress | ParticleCid;
  meta: { direction: 'from' | 'to' } | SenseChatMessage;
};

export type SenseTransaction =
  | MsgSendTransaction
  | MsgMultiSendTransaction
  | CyberLinkTransaction;

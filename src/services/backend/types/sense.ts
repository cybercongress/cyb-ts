/* eslint-disable import/no-unused-modules */
import { NeuronAddress, ParticleCid, TransactionHash } from 'src/types/base';
import { EntryType } from 'src/services/CozoDb/types/entities';

import {
  MsgSendTransaction,
  CyberLinkTransaction,
  MsgMultiSendTransaction,
} from '../services/dataSource/blockchain/types';

export type SenseTransaction =
  | MsgSendTransaction
  | MsgMultiSendTransaction
  | CyberLinkTransaction;

export type SenseUnread = {
  entryType: EntryType;
  unreadCount: number;
};

export const enum SenseMetaType {
  link = 2,
  transaction = 1,
}

export type SenseLinkMeta = {
  from: ParticleCid;
  to: ParticleCid;
  neuron: NeuronAddress;
  timestamp: number;
};

export type SenseTransactionMeta = {
  transaction_hash: TransactionHash;
  index: number;
};

export type SenseTransactionResultMeta = {
  timestamp: number;
  success: boolean;
  value: Object;
  memo?: string;
} & SenseTransactionMeta;

export type SenseLinkResultMeta = {
  timestamp: number;
} & SenseLinkMeta;

export type SenseMeta = SenseLinkMeta | SenseTransactionMeta;

export type SenseResultMeta = SenseLinkResultMeta | SenseTransactionResultMeta;

export type SenseListItem = {
  entryType: EntryType;
  id: NeuronAddress | ParticleCid;
  unreadCount: number;
  timestampUpdate: number;
  timestampRead: number;
  meta: SenseResultMeta;
};

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

// Extension for Chat item to separate chat sync from tweet sync
export type SenseChatExtesnsion = {
  timestampUpdateChat?: number;
  timestampUpdateContent?: number;
};

export type SenseMeta = (SenseLinkMeta | SenseTransactionMeta) &
  SenseChatExtesnsion;

export type SenseResultMeta = SenseLinkResultMeta | SenseTransactionResultMeta;

export type SenseListChatItem = {
  entryType: EntryType;
  id: NeuronAddress;
  unreadCount: number;
  timestampUpdate: number;
  timestampRead: number;
  meta: SenseResultMeta & SenseChatExtesnsion;
};

export type SenseListParticleItem = {
  entryType: EntryType;
  id: ParticleCid;
  unreadCount: number;
  timestampUpdate: number;
  timestampRead: number;
  meta: SenseLinkResultMeta;
};

export type SenseListItem = SenseListParticleItem | SenseListChatItem;

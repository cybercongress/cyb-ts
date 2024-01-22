import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';

import { TransactionDto } from 'src/services/CozoDb/types/dto';
import { NeuronAddress, ParticleCid } from 'src/types/base';
import { EntryType } from 'src/services/CozoDb/types/entities';

import {
  MsgSendTransaction,
  CyberLinkTransaction,
  MsgMultiSendTransaction,
} from '../services/dataSource/blockchain/types';
import { LinkDirection } from '../services/sync/types';

export type SenseTransaction =
  | MsgSendTransaction
  | MsgMultiSendTransaction
  | CyberLinkTransaction;

export type SenseChat = {
  userAddress: NeuronAddress;
  last: SenseMessageResultMeta;
  transactions: TransactionDto[];
};

export type SenseUnread = {
  entryType: EntryType;
  unread: number;
};

type ParticlePreResolved = { cid?: ParticleCid; text: string; mime: string };

export const enum SenseMetaType {
  follow = 3.3,
  tweet = 3.2,
  send = 3.1,
  particle = 2,
  transaction = 1,
}

type SenseTweetMeta = {
  from: Partial<ParticlePreResolved>;
  to: ParticlePreResolved;
};

type SenseParticleMeta = {
  direction: LinkDirection;
};

type SenseTransactionMeta = {
  memo?: string;
};

export type SenseTransactionResultMeta = {
  metaType: SenseMetaType.transaction;
} & SenseTransactionMeta;

export type SenseParticleResultMeta = {
  metaType: SenseMetaType.particle;
  id: ParticlePreResolved;
  lastId: ParticlePreResolved;
} & SenseParticleMeta;

export type SenseTweetResultMeta = {
  metaType: SenseMetaType.tweet;
} & SenseTweetMeta;

export type SenseMessageResultMeta = {
  metaType: SenseMetaType.send;
  amount: Coin[];
  memo?: string;
  direction: LinkDirection;
};

export type SenseMeta =
  | SenseParticleMeta
  | SenseTransactionMeta
  | SenseTweetMeta;

export type SenseResultMeta =
  | SenseParticleResultMeta
  | SenseMessageResultMeta
  | SenseTransactionResultMeta
  | SenseTweetResultMeta;

export type SenseListItem = {
  entryType: EntryType;
  id: NeuronAddress | ParticleCid;
  unreadCount: number;
  timestampUpdate: number;
  timestampRead: number;
  lastId: NeuronAddress | ParticleCid;
  meta: SenseResultMeta;
};

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
  tweet = 3.2,
  sendMessage = 3.1,
  particle = 2,
  transaction = 1,
}

type SenseTweetMeta = {
  metaType: SenseMetaType.tweet;
  lastId: ParticlePreResolved;
};

type SenseParticleMeta = {
  metaType: SenseMetaType.particle;
  direction: LinkDirection;
};

type SenseTransactionMeta = {
  metaType: SenseMetaType.transaction;
  memo?: string;
};

export type SenseParticleResultMeta = {
  id: ParticlePreResolved;
  lastId: ParticlePreResolved;
} & SenseParticleMeta;

export type SenseTweetResultMeta = {
  lastId: ParticlePreResolved;
} & SenseTweetMeta;

type SenseMessageResultMeta = {
  metaType: SenseMetaType.sendMessage;
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
  unreadCont: number;
  timestampUpdate: number;
  timestampRead: number;
  lastId: NeuronAddress | ParticleCid;
  meta: SenseResultMeta;
};
